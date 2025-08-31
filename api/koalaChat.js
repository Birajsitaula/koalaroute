import mongoose from "mongoose";
import dotenv from "dotenv";
import OpenAI from "openai";
import { authMiddleware } from "../../middleware/auth.js"; // JWT auth
import Chat from "../../models/Chat.js"; // your Chat model

dotenv.config();

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

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to run Express-style middleware
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
    await runMiddleware(req, res, authMiddleware); // authenticate user

    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { user_query, history = [] } = req.body;

    if (!user_query) {
      return res.status(400).json({ ai_response: "No query provided." });
    }

    // Convert messages to OpenAI format
    const messages = history.map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    // Add system prompt
    messages.unshift({
      role: "system",
      content: "You are KoalaRoute AI, a helpful travel assistant.",
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
    });

    const aiMessage =
      response.choices?.[0]?.message?.content || "No response from AI";

    // Save conversation to MongoDB
    const chatMessages = [
      ...history,
      { role: "user", content: user_query },
      { role: "ai", content: aiMessage },
    ];

    const chat = new Chat({ user: req.user.id, messages: chatMessages });
    await chat.save();

    return res.status(200).json({ ai_response: aiMessage, chatId: chat._id });
  } catch (err) {
    console.error("Serverless /api/chat error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
}
