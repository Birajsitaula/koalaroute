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

// Root route (optional but recommended)
app.get("/", (req, res) => {
  res.send("🚀 KoalaRoute API is running!");
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI is not defined. Did you set it in Railway?");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Export Express app for Vercel (NO app.listen)
export default app;
