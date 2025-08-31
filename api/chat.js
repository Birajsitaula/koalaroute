import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { authMiddleware } from "../middleware/auth.js";
import Chat from "../models/Chat.js";

// Cache MongoDB connection across invocations
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined!");
  if (!cached.promise)
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
  cached.conn = await cached.promise;
  return cached.conn;
}

// Helper to run Express middleware in serverless
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

export default async function handler(req, res) {
  try {
    await connectMongo();
    await runMiddleware(req, res, authMiddleware);

    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Use Chat model exactly as before
    const chat = new Chat({
      user: req.user.id,
      messages, // messages array from request
    });
    await chat.save();

    return res.status(201).json({ message: "Chat saved", chatId: chat._id });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
}
