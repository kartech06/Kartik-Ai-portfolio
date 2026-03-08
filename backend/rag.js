import { portfolioDocs } from "./data/portfolioDocs.js";
import { createEmbeddings } from "./embeddings.js";
import fs from 'fs';

const CACHE_FILE = "./embeddings-cache.json";

let cachedEmbeddings = [];

/* ===============================
   Initialize embeddings
================================ */
export async function initializeEmbeddings() {

    // load cache if exists
  if (fs.existsSync(CACHE_FILE)) {

    const data = fs.readFileSync(CACHE_FILE, "utf-8");
    cachedEmbeddings = JSON.parse(data);

    console.log("Loaded embeddings from cache");

    return;
  }

  console.log("Generating embeddings...");

  for (const doc of portfolioDocs) {
    const embedding = await createEmbeddings(doc.text);

    cachedEmbeddings.push({
      ...doc,
      embedding
    });
  }

  // save cache
  fs.writeFileSync(
    CACHE_FILE,
    JSON.stringify(cachedEmbeddings, null, 2)
  );

  console.log("Embeddings cached locally");

  console.log(`Embeddings initialized for ${cachedEmbeddings.length} docs`);
}


/* ===============================
   Cosine Similarity (vector search)
================================ */
function cosineSimilarity(a, b) {

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);

  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}


/* ===============================
   Keyword Matching Score
================================ */
function keywordScore(query, text) {

  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ");

  const content = text.toLowerCase();

  let score = 0;

  words.forEach(word => {
    if (word.length > 3 && content.includes(word)) {
      score += 1;
    }
  });

  return score;
}


/* ===============================
   Hybrid Retrieval
================================ */
export async function retrieveRelevantDocs(query) {

  const queryEmbedding = await createEmbeddings(query);

  const scored = cachedEmbeddings.map(doc => {

    const semanticScore = cosineSimilarity(queryEmbedding, doc.embedding);

    const keywordMatch = keywordScore(query, doc.text);

    // hybrid scoring
    const finalScore = semanticScore + keywordMatch * 0.05;

    return {
      ...doc,
      semanticScore,
      keywordMatch,
      score: finalScore
    };

  });

  // sort descending
  scored.sort((a, b) => b.score - a.score);

  // return top documents
  return scored.slice(0, 3);

}