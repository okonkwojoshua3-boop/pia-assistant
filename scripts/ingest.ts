/**
 * PIA 2021 Ingestion Script
 * Run: npx ts-node --project scripts/tsconfig.json scripts/ingest.ts
 *
 * Prerequisites:
 *  - public/pia-2021.pdf must exist
 *  - .env.local must have SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import { EmbeddingModel, FlagEmbedding } from 'fastembed';
// @ts-ignore — pdf-parse has loose typings
import pdfParse from 'pdf-parse';
import pLimit from 'p-limit';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Check .env.local for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const PDF_PATH = path.resolve(__dirname, '../public/pia-2021.pdf');
const CHUNK_TOKENS = 600;
const OVERLAP_TOKENS = 50;
const BATCH_SIZE = 50;
const CONCURRENCY = 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Naive token counter (~4 chars per token) */
function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Split text into overlapping chunks by token count */
function chunkText(text: string, maxTokens = CHUNK_TOKENS, overlap = OVERLAP_TOKENS): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;

  while (start < words.length) {
    let tokenCount = 0;
    let end = start;
    while (end < words.length && tokenCount < maxTokens) {
      tokenCount += countTokens(words[end]);
      end++;
    }
    chunks.push(words.slice(start, end).join(' '));
    const overlapWords = Math.floor(overlap / 4); // approx
    start = Math.max(start + 1, end - overlapWords);
  }

  return chunks.filter((c) => c.trim().length > 20);
}

interface ChunkRecord {
  section_number: string | null;
  chapter_number: number | null;
  chapter_title: string | null;
  content: string;
  page_number: number;
  chunk_index: number;
  token_count: number;
}

// Section detection regex
const SECTION_RE = /^\s*Section\s+(\d+[A-Z]?)\b/im;
const CHAPTER_RE = /^\s*Chapter\s+(\d+)\b[^:]*:?\s*(.*)$/im;

function detectSection(text: string): string | null {
  const m = text.match(SECTION_RE);
  return m ? m[1] : null;
}

function detectChapter(text: string): { number: number; title: string } | null {
  const m = text.match(CHAPTER_RE);
  if (!m) return null;
  return { number: parseInt(m[1]), title: m[2].trim() };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('📄  Reading PDF:', PDF_PATH);
  if (!fs.existsSync(PDF_PATH)) {
    console.error('PDF not found. Place pia-2021.pdf in public/');
    process.exit(1);
  }

  const buffer = fs.readFileSync(PDF_PATH);

  // pdf-parse gives us pageText via render_page callback
  const pageTexts: string[] = [];
  await pdfParse(buffer, {
    pagerender: (pageData: any) => {
      return pageData.getTextContent().then((textContent: any) => {
        const text = textContent.items.map((item: any) => item.str).join(' ');
        pageTexts.push(text);
        return text;
      });
    },
  });

  const totalPages = pageTexts.length;
  console.log(`✅  Parsed ${totalPages} pages`);

  // ---------------------------------------------------------------------------
  // Pass 1: detect chapters
  // ---------------------------------------------------------------------------
  const chaptersMap: Map<number, { number: number; title: string; pageStart: number }> = new Map();

  for (let i = 0; i < pageTexts.length; i++) {
    const ch = detectChapter(pageTexts[i]);
    if (ch && !chaptersMap.has(ch.number)) {
      chaptersMap.set(ch.number, { number: ch.number, title: ch.title, pageStart: i + 1 });
    }
  }

  // Upsert chapters
  const chapterRows = Array.from(chaptersMap.values()).map((c) => ({
    chapter_number: c.number,
    title: c.title || `Chapter ${c.number}`,
    page_start: c.pageStart,
  }));

  if (chapterRows.length > 0) {
    const { error } = await supabase.from('chapters').upsert(chapterRows, {
      onConflict: 'chapter_number',
    });
    if (error) console.warn('Chapter upsert warning:', error.message);
  }
  console.log(`✅  Upserted ${chapterRows.length} chapters`);

  // Fetch chapter IDs
  const { data: chaptersDb } = await supabase
    .from('chapters')
    .select('id, chapter_number');
  const chapterIdByNumber: Map<number, number> = new Map(
    (chaptersDb ?? []).map((c: any) => [c.chapter_number, c.id])
  );

  // ---------------------------------------------------------------------------
  // Pass 2: detect sections
  // ---------------------------------------------------------------------------
  const sectionsMap: Map<string, { number: string; title: string; pageStart: number; chapterId: number | null }> = new Map();

  let lastChapterNum = 0;
  for (let i = 0; i < pageTexts.length; i++) {
    const ch = detectChapter(pageTexts[i]);
    if (ch) lastChapterNum = ch.number;

    const sn = detectSection(pageTexts[i]);
    if (sn && !sectionsMap.has(sn)) {
      sectionsMap.set(sn, {
        number: sn,
        title: '',
        pageStart: i + 1,
        chapterId: chapterIdByNumber.get(lastChapterNum) ?? null,
      });
    }
  }

  const sectionRows = Array.from(sectionsMap.values()).map((s) => ({
    chapter_id: s.chapterId,
    section_number: s.number,
    title: s.title,
    page_start: s.pageStart,
  }));

  if (sectionRows.length > 0) {
    const { error } = await supabase.from('sections').upsert(sectionRows, {
      onConflict: 'section_number',
    });
    if (error) console.warn('Section upsert warning:', error.message);
  }
  console.log(`✅  Upserted ${sectionRows.length} sections`);

  // ---------------------------------------------------------------------------
  // Pass 3: build chunks
  // ---------------------------------------------------------------------------
  const allChunks: ChunkRecord[] = [];

  let trackedChapter: { number: number; title: string } | null = null;
  let trackedSection: string | null = null;

  for (let i = 0; i < pageTexts.length; i++) {
    const pageNum = i + 1;
    const text = pageTexts[i];

    const ch = detectChapter(text);
    if (ch) trackedChapter = ch;
    const sn = detectSection(text);
    if (sn) trackedSection = sn;

    const chunks = chunkText(text);
    chunks.forEach((content, idx) => {
      allChunks.push({
        section_number: trackedSection,
        chapter_number: trackedChapter?.number ?? null,
        chapter_title: trackedChapter?.title ?? null,
        content,
        page_number: pageNum,
        chunk_index: idx,
        token_count: countTokens(content),
      });
    });
  }

  console.log(`📦  Total chunks: ${allChunks.length}`);

  // ---------------------------------------------------------------------------
  // Pass 4: embed in batches using fastembed (local, no API key)
  // ---------------------------------------------------------------------------
  console.log('🔧  Initialising fastembed model (may download ~25MB on first run)...');
  const embeddingModel = await FlagEmbedding.init({
    model: EmbeddingModel.BGESmallENV15,
    cacheDir: '.fastembed_cache',
  });
  console.log('✅  Model ready');

  const limit = pLimit(CONCURRENCY);
  let embedded = 0;

  const batches: ChunkRecord[][] = [];
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    batches.push(allChunks.slice(i, i + BATCH_SIZE));
  }

  await Promise.all(
    batches.map((batch, batchIdx) =>
      limit(async () => {
        const texts = batch.map((c) => c.content);

        const embeddings: number[][] = [];
        const results = embeddingModel.embed(texts, texts.length);
        for await (const batchVecs of results) {
          for (const vec of batchVecs) {
            embeddings.push(Array.from(vec));
          }
        }

        const rows = batch.map((chunk, j) => ({
          ...chunk,
          embedding: embeddings[j],
        }));

        const { error } = await supabase.from('document_chunks').insert(rows);
        if (error) {
          console.error(`Batch ${batchIdx} insert error:`, error.message);
        } else {
          embedded += rows.length;
          process.stdout.write(`\r🔢  Embedded: ${embedded}/${allChunks.length}`);
        }
      })
    )
  );

  console.log(`\n✅  Ingestion complete. ${embedded} chunks stored.`);
}

main().catch((err) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
