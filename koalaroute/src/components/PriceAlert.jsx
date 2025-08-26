import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import "./PriceAlert.css";

export default function PriceAlert() {
  const [alerts, setAlerts] = useState([]);
  const [flight, setFlight] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/koalaroute/alerts`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAddAlert = async (e) => {
    e.preventDefault();
    if (!flight || !targetPrice) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/koalaroute/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ flight, targetPrice }),
      });

      if (res.ok) {
        setFlight("");
        setTargetPrice("");
        fetchAlerts();
      } else {
        alert("Failed to add alert");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alert-container">
      <h3>Price Alerts</h3>

      <form onSubmit={handleAddAlert} className="alert-form">
        <input
          type="text"
          placeholder="Flight Name"
          value={flight}
          onChange={(e) => setFlight(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Target Price"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          required
        />
        <button type="submit">{loading ? "Adding..." : "Add Alert"}</button>
      </form>

      {alerts.length > 0 ? (
        <div className="alert-list">
          {alerts.map((a, idx) => (
            <div key={idx} className="alert-card">
              <p>{a.flight}</p>
              <p>Target: ${a.targetPrice}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No alerts yet.</p>
      )}
    </div>
  );
}
