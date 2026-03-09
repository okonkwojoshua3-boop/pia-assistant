# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build (runs type-check + lint)
npm run lint       # ESLint via next lint
npx tsc --noEmit   # Type-check only (no test suite exists)

# One-time PDF ingestion (requires .env.local + public/pia-2021.pdf)
npx ts-node --project scripts/tsconfig.json scripts/ingest.ts
```

## Architecture

This is a RAG (Retrieval-Augmented Generation) app for querying the Petroleum Industry Act 2021. The user reads the PDF in a viewer and clicks a floating button to ask questions; the AI responds with citations that jump to the correct PDF page.

### Request flow

```
User question
  → POST /api/chat  (app/api/chat/route.ts)
  → lib/rag/embed.ts       — OpenAI text-embedding-3-small → vector[1536]
  → lib/rag/retrieve.ts    — Supabase pgvector RPC match_document_chunks → top-5 chunks
  → lib/rag/generate.ts    — Claude claude-sonnet-4-6 with system prompt + excerpts → {answer, citations}
  → JSON response → CitationCard click → setTargetPage → PDFViewer scrolls + flashes highlight
```

### Key design constraints

- **PDFViewer is `dynamic(..., { ssr: false })`** — pdfjs cannot run server-side.
- **PDF worker uses unpkg CDN URL** (not a local import). Importing the `.mjs` worker directly causes a Terser `import.meta` error during `next build`. See `lib/pdf/pdfWorker.ts`.
- **Supabase clients are lazy-initialized** (created on first call, not at module load). Eager creation throws `"supabaseUrl is required"` at build time when env vars are absent. See `lib/supabase/server.ts` and `lib/supabase/client.ts`.
- **`SUPABASE_SERVICE_ROLE_KEY` is server-only** — never prefix with `NEXT_PUBLIC_`. It is only used in `lib/supabase/server.ts` and `scripts/ingest.ts`.

### State management

State lives entirely in the main page (`app/page.tsx`) via two hooks:
- `hooks/usePDFNavigation.ts` — page number, scale, targetPage (set by citation click)
- `hooks/useChat.ts` — message list, loading state, fetch logic

`targetPage` is the bridge between chat and PDF: when a `CitationCard` is clicked it calls `nav.goToPage(citation.page_number)`, which the `PDFViewer` responds to via a `useEffect` on `targetPage`.

### Database schema (Supabase)

Three tables: `chapters → sections → document_chunks`. The `document_chunks` table stores embeddings as `vector(1536)` and is queried via the `match_document_chunks` RPC function defined in `supabase/migrations/001_init.sql`. Run this SQL once in the Supabase dashboard before ingestion.

### Ingestion script

`scripts/ingest.ts` uses `pdf-parse` (page-level text), regex to detect chapters (`/Chapter \d+/`) and sections (`/Section \d+/`), naive token chunking (~4 chars/token, 600-token chunks, 50-token overlap), and batched OpenAI embedding calls (20 chunks/batch, 3 concurrent). It loads `.env.local` via `dotenv` and uses a separate `scripts/tsconfig.json` (CommonJS module).

## Environment variables

| Variable | Used in |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser client only |
| `SUPABASE_SERVICE_ROLE_KEY` | server + ingest script |
| `OPENAI_API_KEY` | embeddings (server + ingest) |
| `ANTHROPIC_API_KEY` | Claude generation (server) |
| `MATCH_THRESHOLD` | similarity cutoff, default `0.70` |
| `MATCH_COUNT` | top-k results, default `5` |
