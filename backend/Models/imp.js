const mongoose = require("mongoose");
const impschema = new mongoose.Schema({
    secret:{
        type:String,
        required:true
    },
    api:{
        type:String,
        required:true
    },
    integration:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("Imp", impschema);