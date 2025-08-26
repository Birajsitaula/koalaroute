// updated
// routes/koalaroute.js
import express from "express";
import fetch from "node-fetch";
import { authMiddleware } from "../middleware/auth.js"; // optional, if you want auth
import "dotenv/config";

const router = express.Router();

const AVIASALES_API =
  "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";
const TOKEN = process.env.AVIASALES_API_KEY;

router.post("/flights", async (req, res) => {
  try {
    const { origin, destination, departure_at, return_at, currency } = req.body;

    if (!origin || !destination) {
      return res
        .status(400)
        .json({ error: "Origin and destination are required" });
    }

    const url = `${AVIASALES_API}?origin=${origin}&destination=${destination}&departure_at=${departure_at}&return_at=${
      return_at || ""
    }&currency=${currency || "usd"}&token=${TOKEN}`;

    console.log("Fetching URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    // Return the full flights array
    res.json({ data: data.data || [] });
  } catch (err) {
    console.error("Flight API Error:", err);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

export default router;
