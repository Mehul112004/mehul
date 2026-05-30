import { ModelRequest, ModelResponse, RetrievalResult } from '../types/index.js';

export interface IModelService {
  complete(request: ModelRequest): Promise<ModelResponse>;
}

export abstract class BaseModelService implements IModelService {
  /**
   * Concrete implementation must define how to complete requests using an LLM.
   */
  abstract complete(request: ModelRequest): Promise<ModelResponse>;

  /**
   * Utility: formats RetrievalResult[] into a context string
   * ready to be injected into a system prompt.
   */
  protected formatContext(results: RetrievalResult[]): string {
    return results
      .map(r => `### From ${r.chunk.project} — ${r.chunk.section}:\n${r.chunk.content}`)
      .join('\n\n---\n\n');
  }

  /**
   * Utility: builds the default system prompt for portfolio RAG.
   * Concrete implementations can override this.
   */
  protected buildSystemPrompt(context: string, customPrompt?: string): string {
    if (customPrompt) return customPrompt;
    return [
      'You are a helpful portfolio assistant.',
      "Answer questions about the developer's experience and projects using ONLY the context below.",
      'Be specific — cite exact technologies, numbers, and outcomes from the context.',
      'If the answer is not in the context, say so briefly. Do not invent details.',
      '',
      'You MUST also identify which projects, experiences, or education entities from the context are relevant to the user query and your answer.',
      'Extract the matching Limelight IDs from the list below and return them in the "limelightIds" field of the JSON output.',
      'Valid Limelight IDs:',
      '- Projects:',
      '  * C_Helper: Crypto Intelligence -> "c_helper"',
      '  * MayaX: AI Interior Design -> "mayax"',
      '  * Blockex: Safari Extension -> "blockex"',
      '  * Peer Focus: Co-Working Rooms -> "peer_focus"',
      '  * Wallulu: Wallpaper Browser -> "wallulu"',
      '- Experiences & Education:',
      '  * GoHappy Club (Full Stack Developer) -> "exp_gohappy"',
      '  * Dr. UPSC (Frontend Developer) -> "exp_drupsc"',
      '  * SKIT Jaipur (B.Tech Computer Science) -> "edu_skit"',
      '',
      'If a project, experience or education is mentioned/relevant to your answer, include its ID. If none are relevant, return an empty array.',
      '',
      'Context:',
      context
    ].join('\n');
  }
}

// TODO: implement concrete LLM provider here
export class ClaudeModelService extends BaseModelService {
  async complete(request: ModelRequest): Promise<ModelResponse> {
    throw new Error('Not implemented');
  }
}
