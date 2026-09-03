const Document = require("../Models/Document");
const Chat = require("../Models/Chat");
const cloudinary = require("cloudinary").v2;
const pdfQueue = require("./pdfqueue");
const Message = require("../Models/Message");

async function uploadToCloudinary(file, folder) {
  const options = {
    folder,
    resource_type: "raw",
  };

  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.adddocument = async (req, res) => {
  try {
    console.log(req.user.id);
    const { chatId } = req.params;
    if (!req.files || !req.files.documents) {
      return res.status(400).json({
        success: false,
        message: "No document files were provided.",
      });
    }

    const documents = Array.isArray(req.files.documents)
      ? req.files.documents
      : [req.files.documents];

    const userId = req.user.id;

    let chat;
    if (!chatId || chatId === "null" || chatId === "undefined") {
      chat = await Chat.create({
        user: userId,
        title: documents[0].name,
        documents: [],
      });
    } else {
      chat = await Chat.findById(chatId);
      if (!chat) {
        return res
          .status(404)
          .json({ success: false, message: "Chat not found." });
      }
      if (chat.user.toString() !== userId) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized." });
      }
    }

    const createdDocuments = [];

    for (const documentFile of documents) {
      const fileType = documentFile.name.split(".").pop().toLowerCase();

      if (fileType !== "pdf") {
        continue;
      }

      const cloudinaryResponse = await uploadToCloudinary(
        documentFile,
        "askpdf",
      );

      const newDocument = await Document.create({
        user: userId,
        fileName: documentFile.name,
        cloudinaryUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
      });

      chat.documents.push(newDocument._id);

      const job = await pdfQueue.add("process-pdf", {
        documentId: newDocument._id,
        pdfUrl: newDocument.cloudinaryUrl,
      });

      createdDocuments.push(newDocument);
    }

    if (createdDocuments.length === 0) {
      await Chat.findByIdAndDelete(chat._id);

      return res.status(400).json({
        success: false,
        message: "No valid PDF files were provided.",
      });
    }
    const documentIds = createdDocuments.map((doc) => doc._id);
    const new_message = await Message.create({
      chat: chat._id,
      role: "user",
      files: documentIds,
    });

    await chat.save();

    return res.status(201).json({
      success: true,
      message: "Documents uploaded successfully and processing started.",
      chat: chat,
      messageid: new_message._id,
      data: createdDocuments,
    });
  } catch (error) {
    console.error("Document Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your documents.",
      error: error.message,
    });
  }
};
