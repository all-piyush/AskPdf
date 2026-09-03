const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const cloudinary=require("./Config/cloudinary");
const fileupload=require("express-fileupload");


const app = express();
const PORT = process.env.PORT || 4999;

app.use(cors({
    origin: [
        "http://localhost:3002",
        process.env.FRONTEND_URL
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Server is running...");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174",
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.emit("welcome", "Connected to Socket.IO server!");

    socket.on("message", (data) => {
        console.log("Received:", data);

        // Send to everyone except sender
        io.emit("message", data);

        // OR send to everyone including sender
        // io.emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
cloudinary.cloudinaryConnect();


const authroute=require('./Routes/routes');
app.use('/api/v1',authroute);
app.get('/',(req,res)=>{
    res.send("Welcome to backend server");
})
const dbconnect=require('./Config/database');
dbconnect();


