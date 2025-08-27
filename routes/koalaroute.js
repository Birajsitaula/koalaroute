//Updated code

import express from "express";
import fetch from "node-fetch";
import { authMiddleware } from "../middleware/auth.js";
import "dotenv/config";

const router = express.Router();

const AVIASALES_API =
  "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";
const TOKEN = process.env.AVIASALES_API_KEY;
router.get("/", (req, res) => {
  try {
    // const userId = req.user.id;
    res.json({
      msg: "Welcome !",
      // userId,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});
// Dashboard route
router.get("/dashboard", authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    res.json({
      msg: "Welcome back!",
      userId,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Flights API
router.post("/flights", authMiddleware, async (req, res) => {
  try {
    if (!TOKEN) {
      return res
        .status(500)
        .json({ error: "Server configuration error: API key missing" });
    }

    const { origin, destination, departure_at, return_at, currency } = req.body;

    if (!origin || !destination || !departure_at) {
      return res.status(400).json({
        error: "Origin, destination, and departure date are required",
      });
    }

    // Validate date format
    const depDate = new Date(departure_at);
    if (isNaN(depDate.getTime())) {
      return res.status(400).json({ error: "Invalid departure date" });
    }

    let retDate = "";
    if (return_at) {
      const rDate = new Date(return_at);
      if (isNaN(rDate.getTime())) {
        return res.status(400).json({ error: "Invalid return date" });
      }
      retDate = return_at;
    }

    const url = `${AVIASALES_API}?origin=${origin}&destination=${destination}&departure_at=${departure_at}&return_at=${retDate}&currency=${
      currency || "usd"
    }&token=${TOKEN}`;

    console.log(`Fetching flights from ${origin} to ${destination}`); // don't log token

    const response = await fetch(url);

    // Check HTTP response
    const data = await response.json();
    if (!response.ok) {
      console.error("Aviasales API Error:", data);
      return res.status(response.status).json({
        error: data.error || data.message || "Aviasales API request failed",
      });
    }
    console.log(data.data);
    console.log(data.data.length);
    res.json({ data: data.data || [] });
  } catch (err) {
    console.error("Flight API Error:", err);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

export default router;
