"use strict";

import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import UserModel from "@/models/user.model"; // Assuming you have a User model defined
import jwt from "jsonwebtoken";

export async function POST(req) {
  // This function will handle the POST request for user registration
  await connectDB();

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response("All fields are required", { status: 400 });
    }

    if (password.length < 6) {
      return new Response("Password must be at least 6 characters", {
        status: 400,
      });
    }

    const User = await UserModel.findOne({ email }).select("+password");

    if (!User) {
      return new Response("Email does not exists", { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return new Response("Invalid credentials", { status: 400 });
    }

    let token;
    try {
      token = jwt.sign({ userId: User._id }, process.env.SECRETKEY, {
        expiresIn: "31d",
      });
    } catch (tokenError) {
      // If token generation fails, delete user
      await UserModel.findByIdAndDelete(User._id);
      return new Response("Something went wrong while creating token", {
        status: 500,
      });
    }

    const user = {
        _id: User._id,
    }
    return NextResponse.json(
      {
        message: "User Login successfully",
        user,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error on server:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
