const { generateEmbedding } = require("../services/Embeddingservice");
const generateAnswer = require("../services/Chatservice");
const Chunk = require("../Models/Chunk");
const Chat = require("../Models/Chat");
const Message = require("../Models/Message");

require("dotenv").config();

exports.askQuestion = async (req, res) => {
  try {
    const { question, messageId } = req.body;
    const { chatId } = req.params;
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required.",
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    if (messageId) {
      const message = await Message.findOne({
        _id: messageId,
        chat: chatId,
        role: "user",
      });
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found.",
        });
      }
      message.content = question;
      await message.save();
    } else {
      await Message.create({
        chat: chatId,
        role: "user",
        content: question,
      });
    }
    const questionEmbedding = await generateEmbedding(question);

    const results = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: questionEmbedding,
          numCandidates: 100,
          limit: 10,
          filter: {
            documentId: {
              $in: chat.documents,
            },
          },
        },
      },
    ]);

    const context = results.map((chunk) => chunk.text).join("\n\n");

    const answer = await generateAnswer(context, question);

    const sources = results.map((chunk) => ({
      documentId: chunk.documentId,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text.substring(0, 100) + "...",
    }));

    await Message.create({
      chat: chatId,
      role: "assistant",
      content: answer,
      sources: sources,
    });

    return res.status(200).json({
      success: true,
      answer: answer,
      chatId: chatId,
      sources: sources,
    });
  } catch (error) {
    console.error("Ask Question Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
