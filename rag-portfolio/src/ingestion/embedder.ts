import { pipeline } from '@xenova/transformers';
import { Chunk, EmbeddedChunk } from '../types/index.js';

let extractor: any = null;

/**
 * Lazily loads the Xenova feature extraction pipeline.
 */
async function getExtractor(): Promise<any> {
  if (!extractor) {
    // Disable local model checking to avoid file system warnings/errors in sandbox if it tries to search local dirs
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

/**
 * Computes a normalized 384-dimensional embedding for a single text query.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const ext = await getExtractor();
  const output = await ext(query, {
    pooling: 'mean',
    normalize: true
  });
  
  // Convert Tensor to normal JavaScript array
  return output.tolist()[0] as number[];
}

/**
 * Sequentially computes embeddings for a list of chunks to manage memory usage.
 */
export async function embedChunks(chunks: Chunk[]): Promise<EmbeddedChunk[]> {
  const embeddedChunks: EmbeddedChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Embedding chunk ${i + 1}/${chunks.length}: ${chunk.id}`);
    
    // Embed the chunk content (which has ## Heading preserved at the start)
    const embedding = await embedQuery(chunk.content);

    embeddedChunks.push({
      ...chunk,
      embedding
    });
  }

  return embeddedChunks;
}
