export interface Chunk {
  id: string;              // e.g. "drupsc-challenges"
  source: string;          // filename, e.g. "MY_CONTRIBUTIONS_DRUPSC.md"
  project: string;         // extracted from the H1 heading, e.g. "Dr. UPSC"
  section: string;         // the ## heading, e.g. "Challenges"
  content: string;         // raw markdown text of the section
}

export interface EmbeddedChunk extends Chunk {
  embedding: number[];     // float vector, length depends on model
}

export interface VectorIndex {
  model: string;           // embedding model name used at ingestion time
  createdAt: string;       // ISO timestamp
  chunks: EmbeddedChunk[];
}

export interface RetrievalResult {
  chunk: Chunk;
  score: number;           // cosine similarity, 0–1
}

export interface ModelRequest {
  query: string;
  context: RetrievalResult[];   // top-K chunks passed as context
  systemPrompt?: string;
}

export interface ModelResponse {
  answer: string;
  sources: string[];       // project + section of each used chunk
  limelightIds?: string[];  // matching limelight IDs for UI highlighting
}
