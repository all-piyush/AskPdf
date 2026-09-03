const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    fileName: String,

    cloudinaryUrl: String,

    publicId: String,

    status: {
        type: String,
        enum: ["queued", "processing", "completed", "failed"],
        default: "queued"
    },
    extractedtext:{
        type:String,
    }
}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);