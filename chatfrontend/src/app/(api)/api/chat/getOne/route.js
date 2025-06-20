import DirectChatModel from "@/models/chat.model";
import UserModel from "@/models/user.model";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // ✅ GET chatId from URL
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    const authHeader = req.headers.get("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "No token provided!" }, { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRETKEY);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token!" }, { status: 401 });
    }

    const userId = decoded.userId;

    // ✅ Await user check
    const isUser = await UserModel.findById(userId);
    if (!isUser) {
      return NextResponse.json({ message: "User is not authenticated!" }, { status: 404 });
    }

    const Chat = await DirectChatModel.findById(chatId);
    if (!Chat) {
      return NextResponse.json({ message: "Chat is not found!" }, { status: 400 });
    }

    return NextResponse.json({ message: "Chat found", Chat });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
