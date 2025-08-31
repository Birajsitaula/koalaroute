import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "../routes/auth.js";
import koalaRoute from "../routes/koalaroute.js";
import contactRoutes from "../routes/contact.js";
import chatRouter from "../app/api/chat/route.js";

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use("/api/chat", chatRouter);
app.use("/api/auth", authRoutes);
app.use("/api/koalaroute", koalaRoute);
app.use("/api/contact", contactRoutes);

// MongoDB connection
let isConnected = false;
const mongoUri = process.env.MONGO_URI;

async function connectMongo() {
  if (isConnected) return;
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
    isConnected = true;
  } catch (err) {
    console.error(err);
  }
}

// ✅ Export default async handler
export default async function handler(req, res) {
  await connectMongo();
  app(req, res);
}
