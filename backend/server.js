import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import ratelimit from "express-rate-limit";

import { initializeEmbeddings, retrieveRelevantDocs } from "./rag.js";

const cache = new Map();

let dailyCount = 0;

setInterval(
  () => {
    dailyCount = 0;
  },
  24 * 60 * 60 * 1000,
);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Portfolio AI backend running");
});

const limiter = ratelimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many requests. Please slow down.",
});

app.use("/chat", limiter);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

await initializeEmbeddings();

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (dailyCount > 200) {
    return res.json({
      reply: "AI assistant is currently busy. Please try again later.",
    });
  }

  dailyCount++;

  const key = message.trim().toLowerCase();

  if (cache.has(key)) {
    console.log("CACHE HIT:", key);
    return res.json({ reply: cache.get(key) });
  }

  const docs = await retrieveRelevantDocs(message);

  const context = docs.map((d) => d.text).join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant representing Kartik Mehta's portfolio. Answer questions about his experience, projects and technical skills.",
      },
      {
        role: "user",
        content: `
        Context about Kartik:

        ${context}

        Question:
        ${message}
        `,
      },
    ],
    max_tokens: 200,
  });

  const reply= completion.choices[0].message.content

  cache.set(key, reply);

  res.json({
    reply
  });
});

app.listen(5000, () => {
  console.log("RAG server running on port 5000");
});
