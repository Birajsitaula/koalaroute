// netlify/functions/koalaroutes.js
import express from "express";

export const koalaRouter = express.Router();

// Example route
koalaRouter.get("/", (req, res) => {
  res.json({ msg: "KoalaRoute is working!" });
});

// Example POST route
koalaRouter.post("/query", (req, res) => {
  const { user_query } = req.body;
  res.json({ reply: `You asked: ${user_query}` });
});
