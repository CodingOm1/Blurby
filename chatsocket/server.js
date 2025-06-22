require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const DirectChatModel = require("./models/chat.model");
const MessageModel = require("./models/message.model");
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

  socket.on("send-message", async (data) => {
    try {
      const { senderId, chatId, message, chatModel } = data;

      const sender = await UserModel.findById(senderId).select(
        "_id firstName lastName profileImg"
      );
      if (!sender) {
        return socket.emit("msg-send-error", {
          status: "error",
          message: "Invalid sender ID",
        });
      }

      let chat;
      if (chatModel === "DirectChat") {
        chat = await DirectChatModel.findOne({
          _id: chatId,
          members: senderId,
        });
      }

      if (!chat) {
        return socket.emit("msg-send-error", {
          status: "error",
          message: "Chat not found or access denied",
        });
      }

      const newMessage = await MessageModel.create(
        {
          chatId,
          chatModel,
          sender: senderId,
          message,
          msgType: "Personal",
        },
        {
          // Disable change stream for this operation
          disableMiddlewares: true,
        }
      );

      // Populate the sender info

      const messageToSend = {
        ...newMessage.toObject(),
        sender,
        chatId,
      };

      // EMIT ONLY ONCE - to everyone in the chat room
      io.to(chatId.toString()).emit("single-message", {
        message: messageToSend,
        tempId: data.tempId, // Pass through the tempId
      });

      // Update chat last message
      await DirectChatModel.findByIdAndUpdate(chatId, {
        lastMessage: message,
        updatedAt: new Date(),
      });
    } catch (error) {
      socket.emit("msg-send-error", {
        status: "error",
        message: "Failed to send message",
      });
    }
  });

  // Message Change Stream for real-time updates
  // Remove the message change stream or modify it to avoid duplicates
  const messageChangeStream = MessageModel.watch([], {
    fullDocument: "updateLookup",
  });

  messageChangeStream.on("change", (change) => {
    // if (change.operationType === "insert") {
    //   // Don't emit here - we're handling it in send-message
    // }
  });

  // Get initial messages
  // Store intervals per socket+chat
  const messageIntervals = {};

  socket.on("get-messages", async ({ chatId, limit = 50, skip = 0 }) => {
    // Clear any previous interval for this chat
    if (messageIntervals[chatId]) {
      clearInterval(messageIntervals[chatId]);
    }

    // Define the polling function
    const fetchMessages = async () => {
      try {
        const chat = await DirectChatModel.findOne({ _id: chatId });
        if (!chat) {
          return socket.emit("messages-error", {
            status: "error",
            message: "Chat not found or access denied",
          });
        }

        const messages = await MessageModel.find({ chatId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("sender", "_id firstName lastName profileImg")
          .lean();

        const orderedMessages = messages.reverse();

        socket.emit("messages-list", {
          status: "success",
          messages: orderedMessages,
          chatId,
          hasMore: messages.length === limit,
        });

        socket.join(chatId.toString());
      } catch (error) {
        socket.emit("messages-error", {
          status: "error",
          message: "Failed to fetch messages",
        });
      }
    };

    // Fetch immediately
    fetchMessages();

    // Start polling every 150ms (like chat list)
    messageIntervals[chatId] = setInterval(fetchMessages, 150);
  });

  // Clean up intervals on disconnect
  socket.on("disconnect", () => {
    Object.values(messageIntervals).forEach(clearInterval);
    clearInterval(interval); // your chat list interval
    chatChangeStream.close();
  });
});

server.listen(5000, () => console.log("🚀 Socket Server Running on Port 5000"));
