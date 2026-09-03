const { Queue } = require("bullmq");
const IORedis = require("ioredis");
console.log("pdfQueue.js loaded");
require("dotenv").config();
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const pdfqueue = new Queue("pdf-processing", {
    connection
});
console.log("PDF Queue created");
module.exports = pdfqueue;