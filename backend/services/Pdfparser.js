const axios = require("axios");
const { PDFParse } = require("pdf-parse");
require("dotenv").config();
exports.extractText = async (pdfUrl) => {

    const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer"
    });

    const buffer = Buffer.from(response.data);

    const parser = new PDFParse({
        data: buffer
    });

    const pdfData = await parser.getText();

    return pdfData.text;
};