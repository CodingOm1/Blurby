require("dotenv").config();
const express = require("express");
const app = express();
const SocketIO = require("socket.io");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const UserModel = require("./models/user.model");
const DirectChatModel = require("./models/chat.model");

const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Client Connected: " + socket.id);

  socket.on("fetch-all-chats", async (data) => {
    const { Blurbytoken } = data;

    const token = Blurbytoken.split(" ")[1];
    if (!token) {
      socket.emit("fetch-all-chats", {
        status: "error",
        message: "Token is not valide, login again!",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRETKEY);
    } catch (err) {
      socket.emit("fetch-all-chats", {
        status: `error: ${err}`,
        message: "Internal server error!",
      });
    }
    const userId = decoded.userId;

    const User = await UserModel.findById(userId);

    if (!User) {
      socket.emit("fetch-all-chats", {
        status: "error",
        message: "User is not existed anymore, Sign up again!",
      });
    }

    const chats = await DirectChatModel.find({ members: userId }).populate(
      "members",
      "_id firstName lastName profileImg"
    );

    if (!chats) {
      socket.emit("fetch-all-chats", {
        status: "success",
        message: "No any chats yet!",
      });
    }

    socket.emit("fetch-all-chats", {
      status: "success",
      message: "Chat fetched successfully!",
      chats,
    });

    console.log(chats)
  });

  socket.on("disconnect", () => {
    console.log("🛑 Client Disconnected: " + socket.id);
  });
});

app.use(cors());
connectDB();

server.listen(5000, () => console.log("Server Running on Port 5000"));
