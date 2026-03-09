import { NextRequest, NextResponse } from 'next/server';
import { embedText } from '@/lib/rag/embed';
import { retrieveChunks } from '@/lib/rag/retrieve';
import { generateAnswer } from '@/lib/rag/generate';
import { ChatRequest } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { question, history } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Step 1: Embed the question
    const embedding = await embedText(question);

    // Step 2: Retrieve relevant chunks
    const chunks = await retrieveChunks(embedding);

    // Step 3: Generate answer with Claude
    const { answer, citations } = await generateAnswer(question, chunks, history ?? []);

    return NextResponse.json({ answer, citations });
  } catch (err) {
    console.error('Chat API error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
