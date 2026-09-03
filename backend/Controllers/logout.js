exports.logout=async(req,res)=>{
    try{
        const options={httpOnly:true,sameSite:'None',secure:true};
        return res.clearCookie("token", options) .status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Internal Servor Error"
        })
    }
}