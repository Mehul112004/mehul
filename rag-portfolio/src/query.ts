import 'dotenv/config';
import { FilterService } from '../../src/services/filterService.js';
import { VectorStore } from './retrieval/vectorStore.js';
import { Retriever } from './retrieval/retriever.js';
import { BaseModelService } from './service/modelService.js';
import { GroqModelService } from './service/groqModelService.js';
import { RagService } from './service/ragService.js';
import { ModelRequest, ModelResponse } from './types/index.js';

/**
 * Mock Model Service for testing retrieval offline without API calls.
 */
class MockModelService extends BaseModelService {
  public async complete(request: ModelRequest): Promise<ModelResponse> {
    const answer = `[MockModelService] Context retrieved successfully. Wire up a real LLM to get answers.`;
    const sources = request.context.map(
      res => `${res.chunk.project} — ${res.chunk.section}`
    );

    // Simple heuristic to mock matching limelightIds based on project/section name keywords in the retrieved context
    const limelightIds: string[] = [];
    const contextText = JSON.stringify(request.context).toLowerCase();
    
    if (contextText.includes('drupsc')) limelightIds.push('exp_drupsc');
    if (contextText.includes('gohappy')) limelightIds.push('exp_gohappy');
    if (contextText.includes('c_helper')) limelightIds.push('c_helper');
    if (contextText.includes('mayax')) limelightIds.push('mayax');
    if (contextText.includes('blockex')) limelightIds.push('blockex');
    if (contextText.includes('peer focus')) limelightIds.push('peer_focus');
    if (contextText.includes('wallulu')) limelightIds.push('wallulu');
    if (contextText.includes('skit')) limelightIds.push('edu_skit');

    return {
      answer,
      sources,
      limelightIds
    };
  }
}

async function main() {
  const queryArg = process.argv[2];
  if (!queryArg) {
    console.error('Error: Please provide a search query.');
    console.error('Usage: npm run query "your search query" [--mock]');
    process.exit(1);
  }

  const useMock = process.argv.includes('--mock');

  // 1. Run query validation & sanitization via FilterService
  const filterResult = FilterService.filter(queryArg);
  if (!filterResult.isValid) {
    console.error(`\nQuery rejected: ${filterResult.reason}`);
    process.exit(1);
  }

  const sanitizedQuery = filterResult.sanitizedText;
  if (sanitizedQuery !== queryArg) {
    console.log(`Sanitized query (stripped emojis/symbols): "${sanitizedQuery}"`);
  }

  try {
    const vectorStore = new VectorStore('./index.json');
    const retriever = new Retriever(vectorStore);

    let modelService: BaseModelService;
    if (useMock) {
      console.log('Instantiating MockModelService...');
      modelService = new MockModelService();
    } else {
      console.log('Instantiating GroqModelService (Llama 3.3)...');
      modelService = new GroqModelService();
    }

    const ragService = new RagService(retriever, modelService);
    const response = await ragService.ask(sanitizedQuery);

    console.log(`Answer: ${response.answer}`);
    console.log(`Sources: ${response.sources.join(', ')}`);
    if (response.limelightIds && response.limelightIds.length > 0) {
      console.log(`Limelight IDs: ${response.limelightIds.join(', ')}`);
    }
  } catch (error) {
    console.error('Query execution failed:', error);
    process.exit(1);
  }
}

main();
