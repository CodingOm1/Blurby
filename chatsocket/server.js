require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const DirectChatModel = require("./models/chat.model");
const UserModel = require("./models/user.model");
const mongoose = require("mongoose");

// Setup
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
connectDB();

// Helper function to validate IDs
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

io.on("connection", (socket) => {
  console.log("✅ Client Connected: " + socket.id);

  // MongoDB Change Stream
  const chatChangeStream = DirectChatModel.watch();
  chatChangeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      socket.emit("new-chat", {
        status: "success",
        chat: change.fullDocument,
      });
    }
  });

  // Polling interval
  const interval = setInterval(async () => {
    try {
      const ChatList = await DirectChatModel.find();
      const users = [...new Set(ChatList.flatMap((chat) => chat.members))];

      const userDetails = await Promise.all(
        users.map(async (userId) => {
          if (!isValidId(userId)) return null;
          const user = await UserModel.findById(userId).select(
            "_id profileImg firstName lastName"
          );
          return user;
        })
      );

      socket.emit("chat-list", {
        status: "success",
        chats: ChatList,
        users: userDetails.filter((user) => user !== null),
      });
    } catch (error) {
      console.error("Error fetching chat list:", error);
      socket.emit("chat-list-error", {
        status: "error",
        message: "Failed to fetch chat list",
      });
    }
  }, 150);

  // Find user by phone
  socket.on("find-user-with-phone", async (data) => {
    try {
      const { userId, phone } = data;

      if (!isValidId(userId)) {
        return socket.emit("user-found", {
          status: "error",
          message: "Invalid user ID",
        });
      }

      if (!phone || phone.length !== 10) {
        return socket.emit("user-found", {
          status: "error",
          message: "Invalid phone number",
        });
      }

      const authUser = await UserModel.findById(userId);
      if (!authUser) {
        return socket.emit("user-found", {
          status: "error",
          message: "User not authenticated",
        });
      }

      const user = await UserModel.findOne({ phone }).select(
        "_id profileImg firstName lastName phone"
      );
      if (!user) {
        return socket.emit("user-found", {
          status: "error",
          message: "User not found",
        });
      }

      socket.emit("user-found", {
        status: "success",
        user,
      });
    } catch (error) {
      socket.emit("user-found", {
        status: "error",
        message: "Failed to search user",
      });
    }
  });

  // Create new chat
  socket.on("create-new-chat", async (data) => {
    try {
      const { userId, newUserId } = data;

      if (!isValidId(userId) || !isValidId(newUserId)) {
        return socket.emit("chat-created", {
          status: "error",
          message: "Invalid user IDs",
        });
      }

      if (userId === newUserId) {
        return socket.emit("chat-created", {
          status: "error",
          message: "Cannot create chat with yourself",
        });
      }

      const [authUser, targetUser] = await Promise.all([
        UserModel.findById(userId),
        UserModel.findById(newUserId).select(
          "_id profileImg firstName lastName"
        ),
      ]);

      if (!authUser || !targetUser) {
        return socket.emit("chat-created", {
          status: "error",
          message: "One or both users not found",
        });
      }

      // Changed to strictly check for 2-member chats only
      const existingChat = await DirectChatModel.findOne({
        members: { $all: [userId, newUserId], $size: 2 },
      });

      if (existingChat) {
        return socket.emit("chat-created", {
          status: "success",
          chat: existingChat,
          targetUser: targetUser, // Only send target user info
          message: "Chat already exists",
        });
      }

      const newChat = await DirectChatModel.create({
        members: [userId, newUserId],
      });

      // Only send target user info, not auth user
      socket.emit("chat-created", {
        status: "success",
        chat: newChat,
        targetUser: targetUser,
      });
    } catch (error) {
      socket.emit("chat-created", {
        status: "error",
        message: "Failed to create chat",
      });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected: " + socket.id);
    clearInterval(interval);
    chatChangeStream.close();
  });
});

server.listen(5000, () => console.log("🚀 Socket Server Running on Port 5000"));
