const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token found"
            });
        }

        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decoded);
            req.user = decoded;

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or expired"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.isadmin = (req, res, next) => {
    try {

        if (!req.user.admin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.checkauth = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Authenticated",
        user: req.user,
        role: req.user.admin ? "admin" : "user"
    });
};