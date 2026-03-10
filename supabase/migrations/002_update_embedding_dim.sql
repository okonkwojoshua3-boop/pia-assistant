-- Migration: switch from OpenAI text-embedding-3-small (1536 dims)
--            to fastembed BAAI/bge-small-en-v1.5 (384 dims)
-- Run this in the Supabase SQL editor BEFORE re-ingesting.

-- 1. Clear existing embeddings (they are incompatible with the new dimension)
TRUNCATE TABLE document_chunks;

-- 2. Drop the old IVFFlat index (tied to vector(1536))
DROP INDEX IF EXISTS document_chunks_embedding_idx;

-- 3. Alter the embedding column to 384 dims
ALTER TABLE document_chunks ALTER COLUMN embedding TYPE vector(384);

-- 4. Recreate the index for the new dimension
CREATE INDEX document_chunks_embedding_idx
  ON document_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 5. Replace the match function with the updated signature
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(384),
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
