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

// Routes
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRoutes);
app.use("/api/koalaroute", koalaRoute);
app.use("/api/contact", contactRoutes);

// MongoDB connection caching for serverless
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined!");
  if (!cached.promise)
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected");
  return cached.conn;
}

// Export as serverless handler
export default async function handler(req, res) {
  try {
    await connectMongo();
    app(req, res); // pass request to Express app
  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
