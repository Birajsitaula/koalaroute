// netlify/functions/koalaroute.js
import fetch from "node-fetch";
import crypto from "crypto";

const TOKEN = process.env.AVIASALES_API_KEY;
const MARKER = process.env.AVIASALES_MARKER;

function generateSignature(params, token) {
  const flattenObject = (obj) => {
    const values = [];
    const processValue = (value) => {
      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) value.forEach(processValue);
        else Object.values(value).forEach(processValue);
      } else values.push(value.toString());
    };
    Object.values(obj).forEach(processValue);
    return values.sort();
  };
  const values = flattenObject(params);
  return crypto
    .createHash("md5")
    .update(`${token}:${values.join(":")}`)
    .digest("hex");
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);
  const {
    origin,
    destination,
    departure_at,
    return_at,
    passengers = 1,
    trip_class = "Y",
  } = body;

  if (!origin || !destination || !departure_at) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Origin, destination, and departure date are required",
      }),
    };
  }

  try {
    const segments = [
      {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        date: departure_at,
      },
    ];
    if (return_at)
      segments.push({
        origin: destination.toUpperCase(),
        destination: origin.toUpperCase(),
        date: return_at,
      });

    const requestParams = {
      marker: MARKER,
      host: "netlify",
      user_ip: "127.0.0.1",
      locale: "en",
      trip_class: trip_class.toUpperCase(),
      passengers: { adults: parseInt(passengers), children: 0, infants: 0 },
      segments,
      signature: generateSignature({ marker: MARKER, segments }, TOKEN),
    };

    const response = await fetch(
      "https://api.travelpayouts.com/v1/flight_search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": TOKEN,
        },
        body: JSON.stringify(requestParams),
      }
    );

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
