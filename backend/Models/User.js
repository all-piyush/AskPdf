const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:{
        type:String,
        maxLength:50,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
},{timestamps:true})
module.exports=mongoose.models.User ||mongoose.model("User",userschema);