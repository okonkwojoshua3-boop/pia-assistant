import { EmbeddingModel, FlagEmbedding } from 'fastembed';

let _model: FlagEmbedding | null = null;

async function getModel(): Promise<FlagEmbedding> {
  if (!_model) {
    _model = await FlagEmbedding.init({
      model: EmbeddingModel.BGESmallENV15,
      cacheDir: '.fastembed_cache',
    });
  }
  return _model;
}

export async function embedText(text: string): Promise<number[]> {
  const model = await getModel();
  const results = model.embed([text], 1);
  for await (const batch of results) {
    return Array.from(batch[0]);
  }
  throw new Error('embedText: no output from model');
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const model = await getModel();
  const embeddings: number[][] = [];
  const results = model.embed(texts, texts.length);
  for await (const batch of results) {
    for (const vec of batch) {
      embeddings.push(Array.from(vec));
    }
  }
  return embeddings;
}
