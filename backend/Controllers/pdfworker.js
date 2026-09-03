const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const axios = require("axios");
const { PDFParse } = require("pdf-parse");
const Document = require("../Models/Document");
const mongoose = require("mongoose");
const { extractText } = require("../services/Pdfparser");
const Chunk = require("../Models/Chunk");
const { chunkText } = require("../services/Textchunker");
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
const dbconnect = require("../Config/database");
const { generateEmbeddings } = require("../services/Embeddingservice");
require("dotenv").config();
dbconnect();
const verifySearchable = async (
  documentId,
  sampleEmbedding,
  maxAttempts = 20,
  intervalMs = 1000,
) => {
  for (let i = 0; i < maxAttempts; i++) {
    const results = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: sampleEmbedding,
          numCandidates: 10,
          limit: 1,
          filter: {
            documentId: new mongoose.Types.ObjectId(documentId),
          },
        },
      },
    ]);

    console.log(
      `Searchability check ${i + 1}: found ${results.length} chunk(s)`,
    );

    if (results.length > 0) return true;

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
};
const worker = new Worker(
  "pdf-processing",
  async (job) => {
    const { documentId, pdfUrl } = job.data;
    try {
      console.log(`Processing Job ${job.id}`);

      await Document.findByIdAndUpdate(documentId, {
        status: "processing",
      });

      const text = await extractText(pdfUrl);

      const chunks = await chunkText(text);

      const texts = chunks.map((chunk) => chunk.pageContent);

      const embeddings = await generateEmbeddings(texts);

      for (let i = 0; i < chunks.length; i++) {
        await Chunk.create({
          documentId,
          chunkIndex: i,
          text: chunks[i].pageContent,
          embedding: embeddings[i],
        });
      }
      const searchable = await verifySearchable(documentId, embeddings[0]);
      if (!searchable) {
        await Document.findByIdAndUpdate(documentId, { status: "failed" });
        throw new Error("Chunks did not become searchable in time");
      }

      console.log("7. Confirmed searchable, marking completed");
      await Document.findByIdAndUpdate(documentId, {
        status: "completed",
        extractedtext: text,
      });

      return true;
    } catch (error) {
      await Document.findByIdAndUpdate(documentId, {
        status: "failed",
      });

      console.error(error);

      throw error;
    }
  },
  {
    connection,
    concurrency: 1,
  },
);

worker.on("ready", () => {
  console.log(" Worker Ready");
});

worker.on("completed", (job) => {
  console.log(new Date().toLocaleTimeString());
  console.log(` Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(` Job ${job?.id} failed`);
  console.error(err);
});

console.log(" Worker Started...");
