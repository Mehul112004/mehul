import { Retriever } from '../retrieval/retriever.js';
import { IModelService } from './modelService.js';
import { ModelResponse } from '../types/index.js';

export class RagService {
  private retriever: Retriever;
  private modelService: IModelService;

  constructor(retriever: Retriever, modelService: IModelService) {
    this.retriever = retriever;
    this.modelService = modelService;
  }

  /**
   * Orchestrates the RAG process: retrieves context, logs metadata, and query the model service.
   */
  public async ask(
    query: string,
    options?: { topK?: number; systemPrompt?: string }
  ): Promise<ModelResponse> {
    const topK = options?.topK ?? 3;

    // 1. Retrieve the top K relevant chunks from the vector store
    const context = await this.retriever.retrieve(query, topK);

    // 2. Log retrieved chunks (id + score) to console for visibility
    console.log('\nRetrieved chunks:');
    if (context.length === 0) {
      console.log('  No matching chunks found above threshold (0.15).');
    } else {
      for (const item of context) {
        console.log(`  ${item.chunk.id} (score: ${item.score.toFixed(2)})`);
      }
    }
    console.log(); // empty line for clean spacing

    // 3. Complete the request through the model service
    const request = {
      query,
      context,
      systemPrompt: options?.systemPrompt
    };

    const response = await this.modelService.complete(request);

    // 4. Return response
    return response;
  }
}
