import { env, pipeline } from '@xenova/transformers';

// Disable local model loading inside the browser sandbox
env.allowLocalModels = false;

let extractor: any = null;
let cachedIndex: any = null;

/**
 * Lazily loads the embedding model in the browser.
 */
async function getExtractor(onProgress?: (progress: string) => void): Promise<any> {
  if (!extractor) {
    if (onProgress) onProgress('Loading neural fabric embeddings (~90MB)...');
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    if (onProgress) onProgress('Neural fabric loaded.');
  }
  return extractor;
}

/**
 * Lazily fetches and caches the vector index static asset from /index.json.
 */
async function getVectorIndex(onProgress?: (progress: string) => void): Promise<any> {
  if (!cachedIndex) {
    if (onProgress) onProgress('Loading knowledge base index...');
    const response = await fetch('/index.json');
    if (!response.ok) {
      throw new Error('Vector index not found on server. Run ingestion CLI first.');
    }
    cachedIndex = await response.json();
    if (onProgress) onProgress('Knowledge base loaded.');
  }
  return cachedIndex;
}

/**
 * Standard cosine similarity metric computation.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface RagResponse {
  answer: string;
  sources: string[];
  limelightIds: string[];
}

/**
 * Main client-side RAG function. Matches inputs against index.json and completes with Gemini 2.0 Flash.
 */
export async function askRag(
  query: string,
  onProgress?: (msg: string) => void
): Promise<RagResponse> {
  // 1. Initialise model extractor and fetch the vector store index
  const ext = await getExtractor(onProgress);
  const index = await getVectorIndex(onProgress);

  // 2. Generate the query embedding in the browser
  if (onProgress) onProgress('Searching vector space...');
  const output = await ext(query, {
    pooling: 'mean',
    normalize: true
  });
  const queryEmbedding = output.tolist()[0] as number[];

  // 3. Score chunks using cosine similarity
  const results: { chunk: any; score: number }[] = [];
  for (const chunk of index.chunks) {
    const score = cosineSimilarity(queryEmbedding, chunk.embedding);
    if (score >= 0.15) {
      results.push({ chunk, score });
    }
  }

  // 4. Sort descending and filter top 3
  results.sort((a, b) => b.score - a.score);
  const topK = results.slice(0, 3);

  if (topK.length === 0) {
    return {
      answer: "I couldn't find any relevant details in Mehul's project context to answer your question.",
      sources: [],
      limelightIds: []
    };
  }

  // 5. Build system prompt context
  const contextStr = topK
    .map(res => `### From ${res.chunk.project} — ${res.chunk.section}:\n${res.chunk.content}`)
    .join('\n\n---\n\n');

  const systemPrompt = [
    'You are a helpful portfolio assistant named DONNA.',
    "Answer questions about the developer's experience and projects using ONLY the context below.",
    'Be specific — cite exact technologies, numbers, and outcomes from the context.',
    'If the answer is not in the context, say so briefly. Do not invent details.',
    '',
    'You MUST return your response as a JSON object containing two fields:',
    '  - "answer" (string): The detailed answer to the query.',
    '  - "limelightIds" (array of strings): A list of relevant limelight IDs from the mapping below.',
    '',
    'Valid Limelight ID mapping:',
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
    contextStr
  ].join('\n');

  // 6. Request completion from Groq Llama 3.3
  if (onProgress) onProgress('Synthesizing answer...');
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `User query: ${query}`
      }
    ],
    response_format: {
      type: 'json_object'
    },
    temperature: 0.1
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
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
    throw new Error('Empty response received from Groq completions API.');
  }

  // Parse and clean JSON response
  let cleaned = textResponse.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '');
    cleaned = cleaned.replace(/\n```$/, '');
    cleaned = cleaned.trim();
  }
  const parsed = JSON.parse(cleaned);
  const sources = topK.map(res => `${res.chunk.project} — ${res.chunk.section}`);

  return {
    answer: parsed.answer,
    sources,
    limelightIds: parsed.limelightIds || []
  };
}
