import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) throw new Error("MONGO_URI is not defined!");

// Cache MongoDB connection across serverless invocations
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise)
    cached.promise = mongoose.connect(mongoUri).then((mongoose) => mongoose);
  cached.conn = await cached.promise;
  return cached.conn;
}

// Helper to run Express-style middleware in serverless
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

// Serverless handler
export default async function handler(req, res) {
  try {
    await connectMongo();

    // Run auth middleware
    await runMiddleware(req, res, authMiddleware);

    const { method } = req;

    if (method === "POST") {
      const { messages } = req.body;
      if (!messages)
        return res.status(400).json({ error: "Messages are required" });

      const chat = new Chat({ user: req.user.id, messages });
      await chat.save();

      return res.status(201).json({ message: "Chat saved", chatId: chat._id });
    }

    if (method === "GET") {
      const chats = await Chat.find({ user: req.user.id }).sort({
        createdAt: -1,
      });
      return res.status(200).json(chats);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${method} not allowed` });
  } catch (err) {
    console.error("Error in /chat:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
