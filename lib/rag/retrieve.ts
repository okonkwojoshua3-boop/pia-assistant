import { supabaseAdmin } from '@/lib/supabase/server';
import { MatchResult } from '@/types';

export async function retrieveChunks(
  embedding: number[],
  matchThreshold?: number,
  matchCount?: number
): Promise<MatchResult[]> {
  const threshold = matchThreshold ?? parseFloat(process.env.MATCH_THRESHOLD ?? '0.70');
  const count = matchCount ?? parseInt(process.env.MATCH_COUNT ?? '5');

  const { data, error } = await supabaseAdmin.rpc('match_document_chunks', {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: count,
  });

  if (error) {
    console.error('Retrieval error:', error);
    throw new Error(`Failed to retrieve chunks: ${error.message}`);
  }

  return (data ?? []) as MatchResult[];
}
