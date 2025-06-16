import { connectDB } from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import DirectChatModel from "@/models/chat.model";
import MessageModel from "@/models/message.model";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  try {
    const body = req.json();
    const { chatId, message } = body;

    const authHeader = req.headers.get("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return NextResponse.json({ message: "No token" }, { status: 400 });

    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const userId = decoded.userId;
    const isSender = await UserModel.findById(userId);
    if (!isSender) {
      return NextResponse.json(
        {
          message: "User does not exist",
        },
        { status: 404 }
      );
    }

    const newMessage = await MessageModel.create({
      chatId,
      chatModel: "DirectChat",
      sender: userId,
      text_message: message,
    });

    await DirectChatModel.findByIdAndUpdate(chatId, {
      lastMessage: message,
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Message sent", newMessage });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error!",
      },
      { status: 500 }
    );
  }
}
