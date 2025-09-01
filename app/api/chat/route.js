import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import OpenAI from "openai";

// Routes
import authRoutes from "../../routes/auth.js";
import koalaRoute from "../../routes/koalaroute.js";
import contactRoutes from "../../routes/contact.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ===== MongoDB Connection =====
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI not set in environment variables.");
  await mongoose.connect(mongoUri);
  isConnected = true;
  console.log("✅ MongoDB connected (Netlify function)");
};
connectDB().catch(console.error);

// ===== OpenAI Client =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== Chat Route =====
const chatRouter = express.Router();
chatRouter.post("/", async (req, res) => {
  try {
    const { user_query, history } = req.body;
    if (!user_query)
      return res.status(400).json({ ai_response: "No query provided." });

    const messages = history.map((msg) => ({
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

    res.json({
      ai_response: response.choices[0].message.content || "No response from AI",
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ ai_response: "Error connecting to OpenAI API." });
  }
});

// ===== Register Routes =====
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRoutes);
app.use("/api/koalaroute", koalaRoute);
app.use("/api/contact", contactRoutes);

// ===== Export for Netlify =====
export const handler = serverless(app);
