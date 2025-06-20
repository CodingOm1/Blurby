// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be DirectChat or GroupChat
    chatModel: { type: String, enum: ['DirectChat', 'GroupChat'], required: true }, // To identify type
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Who has read this
});

const MessageModel = mongoose.model.Message || mongoose.model('Message', MessageSchema);
module.exports = MessageModel
