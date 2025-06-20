import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import React from "react";
import jwt from "jsonwebtoken";
import UserModel from "@/models/user.model";

export async function GET(req) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        {
          message: "No token provided!",
        },
        { status: 400 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRETKEY);
    } catch (err) {
      return NextResponse.json(
        {
          message: "Invalid token",
        },
        { status: 404 }
      );
    }
    const userId = decoded.userId;

    const User = await UserModel.findById(userId);

    if (!User) {
      return NextResponse.json(
        {
          message: "User does not exist, login again!",
        },
        { status: 404 }
      );
    }

    const id = decoded.userId;
    return NextResponse.json(
      {
        message: "User fetch successful!",
        User,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error,
      },
      { status: 500 }
    );
  }
}
