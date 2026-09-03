const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        default: "New Chat"
    },

    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    }]

}, { timestamps: true });

module.exports =mongoose.models.Chat || mongoose.model("Chat", chatSchema);
