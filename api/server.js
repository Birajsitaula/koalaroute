import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "../routes/auth.js";
import koalaRoute from "../routes/koalaroute.js";
import contactRoutes from "../routes/contact.js";
import chatRouter from "../app/api/chat/route.js";

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// API Routes
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRoutes);
app.use("/api/koalaroute", koalaRoute);
app.use("/api/contact", contactRoutes);

// Root API message (optional)
app.get("/api", (req, res) => {
  res.send("🚀 KoalaRoute API is running!");
});

// MongoDB connection (serverless friendly)
const mongoUri = process.env.MONGO_URI;
let isConnected = false;

async function connectMongo() {
  if (isConnected) return;
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
    isConnected = true;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// Export serverless handler
export default async function handler(req, res) {
  await connectMongo();
  app(req, res);
}
