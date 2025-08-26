import React from "react";
import "./TabNavigation.css";

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "chat", label: "Chat" },
    { key: "flights", label: "Flights" },
    { key: "hotels", label: "Hotels" },
    { key: "alerts", label: "Price Alerts" },
  ];

  return (
    <div className="tab-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
