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
const MessageModel = require("./models/message.model");

const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined their room`);
    console.log("Current rooms:", Array.from(socket.rooms));
  });

  socket.on("fetch-all-chats", async (data) => {
    const { userId } = data;

    if (!userId || typeof userId !== "string" || userId.length !== 24) {
      socket.emit("fetch-all-chats", {
        status: "error",
        message: "Invalid or missing userId.",
      });
      return;
    }

    const User = await UserModel.findById(userId);
    if (!User) {
      socket.emit("fetch-all-chats", {
        status: "error",
        message: "User is not existed anymore, Sign up again!",
      });
      return;
    }

    const chats = await DirectChatModel.find({ members: userId }).populate(
      "members",
      "_id firstName lastName profileImg"
    );

    if (!chats || chats.length === 0) {
      socket.emit("fetch-all-chats", {
        status: "success",
        message: "No any chats yet!",
        chats: [],
      });
      return;
    }

    // For each chat, find the target user (the other member)
    const formattedChats = chats.map((chat) => {
      // Find the member who is not the current user
      const targetUser = chat.members.find(
        (member) => member._id.toString() !== userId.toString()
      );
      return {
        chatId: chat._id,
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt,
        targetUser: targetUser
          ? {
              _id: targetUser._id,
              firstName: targetUser.firstName,
              lastName: targetUser.lastName,
            }
          : null,
      };
    });

    socket.emit("fetch-all-chats", {
      status: "success",
      message: "Chat fetched successfully!",
      chats: formattedChats,
    });
  });
  socket.on("find-user-with-phone", async (data) => {
    const { phone, userId } = data;

    const isAuth = await UserModel.findById(userId);
    if (!isAuth) {
      socket.emit("find-user-with-phone", {
        staus: "error",
        message: "Login now!",
      });
    }
    const result = await UserModel.findOne({ phone: phone });
    console.log(result);
    if (!result) {
      socket.emit("find-user-with-phone", {
        status: "good",
        message: "Not any user exist of that phone",
      });
    }

    socket.emit("find-user-with-phone", {
      status: "good",
      message: "User found",
      result,
    });
  });

  socket.on("create-new-chat", async (data) => {
    const { userId, targetedId } = data;
    try {
      if (userId === targetedId) {
        socket.emit("create-new-chat", {
          status: "error",
          message: "cannot create chat with your self",
        });
      }
      const isAuth = await UserModel.findById(userId);
      if (!isAuth) {
        socket.emit("create-new-chat", {
          status: "error",
          message: "Login Now!",
        });
      }

      const isTarget = await UserModel.findById(targetedId).populate(
        "firstName lastName _id"
      );
      if (!isTarget) {
        socket.emit("create-new-chat", {
          status: "error",
          message: "Not exist anymore!",
        });
      }

      const isExistChat = await DirectChatModel.findOne({
        members: [userId, targetedId],
      });
      if (isExistChat) {
        socket.emit("create-new-chat", {
          status: "good",
          message: "Chat already exist!",
          chat: isExistChat,
          newUser: isTarget,
        });
        return;
      }

      const CreateChat = await DirectChatModel.create({
        members: [userId, targetedId],
      });

      socket.emit("create-new-chat", {
        status: "good",
        chatId: CreateChat._id,
        lastMessage: CreateChat.lastMessage,
        updatedAt: CreateChat.updatedAt,
        targetUser: isTarget,
      });

      const senderRoom = io.sockets.adapter.rooms.get(userId.toString());
      const receiverRoom = io.sockets.adapter.rooms.get(targetedId.toString());

      if (senderRoom && receiverRoom) {
        // Both users are in their rooms, emit to both
        io.to(userId.toString()).emit("fetchMessages", {
          status: "good",
          chatId: CreateChat._id,
          lastMessage: CreateChat.lastMessage,
          updatedAt: CreateChat.updatedAt,
          targetUser: isTarget,
        });
        io.to(targetedId.toString()).emit("fetchMessages", {
          status: "good",
          chatId: CreateChat._id,
          lastMessage: CreateChat.lastMessage,
          updatedAt: CreateChat.updatedAt,
          targetUser: isTarget,
        });
      } else {
        socket.emit("create-new-chat", {
          status: "good",
          chatId: CreateChat._id,
          lastMessage: CreateChat.lastMessage,
          updatedAt: CreateChat.updatedAt,
          targetUser: isTarget,
        });
      }
    } catch (error) {
      console.log(error);
      socket.emit("create-new-chat", {
        status: "error",
        message: "Error in Internal servers",
      });
    }
  });

  socket.on("fetchMessages", async (data) => {
    const { chatId, userId } = data;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return socket.emit("fetchMessages", {
          status: "error",
          message: "Please authenticate",
        });
      }

      const chat = await DirectChatModel.findById(chatId);
      if (!chat) {
        return socket.emit("fetchMessages", {
          status: "error",
          message: "Chat does not exist",
        });
      }

      const messages = await MessageModel.find({ chatId });

      socket.emit("fetchMessages", {
        status: "success",
        messages: messages || [],
        message: messages.length === 0 ? "No messages yet" : undefined,
      });
    } catch (error) {
      console.error(error);
      socket.emit("fetchMessages", {
        status: "error",
        message: "Server error",
      });
    }
  });

  socket.on("sendMessage", async (data) => {
    const { userId, targetUserId, message } = data;

    if (
      !userId ||
      typeof userId !== "string" ||
      userId.length !== 24 ||
      !targetUserId ||
      typeof targetUserId !== "string" ||
      targetUserId.length !== 24
    ) {
      return socket.emit("sendMessage", {
        status: "error",
        message: "Invalid or missing userId/targetUserId.",
      });
    }
    try {
      console.log(userId, targetUserId, message);
      const user = await UserModel.findById(userId);
      if (!user) {
        return socket.emit("sendMessage", {
          status: "error",
          message: "Invalid sender",
        });
      }

      const targetUser = await UserModel.findById(targetUserId);
      if (!targetUser) {
        return socket.emit("sendMessage", {
          status: "error",
          message: "Invalid receiver",
        });
      }

      // Use $all to match both users regardless of order
      let chat = await DirectChatModel.findOne({
        members: { $all: [userId, targetUserId] },
      });

      if (!chat) {
        return socket.emit("sendMessage", {
          status: "error",
          message: "Chat does not exist",
        });
      }

      const chatId = chat._id;

      const newMessage = await MessageModel.create({
        chatId: chat._id,
        chatModel: "DirectChat",
        sender: userId,
        message: message,
        msgType: "Personal",
      });
      const messages = await MessageModel.find({ chatId });
      console.log(messages.length);

      const senderRoom = io.sockets.adapter.rooms.get(userId.toString());
      const receiverRoom = io.sockets.adapter.rooms.get(
        targetUserId.toString()
      );

      if (senderRoom && receiverRoom) {
        // Both users are in their rooms, emit to both
        io.to(userId.toString()).emit("fetchMessages", {
          chatId: chat._id,
          userId: userId,
          messages,
        });
        io.to(targetUserId.toString()).emit("fetchMessages", {
          chatId: chat._id,
          userId: targetUserId,
          messages,
        });
      } else {
        // Only sender is present, emit to sender only
        socket.emit("fetchMessages", {
          chatId: chat._id,
          userId: userId,
          messages,
        });
      }
    } catch (error) {
      console.error(error);
      socket.emit("sendMessage", {
        status: "error",
        message: "Server error",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("🛑 Client Disconnected: " + socket.id);
  });
});

app.use(cors());
connectDB();

server.listen(5000, () => console.log("Server Running on Port 5000"));
