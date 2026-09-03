const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateAnswer(context, question) {

    const prompt = `
You are a document Q&A assistant.

Answer the user's question using ONLY the provided document context.

Rules:
- Do not use outside knowledge or invent facts.
- You may reason, calculate, compare, summarize, and derive insights from the context.
- Keep names, numbers, dates, currencies, and important terminology accurate.
- If the context does not contain enough information to answer, say:
  "The information is not available in the provided documents."
- Do not guess.
- Do not copy the document unnecessarily; answer naturally.
- Format the answer clearly using Markdown.
- Use headings, bullet points, numbered lists, and tables when they improve readability.
- For multiple items, put each item on a separate line.
- For calculations, show the relevant calculation briefly.

DOCUMENT CONTEXT:
${context}

USER QUESTION:
${question}

ANSWER:
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;
}

module.exports = generateAnswer;