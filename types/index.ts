export interface Citation {
  section_number: string | null;
  chapter_number: number | null;
  chapter_title: string | null;
  page_number: number;
  similarity?: number;
  content?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  loading?: boolean;
}

export interface ChatRequest {
  question: string;
  history: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
}

export interface DocumentChunk {
  id: string;
  section_id?: number;
  chapter_id?: number;
  section_number?: string;
  chapter_number?: number;
  chapter_title?: string;
  content: string;
  page_number: number;
  chunk_index?: number;
  embedding?: number[];
  token_count?: number;
}

export interface MatchResult {
  id: string;
  content: string;
  section_number: string | null;
  chapter_number: number | null;
  chapter_title: string | null;
  page_number: number;
  chunk_index: number | null;
  similarity: number;
}
