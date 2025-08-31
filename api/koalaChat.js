import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { authMiddleware } from "../middleware/auth.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to run Express-style middleware in serverless
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

export default async function handler(req, res) {
  try {
    // Only POST requests allowed
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Run auth middleware
    await runMiddleware(req, res, authMiddleware);

    const { user_query, history } = req.body;

    if (!user_query) {
      return res.status(400).json({ ai_response: "No query provided." });
    }

    // Convert messages to OpenAI roles
    const messages = (history || []).map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    // Add system prompt
    messages.unshift({
      role: "system",
      content: "You are KoalaRoute AI, a helpful travel assistant.",
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
    });

    const aiMessage =
      response.choices[0].message.content || "No response from AI";

    return res.json({ ai_response: aiMessage });
  } catch (error) {
    console.error("Error in /koalaChat:", error);
    return res
      .status(500)
      .json({ ai_response: "Error connecting to OpenAI API." });
  }
}
