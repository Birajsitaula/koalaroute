import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { authMiddleware } from "../middleware/auth.js";
import Chat from "../models/Chat.js";
import mongoose from "mongoose";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache MongoDB connection across serverless invocations
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise)
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
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

export default async function handler(req, res) {
  try {
    await connectMongo();

    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Run auth middleware
    await runMiddleware(req, res, authMiddleware);

    const { user_query, history } = req.body;
    if (!user_query)
      return res.status(400).json({ ai_response: "No query provided." });

    // Convert messages to OpenAI roles
    const messages = (history || []).map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    // Add system prompt
    messages.unshift({
      role: "system",
      content: "You are KoalaRoute AI, a helpful travel assistant.",
    });

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
    });

    const aiMessage =
      response.choices[0].message.content || "No response from AI";

    // Save conversation to Chat model
    const chatMessages = [
      ...(history || []),
      { role: "ai", content: aiMessage },
      { role: "user", content: user_query },
    ];

    const chat = new Chat({ user: req.user.id, messages: chatMessages });
    await chat.save();

    return res.json({ ai_response: aiMessage, chatId: chat._id });
  } catch (error) {
    console.error("Error in /koalaChat:", error);
    return res
      .status(500)
      .json({ ai_response: "Error connecting to OpenAI API." });
  }
}
