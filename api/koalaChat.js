import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { authMiddleware } from "../middleware/auth.js";
import Chat from "../models/Chat.js";

// Cache MongoDB connection
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined!");
  if (!cached.promise)
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
  cached.conn = await cached.promise;
  return cached.conn;
}

// OpenAI client
if (!process.env.OPENAI_API_KEY)
  throw new Error("OPENAI_API_KEY is not defined!");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to run Express middleware
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

    const { user_query, history } = req.body;
    if (!user_query)
      return res.status(400).json({ ai_response: "No query provided." });

    const messages = (history || []).map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    messages.unshift({
      role: "system",
      content: "You are KoalaRoute AI, a helpful travel assistant.",
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
    });

    const aiMessage =
      response.choices?.[0]?.message?.content || "No response from AI";

    // Save conversation
    const chatMessages = [
      ...(history || []),
      { role: "user", content: user_query },
      { role: "ai", content: aiMessage },
    ];

    const chat = new Chat({ user: req.user.id, messages: chatMessages });
    await chat.save();

    return res.status(200).json({ ai_response: aiMessage, chatId: chat._id });
  } catch (err) {
    console.error("Error in /api/koalaChat:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
}
