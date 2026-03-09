CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chapters (
  id SERIAL PRIMARY KEY,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  page_start INTEGER NOT NULL,
  page_end INTEGER
);

CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER REFERENCES chapters(id),
  section_number TEXT NOT NULL,
  title TEXT,
  page_start INTEGER NOT NULL,
  page_end INTEGER
);

CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id INTEGER REFERENCES sections(id),
  chapter_id INTEGER REFERENCES chapters(id),
  section_number TEXT,
  chapter_number INTEGER,
  chapter_title TEXT,
  content TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  chunk_index INTEGER,
  embedding vector(1536),
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON document_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.70,
  match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  section_number TEXT,
  chapter_number INTEGER,
  chapter_title TEXT,
  page_number INTEGER,
  chunk_index INTEGER,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.content,
    dc.section_number,
    dc.chapter_number,
    dc.chapter_title,
    dc.page_number,
    dc.chunk_index,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE 1 - (dc.embedding <=> query_embedding) >= match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
