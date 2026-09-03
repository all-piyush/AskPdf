const {
    RecursiveCharacterTextSplitter
} = require("@langchain/textsplitters");
require("dotenv").config();
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:1000,
    chunkOverlap:200
});

exports.chunkText = async(text)=>{

    return await splitter.createDocuments([text]);

};