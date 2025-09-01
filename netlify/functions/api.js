import dotenv from "dotenv";
dotenv.config();

import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import cors from "cors";

// Routes & Middleware
import { authMiddleware } from "../../middleware/auth.js";
import User from "../../models/User.js"; // make sure this path is correct
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import crypto from "crypto";
import OpenAI from "openai";

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ----------------------
// MongoDB Connection
// ----------------------
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI not defined");

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log("✅ MongoDB connected");
};

// ----------------------
// Auth Routes
// ----------------------
app.post("/api/auth/signup", async (req, res) => {
  try {
    await connectDB();
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

app.post("/api/auth/login", async (req, res) => {
  try {
    await connectDB();
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

// ----------------------
// Contact Route
// ----------------------
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `New message from ${name}`,
      text: message,
    });

    res.json({ msg: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ----------------------
// KoalaRoute Flight Routes
// ----------------------
const SEARCH_API = "https://api.travelpayouts.com/v1/flight_search";
const RESULTS_API = "https://api.travelpayouts.com/v1/flight_search_results";
const TOKEN = process.env.AVIASALES_API_KEY;
const MARKER = process.env.AVIASALES_MARKER;

function generateSignature(params, token) {
  const values = Object.values(params)
    .flatMap((v) =>
      typeof v === "object" && v !== null ? Object.values(v) : v
    )
    .sort();
  const valuesString = values.join(":");
  return crypto
    .createHash("md5")
    .update(`${token}:${valuesString}`)
    .digest("hex");
}

async function safeJsonParse(response) {
  const text = await response.text();
  if (text.includes("Unauthorized")) throw new Error("Unauthorized");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON from API");
  }
}

// Example flight search endpoint
app.post("/api/koalaroute/flights", authMiddleware, async (req, res) => {
  try {
    const {
      origin,
      destination,
      departure_at,
      return_at,
      currency = "usd",
      passengers = 1,
    } = req.body;
    const segments = [{ origin, destination, date: departure_at }];
    if (return_at)
      segments.push({
        origin: destination,
        destination: origin,
        date: return_at,
      });

    const requestParams = {
      marker: MARKER,
      host: req.headers.host,
      user_ip: req.ip,
      locale: "en",
      passengers: { adults: passengers, children: 0, infants: 0 },
      segments,
    };
    requestParams.signature = generateSignature(requestParams, TOKEN);

    const searchResponse = await fetch(SEARCH_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Access-Token": TOKEN },
      body: JSON.stringify(requestParams),
    });
    const searchData = await safeJsonParse(searchResponse);
    res.json(searchData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Flight search failed: " + err.message });
  }
});

// ----------------------
// OpenAI Chat Route
// ----------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { user_query, history } = req.body;
    if (!user_query)
      return res.status(400).json({ ai_response: "No query provided." });

    const messages = [
      {
        role: "system",
        content: "You are KoalaRoute AI, a helpful travel assistant.",
      },
      ...history.map((msg) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
    });
    const aiMessage =
      response.choices[0].message.content || "No response from AI";
    res.json({ ai_response: aiMessage });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ ai_response: "Error connecting to OpenAI API." });
  }
});

// ----------------------
// Export as serverless function
// ----------------------
export const handler = serverless(app);
