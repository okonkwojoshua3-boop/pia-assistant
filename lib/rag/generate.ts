import Groq from 'groq-sdk';
import { MatchResult, Citation } from '@/types';

let _groq: Groq | null = null;
function getGroq(): Groq {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

const SYSTEM_PROMPT = `You are a legal assistant specialising exclusively in the Petroleum Industry Act (PIA) 2021 of Nigeria.

RULES:
1. Answer ONLY from the document excerpts provided in the <excerpts> block.
2. Every factual claim MUST be followed by a citation in the format [Section X, Chapter Y] or [Chapter Y] if no section is given.
3. If the answer cannot be found in the provided excerpts, respond with exactly: "The information could not be located in the Petroleum Industry Act 2021."
4. Do not speculate, infer beyond the text, or draw on external knowledge.
5. Be concise but thorough — include all relevant details from the excerpts.
6. Structure longer answers with short paragraphs for readability.`;

function buildExcerptsBlock(chunks: MatchResult[]): string {
  return chunks
    .map((c, i) => {
      const ref = [
        c.section_number ? `Section ${c.section_number}` : null,
        c.chapter_number ? `Chapter ${c.chapter_number}` : null,
        c.chapter_title ? `(${c.chapter_title})` : null,
        `Page ${c.page_number}`,
      ]
        .filter(Boolean)
        .join(', ');
      return `[Excerpt ${i + 1} — ${ref}]\n${c.content}`;
    })
    .join('\n\n---\n\n');
}

export async function generateAnswer(
  question: string,
  chunks: MatchResult[],
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<{ answer: string; citations: Citation[] }> {
  if (chunks.length === 0) {
    return {
      answer: 'The information could not be located in the Petroleum Industry Act 2021.',
      citations: [],
    };
  }

  const excerpts = buildExcerptsBlock(chunks);

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((h) => ({ role: h.role, content: h.content } as Groq.Chat.ChatCompletionMessageParam)),
    {
      role: 'user',
      content: `<excerpts>\n${excerpts}\n</excerpts>\n\nQuestion: ${question}`,
    },
  ];

  const response = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    messages,
  });

  const answer = response.choices[0]?.message?.content ?? '';

  // Deduplicate citations by page_number
  const seen = new Set<number>();
  const citations: Citation[] = [];
  for (const chunk of chunks) {
    if (!seen.has(chunk.page_number)) {
      seen.add(chunk.page_number);
      citations.push({
        section_number: chunk.section_number,
        chapter_number: chunk.chapter_number,
        chapter_title: chunk.chapter_title,
        page_number: chunk.page_number,
        similarity: chunk.similarity,
      });
    }
  }

  return { answer, citations };
}
