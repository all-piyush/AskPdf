const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    files:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
    }],
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },

    content: {
        type: String,
    },

    sources: [{
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document"
        },

        chunkIndex: Number,

        text: String
    }]

}, { timestamps: true });

module.exports =mongoose.models.Message || mongoose.model("Message", messageSchema);
