const Chat = require("../Models/Chat");
const Document = require("../Models/Document");
exports.getchats = async (req, res) => {
  try {
    console.log(req.user.id);
    const chats = await Chat.find({
      user: req.user.id
    })
      
      .sort({ updatedAt: -1 })
      .select("_id title documents createdAt updatedAt");

    return res.status(200).json({
      success: true,
      chats
    });

  } catch (error) {

    console.error("Get Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats"
    });
  }
};
const Message = require("../Models/message");

exports.getmessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    const messages = await Message.find({
      chat: chatId
    }).populate("files", "fileName").sort({
      createdAt: 1
    });

    return res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages"
    });
  }
};
exports.getChatStatus = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, user: req.user.id });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found." });
    }

    const documents = await Document.find({ _id: { $in: chat.documents } });
    const allReady = documents.every((d) => d.status === "completed");
    const anyFailed = documents.some((d) => d.status === "failed");

    return res.status(200).json({
      success: true,
      status: anyFailed ? "failed" : allReady ? "ready" : "processing"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};