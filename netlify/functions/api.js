import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../../models/User.js"; // Adjust if model is in a different path
import koalaRoute from "../../routes/koalaroute.js";
import contactRoutes from "../../routes/contact.js";
import chatRouter from "../../app/api/chat/route.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ===== MongoDB Connection (Prevent multiple connections) =====
const mongoUri = process.env.MONGO_URI;
if (!mongoose.connection.readyState) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// ===== Auth Middleware =====
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// ===== Auth Routes =====
const authRouter = express.Router();

// Signup
authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected Route Example
authRouter.get("/me", authMiddleware, (req, res) => {
  res.json({ msg: `Welcome, user ID: ${req.user.id}` });
});

// ===== Register Routes =====
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/koalaroute", koalaRoute);
app.use("/api/contact", contactRoutes);

// ===== Export Serverless Handler =====
export const handler = serverless(app);
