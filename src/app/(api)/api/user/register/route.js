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
    const { firstName, lastName, email, password, phone } = body;

    if (!firstName || !email || !password || !phone) {
      return new Response("All fields are required", { status: 400 });
    }

    if (phone.length < 10) {
      return new Response("Phone number must be at least 10 digits", {
        status: 400,
      });
    }
    if (password.length < 6) {
      return new Response("Password must be at least 6 characters", {
        status: 400,
      });
    }
    if (phone.length > 10) {
      return new Response("Phone number must not exceed 10 digits", {
        status: 400,
      });
    }

    const userEmail = await UserModel.findOne({ email });
    const userPhone = await UserModel.findOne({ phone });

    if (userEmail) {
      return new Response("Email already exists", { status: 400 });
    }
    if (userPhone) {
      return new Response("Phone number already exists", { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    const savedUser = await newUser.save();
    let token;
    try {
      token = jwt.sign({ userId: savedUser._id }, process.env.SECRETKEY, {
        expiresIn: "31d",
      });
    } catch (tokenError) {
      // If token generation fails, delete user
      await UserModel.findByIdAndDelete(savedUser._id);
      return new Response("Something went wrong while creating token", {
        status: 500,
      });
    }
    return NextResponse.json(
      {
        message: "User registered successfully",
        savedUser,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error on server:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
