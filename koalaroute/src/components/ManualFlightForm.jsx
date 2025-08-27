// import React, { useState } from "react";
// import { BASE_URL } from "../config";
// import "./ManualFlightForm.css";

// export default function ManualFlightForm() {
//   const [origin, setOrigin] = useState("");
//   const [destination, setDestination] = useState("");
//   const [departure, setDeparture] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [flights, setFlights] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [sortOption, setSortOption] = useState("price");

//   const cityToIata = {
//     Sydney: "SYD",
//     Melbourne: "MEL",
//     Kathmandu: "KTM",
//     Paris: "CDG",
//     NewYork: "JFK",
//     London: "LON",
//     Tokyo: "HND",
//     Delhi: "DEL",
//     LosAngeles: "LAX",
//   };
//   const cities = Object.keys(cityToIata);

//   const [originSuggestions, setOriginSuggestions] = useState([]);
//   const [destinationSuggestions, setDestinationSuggestions] = useState([]);

//   const handleOriginChange = (value) => {
//     setOrigin(value);
//     setOriginSuggestions(
//       cities.filter((c) => c.toLowerCase().startsWith(value.toLowerCase()))
//     );
//   };

//   const handleDestinationChange = (value) => {
//     setDestination(value);
//     setDestinationSuggestions(
//       cities.filter((c) => c.toLowerCase().startsWith(value.toLowerCase()))
//     );
//   };

//   const searchFlights = async () => {
//     if (!origin || !destination || !departure) {
//       setErrorMsg("Please fill in origin, destination, and departure date.");
//       setFlights({});
//       return;
//     }

//     setLoading(true);
//     setFlights({});
//     setErrorMsg("");

//     const originCode = cityToIata[origin] || origin.toUpperCase();
//     const destinationCode =
//       cityToIata[destination] || destination.toUpperCase();

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${BASE_URL}/koalaroute/flights`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({
//           origin: originCode,
//           destination: destinationCode,
//           departure_at: departure,
//           return_at: returnDate,
//           currency: "usd",
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to fetch flights");

//       const data = await res.json();

//       if (data.data && data.data.length > 0) {
//         // Remove duplicates
//         const uniqueFlights = data.data.filter(
//           (f, idx, arr) =>
//             arr.findIndex(
//               (x) =>
//                 x.airline === f.airline &&
//                 x.origin === f.origin &&
//                 x.destination === f.destination &&
//                 x.departure_at === f.departure_at &&
//                 x.price === f.price
//             ) === idx
//         );

//         // Group by airline
//         const grouped = uniqueFlights.reduce((acc, flight) => {
//           if (!acc[flight.airline]) acc[flight.airline] = [];
//           acc[flight.airline].push(flight);
//           return acc;
//         }, {});

//         // Sort flights inside each airline group
//         Object.keys(grouped).forEach((airline) => {
//           if (sortOption === "price") {
//             grouped[airline].sort((a, b) => a.price - b.price);
//           } else if (sortOption === "departure") {
//             grouped[airline].sort(
//               (a, b) => new Date(a.departure_at) - new Date(b.departure_at)
//             );
//           }
//         });

//         setFlights(grouped);
//       } else {
//         const today = new Date().toISOString().split("T")[0];
//         setErrorMsg(
//           departure === today
//             ? "No flights found for today."
//             : "No flights found for the selected date."
//         );
//       }
//     } catch (err) {
//       console.error(err);
//       setErrorMsg("Error fetching flights.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flight-fullscreen">
//       <div className="flight-container">
//         <h2>Search Flights</h2>

//         <div className="flight-form">
//           <input
//             type="text"
//             placeholder="Origin (City)"
//             value={origin}
//             onChange={(e) => handleOriginChange(e.target.value)}
//           />
//           {originSuggestions.length > 0 && (
//             <ul className="suggestions-list">
//               {originSuggestions.map((city, idx) => (
//                 <li
//                   key={idx}
//                   onClick={() => {
//                     setOrigin(city);
//                     setOriginSuggestions([]);
//                   }}
//                 >
//                   {city}
//                 </li>
//               ))}
//             </ul>
//           )}

//           <input
//             type="text"
//             placeholder="Destination (City)"
//             value={destination}
//             onChange={(e) => handleDestinationChange(e.target.value)}
//           />
//           {destinationSuggestions.length > 0 && (
//             <ul className="suggestions-list">
//               {destinationSuggestions.map((city, idx) => (
//                 <li
//                   key={idx}
//                   onClick={() => {
//                     setDestination(city);
//                     setDestinationSuggestions([]);
//                   }}
//                 >
//                   {city}
//                 </li>
//               ))}
//             </ul>
//           )}

//           <input
//             type="date"
//             value={departure}
//             onChange={(e) => setDeparture(e.target.value)}
//           />
//           <input
//             type="date"
//             value={returnDate}
//             onChange={(e) => setReturnDate(e.target.value)}
//           />

//           <select
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//           >
//             <option value="price">Sort by Price</option>
//             <option value="departure">Sort by Departure</option>
//           </select>

//           <button onClick={searchFlights}>
//             {loading ? "Searching..." : "Search Flights"}
//           </button>
//         </div>

//         {errorMsg && <p className="error-msg">{errorMsg}</p>}

//         <div className="flight-results">
//           {Object.keys(flights).map((airline) => (
//             <div key={airline} className="airline-group">
//               <h3>{airline}</h3>
//               {flights[airline].map((f, idx) => (
//                 <div key={idx} className="flight-card">
//                   <p>
//                     {f.origin} → {f.destination}
//                   </p>
//                   <p>Departure: {new Date(f.departure_at).toLocaleString()}</p>
//                   {f.return_at && (
//                     <p>Return: {new Date(f.return_at).toLocaleString()}</p>
//                   )}
//                   <p>Price: ${f.price}</p>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

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
