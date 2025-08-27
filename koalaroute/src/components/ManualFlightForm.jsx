// updatted
import React, { useState } from "react";
import { BASE_URL } from "../config";
import "./ManualFlightForm.css";

// Simple conversion rates (USD to other currencies)
// You can update these or fetch from a currency API
const conversionRates = {
  usd: 1,
  eur: 0.93,
  gbp: 0.81,
};

export default function ManualFlightForm() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setFlights([]);

    if (!origin || !destination || !departure) {
      setError("Origin, destination, and departure date are required.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authenticated.");
      setLoading(false);
      return;
    }

    try {
      // Always request USD from API
      const res = await fetch(`${BASE_URL}/koalaroute/flights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin,
          destination,
          departure_at: departure,
          return_at: returnDate,
          currency: "usd",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch flights");
      }

      // Convert price to selected currency
      const rate = conversionRates[currency] || 1;
      const convertedFlights = data.data.map((flight) => ({
        ...flight,
        price: (flight.price * rate).toFixed(2),
      }));

      setFlights(convertedFlights);
    } catch (err) {
      console.error("Flight search error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manual-flight-form">
      <h2>Search Flights</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Origin (e.g., NYC)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
        />
        <input
          type="text"
          placeholder="Destination (e.g., LON)"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
        />
        <input
          type="date"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {flights.length > 0 && (
        <table className="flights-table">
          <thead>
            <tr>
              <th>Airline</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Departure</th>
              <th>Return</th>
              <th>Price ({currency.toUpperCase()})</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, index) => (
              <tr key={index}>
                <td>{flight.airline || "-"}</td>
                <td>{flight.origin}</td>
                <td>{flight.destination}</td>
                <td>{flight.departure_at}</td>
                <td>{flight.return_at || "-"}</td>
                <td>{flight.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
