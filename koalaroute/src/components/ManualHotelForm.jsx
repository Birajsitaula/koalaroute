import React, { useState } from "react";
import { BASE_URL } from "../config";
import "./ManualHotelForm.css";

export default function ManualHotelForm() {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/koalaroute/hotels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ city, checkIn, checkOut }),
      });

      const data = await res.json();
      setResults(data.hotels || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hotel-form-container">
      <h3>Search Hotels</h3>
      <form onSubmit={handleSearch} className="hotel-form">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Check-in"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Check-out"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
        <button type="submit">{loading ? "Searching..." : "Search"}</button>
      </form>

      {results.length > 0 && (
        <div className="hotel-results">
          {results.map((h, idx) => (
            <div key={idx} className="hotel-card">
              <p>
                {h.name} - {h.city}
              </p>
              <p>Rating: {h.rating}</p>
              <p>Price: ${h.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
