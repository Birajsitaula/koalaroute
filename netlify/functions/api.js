// netlify/functions/api.js
import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import User from "./User.js"; // Your Mongoose model

// Import routers correctly
import { koalaRouter } from "./koalaroutes.js"; // Corrected file name and named import
import contactRouter from "./contact.js"; // Default import is correct

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) console.error("❌ MONGO_URI not defined");

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------- Auth Routes ---------------- //

// Signup
app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Email and password required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ---------------- Koala Routes ---------------- //
app.use("/koalaroute", koalaRouter); // Use the imported koalaRouter

// ---------------- Contact Routes ---------------- //
app.use("/contact", contactRouter); // Use the imported contactRouter

// Export handler for Netlify
export const handler = serverless(app);
