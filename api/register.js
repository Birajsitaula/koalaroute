import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("❌ MONGO_URI is not defined!");
}

// Cache MongoDB connection across serverless invocations
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Serverless handler
export default async function handler(req, res) {
  try {
    await connectMongo();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    console.error("Error in /register:", err);
    if (err.code === 11000) {
      // Duplicate key error (unique email)
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
}
