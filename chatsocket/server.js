require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const DirectChatModel = require("./models/chat.model");
const UserModel = require("./models/user.model");

// Setup
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Next.js frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
connectDB();

// Listen socket
io.on("connection", (socket) => {
  console.log("✅ Client Connected: " + socket.id);

  // MongoDB Change Stream - Real Time Updates
  const chatChangeStream = DirectChatModel.watch();

  chatChangeStream.on("change", (change) => {
    console.log("📡 Change detected:", change);

    if (change.operationType === "insert") {
      socket.emit("new-chat", {
        time: new Date().toISOString(),
        chat: change.fullDocument,
      });
    }
  });

  // Optional: Polling (You can remove this if using only Change Streams)
  const interval = setInterval(async () => {
    try {
      const ChatList = await DirectChatModel.find();

      const users = ChatList.flatMap((chat) => chat.members);

      // Fetch user details in parallel
      const userDetails = await Promise.all(
        users.map(async (userId) => {
          const user = await UserModel.findById(userId).select(
            "_id profileImg firstName lastName"
          ); // Only id & name
          return user;
        })
      );

      socket.emit("chat-list", {
        time: new Date().toISOString(),
        chats: ChatList,
        users: userDetails, // ✅ Send names & ids
      });
    } catch (error) {
      console.error("❌ Error fetching chat list:", error.message);
      socket.emit("chat-list-error", { error: "Failed to fetch chat list" });
    }
  }, 150);

  socket.on("find-user-with-phone", async (data) => {
    const { userId, phone } = data;

    try {
      const isAuth = await UserModel.findById(userId)
      if (!isAuth) {
        socket.emit("User is not authenticated to create new chat!")
      }
      const user = await UserModel.findOne({phone})
      
    if (user) {
      socket.emit("user-found", user);
    } else {
      socket.emit("user-not-found", { message: "User not found" });
    }
    } catch (error) {
      console.log("Failed to search: ", error);
      socket.emit("Error");
    }
  });

  // On disconnect
  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected: " + socket.id);
    clearInterval(interval); // Clear interval to save memory
    chatChangeStream.close(); // Close change stream safely
  });
});

server.listen(5000, () => console.log("🚀 Socket Server Running on Port 5000"));
