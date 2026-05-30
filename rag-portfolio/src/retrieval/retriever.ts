import { embedQuery } from '../ingestion/embedder.js';
import { VectorStore } from './vectorStore.js';
import { RetrievalResult } from '../types/index.js';

export class Retriever {
  private vectorStore: VectorStore;

  constructor(vectorStore: VectorStore) {
    this.vectorStore = vectorStore;
  }

  /**
   * Embeds the search query and retrieves the top-K most similar chunks from the vector store.
   */
  public async retrieve(
    query: string,
    topK: number = 3
  ): Promise<RetrievalResult[]> {
    // Generate the embedding vector for the search query
    const queryEmbedding = await embedQuery(query);

    // Query the vector store using the embedding vector and the query text
    return this.vectorStore.search(queryEmbedding, topK, query);
  }
}
