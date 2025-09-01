import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Import routers
import { authRouter } from "./auth.js";
import { koalaRouter } from "./koalaroutes.js";
import contactRouter from "./contact.js"; // Make sure default export

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/koalaroute", koalaRouter);
app.use("/contact", contactRouter);

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI not defined");
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export const handler = serverless(app);
