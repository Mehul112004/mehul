import * as fs from 'fs/promises';
import { VectorIndex, RetrievalResult } from '../types/index.js';

/**
 * Calculates the cosine similarity between two vectors.
 * Formula: dot(a, b) / (norm(a) * norm(b))
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: query is ${a.length}, index is ${b.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class VectorStore {
  private indexPath: string;
  private index: VectorIndex | null = null;

  constructor(indexPath: string = './index.json') {
    this.indexPath = indexPath;
  }

  /**
   * Lazily loads the vector index from disk if it hasn't been loaded already.
   */
  private async ensureIndexLoaded(): Promise<VectorIndex> {
    if (!this.index) {
      try {
        const rawContent = await fs.readFile(this.indexPath, 'utf-8');
        this.index = JSON.parse(rawContent) as VectorIndex;
      } catch (error) {
        throw new Error(
          `Failed to load vector index from "${this.indexPath}". Please run the ingestion script first: "npm run ingest"`
        );
      }
    }
    return this.index;
  }

  /**
   * Searches the index for the top-K most similar chunks to the query embedding.
   * Filters out scores below 0.15.
   */
  public async search(
    queryEmbedding: number[],
    topK: number,
    queryText?: string
  ): Promise<RetrievalResult[]> {
    const loadedIndex = await this.ensureIndexLoaded();
    
    const projectResults: RetrievalResult[] = [];
    const resumeResults: RetrievalResult[] = [];

    for (const chunk of loadedIndex.chunks) {
      const score = cosineSimilarity(queryEmbedding, chunk.embedding);
      const isResume = chunk.project === "Mehul Sharma" || 
                       (chunk.source && chunk.source.toLowerCase().includes('resume'));

      // Strip the float embedding vector before returning to save memory
      const { embedding, ...chunkWithoutEmbedding } = chunk;

      if (isResume) {
        if (score >= 0.05) {
          resumeResults.push({
            chunk: chunkWithoutEmbedding,
            score
          });
        }
      } else {
        if (score >= 0.15) {
          projectResults.push({
            chunk: chunkWithoutEmbedding,
            score
          });
        }
      }
    }

    // Sort descending by similarity score
    projectResults.sort((a, b) => b.score - a.score);
    resumeResults.sort((a, b) => b.score - a.score);

    // Apply personal/biographical/general query heuristics
    const isProjectSpecific = queryText ? /mayax|c_helper|c-helper|crypto|blockex|peer|focus|wallulu|gohappy|upsc/i.test(queryText) : false;
    const isPersonalQuery = queryText ? 
      (/who|whose|mehul|developer|owner|creator|author|contact|email|phone|resume|you|yourself|education|college|degree|university|hire|job|work/i.test(queryText) && !isProjectSpecific) : 
      false;
    
    const isProjectMatchWeak = projectResults.length === 0 || projectResults[0].score < 0.35;

    let finalResults: RetrievalResult[] = [];

    if ((isPersonalQuery || isProjectMatchWeak) && resumeResults.length > 0) {
      const resumeCount = Math.min(2, resumeResults.length);
      finalResults = resumeResults.slice(0, resumeCount);
      
      const remainingSlots = topK - finalResults.length;
      if (remainingSlots > 0 && projectResults.length > 0) {
        finalResults = finalResults.concat(projectResults.slice(0, remainingSlots));
      }
    } else {
      const allMatches = [...projectResults, ...resumeResults];
      allMatches.sort((a, b) => b.score - a.score);
      finalResults = allMatches.slice(0, topK);
    }

    return finalResults;
  }
}
