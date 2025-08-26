import React, { useState } from "react";
import { BASE_URL } from "../config";
import "./ManualFlightForm.css";

export default function ManualFlightForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/koalaroute/flights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ from, to, date }),
      });

      const data = await res.json();
      setResults(data.flights || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch flights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-form-container">
      <h3>Search Flights</h3>
      <form onSubmit={handleSearch} className="flight-form">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">{loading ? "Searching..." : "Search"}</button>
      </form>

      {results.length > 0 && (
        <div className="flight-results">
          {results.map((f, idx) => (
            <div key={idx} className="flight-card">
              <p>
                {f.airline} - {f.from} → {f.to}
              </p>
              <p>Departure: {f.departure}</p>
              <p>Price: ${f.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
