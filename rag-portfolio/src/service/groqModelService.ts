import { BaseModelService } from './modelService.js';
import { ModelRequest, ModelResponse } from '../types/index.js';

export class GroqModelService extends BaseModelService {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'llama-3.3-70b-versatile') {
    super();
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.model = model;
  }

  /**
   * Helper to clean LLM response text, stripping markdown code wrappers if present.
   */
  private cleanJsonResponse(rawText: string): any {
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      // Strip starting code block (e.g. ```json or ```)
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '');
      // Strip ending code block (```)
      cleaned = cleaned.replace(/\n```$/, '');
      cleaned = cleaned.trim();
    }
    return JSON.parse(cleaned);
  }

  /**
   * Calls the Groq API completion endpoint.
   */
  public async complete(request: ModelRequest): Promise<ModelResponse> {
    const context = this.formatContext(request.context);
    const systemPrompt = this.buildSystemPrompt(context, request.systemPrompt);

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const payload = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `User query: ${request.query}`
        }
      ],
      // Enforce JSON object formatting
      response_format: {
        type: 'json_object'
      },
      temperature: 0.1 // Low temperature for more deterministic facts extraction
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (status ${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      
      const choice = responseData.choices?.[0];
      const textResponse = choice?.message?.content;

      if (!textResponse) {
        throw new Error('No text content returned from Groq chat completions.');
      }

      // Parse structured JSON response
      const parsed = this.cleanJsonResponse(textResponse);

      // Extract unique sources
      const sources = request.context.map(
        res => `${res.chunk.project} — ${res.chunk.section}`
      );

      return {
        answer: parsed.answer,
        sources,
        limelightIds: parsed.limelightIds || []
      };
    } catch (error) {
      console.error('GroqModelService complete() failed:', error);
      throw error;
    }
  }
}
