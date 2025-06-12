import UserModel from "@/models/user.model";
import DirectChatModel from "@/models/chat.model";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { UserPhone } = body;
    const authHeader = req.headers.get("authorization");

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "No token provided!" }, { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRETKEY);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 404 });
    }

    const userId = decoded.userId;

    const User = await UserModel.findById(userId);
    if (!User) {
      return NextResponse.json({ message: "User does not exist, login again!" }, { status: 404 });
    }


    const ChatUser = await UserModel.findOne({ phone: UserPhone });
    if (!ChatUser) {
      return NextResponse.json({ message: `No any User found of phone ${UserPhone}` }, { status: 404 });
    }

    const myUserId = userId;

    const existingChat = await DirectChatModel.findOne({
      members: { $all: [myUserId, ChatUser._id] },
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat });
    }

    const newChat = await DirectChatModel.create({
      members: [myUserId, ChatUser._id],
    });

    return NextResponse.json({ chat: newChat });

  } catch (error) {
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}
