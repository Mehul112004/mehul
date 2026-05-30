import { BaseModelService } from './modelService.js';
import { ModelRequest, ModelResponse } from '../types/index.js';

export class GeminiModelService extends BaseModelService {
  private apiKey: string;

  constructor(apiKey?: string) {
    super();
    // Use key from constructor argument, environment variables, or fallback to the default key
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  /**
   * Calls the Gemini API with structured output mapping to receive the answer and Limelight IDs.
   */
  public async complete(request: ModelRequest): Promise<ModelResponse> {
    const context = this.formatContext(request.context);
    const systemPrompt = this.buildSystemPrompt(context, request.systemPrompt);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;

    const payload = {
      systemInstruction: {
        parts: [
          {
            text: systemPrompt
          }
        ]
      },
      contents: [
        {
          parts: [
            {
              text: `User query: ${request.query}`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            answer: {
              type: 'STRING',
              description: 'The detailed answer generated based on the context and the user query.'
            },
            limelightIds: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              },
              description: "List of relevant limelight IDs matching the projects or experiences discussed in the answer. Allowed values: 'c_helper', 'mayax', 'blockex', 'peer_focus', 'wallulu', 'exp_gohappy', 'exp_drupsc', 'edu_skit'."
            }
          },
          required: ['answer', 'limelightIds']
        }
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (status ${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      
      const candidate = responseData.candidates?.[0];
      const textResponse = candidate?.content?.parts?.[0]?.text;

      if (!textResponse) {
        throw new Error('No text response received from Gemini API candidates.');
      }

      // Parse structured JSON response from Gemini
      const parsed = JSON.parse(textResponse);

      // Extract unique sources (project + section) from the context results
      const sources = request.context.map(
        res => `${res.chunk.project} — ${res.chunk.section}`
      );

      return {
        answer: parsed.answer,
        sources,
        limelightIds: parsed.limelightIds || []
      };
    } catch (error) {
      console.error('GeminiModelService API call failed:', error);
      throw error;
    }
  }
}
