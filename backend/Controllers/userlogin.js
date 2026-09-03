const user=require('../Models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require("dotenv").config();
exports.signup=async(req,res)=>{
    try{
        const{name,email,password,phone}=req.body;
        console.log(name,email,password,phone);
        const exist=await user.findOne({email});
        if(exist){
            return res.status(400).json({
                success:false,
                message:"USer Already Exists",
            })
        }
        let hashedpass=await bcrypt.hash(password,10);
        const newuser=await user.create({name,email,password:hashedpass,phone});
        const options={expires:new Date(Date.now()+24*60*60*1000),httpOnly:true,
        sameSite:process.env.NODE_ENV==='production'?"None":"Lax",secure:process.env.NODE_ENV==='production'};
        const payload={email:newuser.email,id:newuser._id,name:newuser.name};
            let token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
        return res.cookie("token",token,options).status(200).json({
                success:true,
                user:newuser,
                message:"Logged In Successfully"
            })
}
    catch(error){
        res.status(500).json({
            success:false,
            message:"Internal Servor Error"
        })
    }
}
exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body; 
        let exists=await user.findOne({email});
        if(!exists){
            return res.status(404).json({
                success:false,
                message:"User Not Found",
            })
        }
        
        if(await bcrypt.compare(password,exists.password)){
            const payload={email:exists.email,id:exists._id,name:exists.name};
            let token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
            exists=exists.toObject();
            exists.password = undefined;
            const options={expires:new Date(Date.now()+24*60*60*1000),httpOnly:true,
            sameSite:process.env.NODE_ENV==='production'?"None":"Lax",secure:process.env.NODE_ENV==='production'};
            return res.cookie("token",token,options).status(200).json({
                success:true,
                user:exists,
                message:"Logged In Successfully"
            })
        }

        else{
            return res.status(403).json({
                success:false,
                message:"Password Does Not Matched"
            })
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Servor Error"
        })
    }
}
exports.adminlogin=async(req,res)=>{
    try{
            const{email,password}=req.body;
            if(email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD){
                const token=jwt.sign({admin:true},process.env.JWT_SECRET,{expiresIn:'1d'})
                const options={expires:new Date(Date.now()+24*60*60*1000),httpOnly:true,
                sameSite:process.env.NODE_ENV==='production'?"None":"Lax",secure:process.env.NODE_ENV==='production'};


                return res.cookie("token",token,options).status(200).json({
                    message:"Admin Verified Successfully",
                    success:true,
                })
            }
            else{
                return res.status(400).json({
                    message:"Email Or Password Incorrect",
                    success:false,
                })
            }
        }catch(error){
            res.status(500).json({
                message:"Internal Server Error",
                success:false,
            })
            
        }
}
