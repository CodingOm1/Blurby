// models/DirectChat.js
const mongoose = require("mongoose");

const DirectChatSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Two users
  lastMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
});

const DirectChatModel = mongoose.models.DirectChat || mongoose.model("DirectChat", DirectChatSchema);
module.exports = DirectChatModel;
