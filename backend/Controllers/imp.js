const Imp = require("../Models/imp");

exports.getimp = async (req, res) => {
  try {
    console.log("YESS");
    const imp = await Imp.find({});
    console.log(imp);
    return res.status(200).json({
      success: true,
      imp
    });

  } catch (error) {

    console.error("Get Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats"
    });
  }
};