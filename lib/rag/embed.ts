import { pipeline, env } from '@xenova/transformers';

// On Vercel, /tmp is the only writable directory
env.cacheDir = '/tmp/transformers-cache';

type EmbeddingPipeline = Awaited<ReturnType<typeof pipeline>>;
let _embedder: EmbeddingPipeline | null = null;

async function getEmbedder(): Promise<EmbeddingPipeline> {
  if (!_embedder) {
    _embedder = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
  }
  return _embedder;
}

async function embed(text: string): Promise<number[]> {
  const embedder = await getEmbedder();
  const output = await (embedder as any)(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data) as number[];
}

export async function embedText(text: string): Promise<number[]> {
  return embed(text);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(embed));
}
