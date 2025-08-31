import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";

import cors from "cors";
import authRoutes from "../routes/auth";
import koalaRoute from "../routes/koalaroute.js";
import contactRoutes from "../routes/contact.js";
import chatRouter from "../app/api/chat/route.js";

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRoutes);
app.use("/api/koalaroute", koalaRoute);
app.use("/api/contact", contactRoutes);

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI is not defined. Did you set it in Railway?");
  process.exit(1);
}

// Connect MongoDB (on first request)
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

// Export the app as a serverless function
export default async function handler(req, res) {
  await connectMongo();
  app(req, res);
}
