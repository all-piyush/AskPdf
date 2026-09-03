const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateEmbedding(text) {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text
    });

    return response.embeddings[0].values;
}

async function generateEmbeddings(texts) {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: texts
    });

    return response.embeddings.map(embedding => embedding.values);
}

module.exports = {
    generateEmbedding,
    generateEmbeddings
};