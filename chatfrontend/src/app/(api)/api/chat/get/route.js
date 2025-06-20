import { connectDB } from "@/lib/db";
import DirectChatModel from "@/models/chat.model";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
    await connectDB();

    try {
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

        const chats = await DirectChatModel.find({ members: userId })
            .sort({ updatedAt: -1 }) // recent chats first
            .populate("members", "firstName lastName phone"); // get basic user info

        return NextResponse.json({ chats }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
