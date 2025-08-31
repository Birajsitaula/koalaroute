// // import React, { useState } from "react";
// // import { BASE_URL } from "../config";
// // import "./ManualFlightForm.css";

// // const conversionRates = {
// //   usd: 1,
// //   eur: 0.93,
// //   gbp: 0.81,
// // };

// // export default function ManualFlightForm() {
// //   const [origin, setOrigin] = useState("");
// //   const [destination, setDestination] = useState("");
// //   const [departure, setDeparture] = useState("");
// //   const [returnDate, setReturnDate] = useState("");
// //   const [currency, setCurrency] = useState("usd");
// //   const [flights, setFlights] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleSearch = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setFlights([]);

// //     if (!origin || !destination || !departure) {
// //       setError("Origin, destination, and departure date are required.");
// //       return;
// //     }

// //     setLoading(true);
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       setError("You are not authenticated.");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       // Always request USD from API
// //       const res = await fetch(`${BASE_URL}/koalaroute/flights`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           origin,
// //           destination,
// //           departure_at: departure,
// //           return_at: returnDate,
// //           currency: "usd",
// //         }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.error || "Failed to fetch flights");
// //       }

// //       // Convert price to selected currency
// //       const rate = conversionRates[currency] || 1;
// //       const convertedFlights = data.data.map((flight) => ({
// //         ...flight,
// //         price: (flight.price * rate).toFixed(2),
// //       }));

// //       setFlights(convertedFlights);
// //     } catch (err) {
// //       console.error("Flight search error:", err);
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="manual-flight-form">
// //       <h2>Search Flights</h2>
// //       <form onSubmit={handleSearch}>
// //         <input
// //           type="text"
// //           placeholder="Origin (e.g., NYC)"
// //           value={origin}
// //           onChange={(e) => setOrigin(e.target.value.toUpperCase())}
// //         />
// //         <input
// //           type="text"
// //           placeholder="Destination (e.g., LON)"
// //           value={destination}
// //           onChange={(e) => setDestination(e.target.value.toUpperCase())}
// //         />
// //         <input
// //           type="date"
// //           value={departure}
// //           onChange={(e) => setDeparture(e.target.value)}
// //         />
// //         <input
// //           type="date"
// //           value={returnDate}
// //           onChange={(e) => setReturnDate(e.target.value)}
// //         />
// //         <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
// //           <option value="usd">USD</option>
// //           <option value="eur">EUR</option>
// //           <option value="gbp">GBP</option>
// //         </select>
// //         <button type="submit" disabled={loading}>
// //           {loading ? "Searching..." : "Search"}
// //         </button>
// //       </form>

// //       {error && <p className="error-text">{error}</p>}

// //       {flights.length > 0 && (
// //         <table className="flights-table">
// //           <thead>
// //             <tr>
// //               <th>Airline</th>
// //               <th>Origin</th>
// //               <th>Destination</th>
// //               <th>Departure</th>
// //               <th>Return</th>
// //               <th>Price ({currency.toUpperCase()})</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {flights.map((flight, index) => (
// //               <tr key={index}>
// //                 <td>{flight.airline || "-"}</td>
// //                 <td>{flight.origin}</td>
// //                 <td>{flight.destination}</td>
// //                 <td>{flight.departure_at}</td>
// //                 <td>{flight.return_at || "-"}</td>
// //                 <td>{flight.price}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}
// //     </div>
// //   );
// // }

// // dummy object
// import React, { useState } from "react";
// import "./ManualFlightForm.css";
// //
// // import React, { useState } from "react";
// // import "./ModernFlightForm.css";

// const conversionRates = {
//   usd: 1,
//   eur: 0.93,
//   gbp: 0.81,
//   jpy: 154.63,
//   cad: 1.37,
// };

// const airlines = [
//   "Delta Airlines",
//   "Qatar Airways",
//   "Emirates",
//   "British Airways",
//   "American Airlines",
//   "Lufthansa",
//   "Singapore Airlines",
// ];

// const popularDestinations = [
//   { code: "NYC", name: "New York" },
//   { code: "LON", name: "London" },
//   { code: "PAR", name: "Paris" },
//   { code: "DXB", name: "Dubai" },
//   { code: "TOK", name: "Tokyo" },
//   { code: "SYD", name: "Sydney" },
//   { code: "ROM", name: "Rome" },
//   { code: "BER", name: "Berlin" },
// ];

// // Generate dummy flight data
// const generateDummyFlights = (
//   origin,
//   destination,
//   departure,
//   returnDate,
//   passengers,
//   cabinClass
// ) => {
//   const basePrices = {
//     "NYC-LON": { economy: 550, premium: 850, business: 1200, first: 2000 },
//     "NYC-PAR": { economy: 600, premium: 900, business: 1300, first: 2200 },
//     "LON-NYC": { economy: 500, premium: 800, business: 1100, first: 1900 },
//     "LON-PAR": { economy: 150, premium: 250, business: 400, first: 700 },
//     "PAR-NYC": { economy: 620, premium: 920, business: 1350, first: 2300 },
//     "PAR-LON": { economy: 140, premium: 240, business: 380, first: 650 },
//     "DXB-LON": { economy: 420, premium: 650, business: 950, first: 1600 },
//     "TOK-NYC": { economy: 850, premium: 1200, business: 1800, first: 2800 },
//   };

//   const routeKey = `${origin}-${destination}`;
//   const basePriceObj = basePrices[routeKey] || {
//     economy: Math.floor(Math.random() * 400) + 300,
//     premium: Math.floor(Math.random() * 600) + 500,
//     business: Math.floor(Math.random() * 800) + 700,
//     first: Math.floor(Math.random() * 1200) + 1000,
//   };

//   const basePrice = basePriceObj[cabinClass] || basePriceObj.economy;

//   return Array.from({ length: 5 }, (_, i) => {
//     const airline = airlines[Math.floor(Math.random() * airlines.length)];
//     const priceModifier = 0.8 + Math.random() * 0.4;
//     const price = (basePrice * priceModifier * passengers.total).toFixed(2);

//     // Add some variation to dates
//     const depDate = new Date(departure);
//     if (i > 0) depDate.setDate(depDate.getDate() + (i - 2));

//     const retDate = new Date(returnDate);
//     if (i > 0 && returnDate) retDate.setDate(retDate.getDate() + (i - 2));

//     return {
//       airline,
//       origin,
//       destination,
//       departure_at: depDate.toISOString().split("T")[0],
//       return_at: returnDate ? retDate.toISOString().split("T")[0] : null,
//       price: parseFloat(price),
//       duration: `${Math.floor(Math.random() * 5) + 7}h ${Math.floor(
//         Math.random() * 60
//       )}m`,
//       stops: i % 3 === 0 ? 0 : i % 3,
//       cabinClass,
//     };
//   }).sort((a, b) => a.price - b.price);
// };

// export default function ModernFlightForm() {
//   const [origin, setOrigin] = useState("");
//   const [destination, setDestination] = useState("");
//   const [departure, setDeparture] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [tripType, setTripType] = useState("roundtrip");
//   const [currency, setCurrency] = useState("usd");
//   const [passengers, setPassengers] = useState({
//     adults: 1,
//     children: 0,
//     infants: 0,
//     total: 1,
//   });
//   const [cabinClass, setCabinClass] = useState("economy");
//   const [flights, setFlights] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [expandedFlight, setExpandedFlight] = useState(null);
//   const [showPassengerOptions, setShowPassengerOptions] = useState(false);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setError("");
//     setFlights([]);
//     setExpandedFlight(null);

//     if (!origin || !destination || !departure) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     if (tripType === "roundtrip" && !returnDate) {
//       setError("Return date is required for round trips.");
//       return;
//     }

//     setLoading(true);

//     // Simulate API call delay
//     setTimeout(() => {
//       try {
//         const rate = conversionRates[currency] || 1;
//         const foundFlights = generateDummyFlights(
//           origin,
//           destination,
//           departure,
//           returnDate,
//           passengers,
//           cabinClass
//         );

//         const convertedFlights = foundFlights.map((flight) => ({
//           ...flight,
//           convertedPrice: (flight.price * rate).toFixed(2),
//         }));

//         setFlights(convertedFlights);
//       } catch (err) {
//         console.error("Flight search error:", err);
//         setError("An error occurred while searching for flights.");
//       } finally {
//         setLoading(false);
//       }
//     }, 1500);
//   };

//   const handleBookNow = (flight) => {
//     alert(
//       `Booking confirmed for ${flight.airline} from ${flight.origin} to ${
//         flight.destination
//       } for ${passengers.total} passenger(s) in ${cabinClass} class. Total: ${
//         flight.convertedPrice
//       } ${currency.toUpperCase()}.`
//     );
//   };

//   const handleSwapCities = () => {
//     setOrigin(destination);
//     setDestination(origin);
//   };

//   const handlePopularDestinationSelect = (code) => {
//     if (!origin) {
//       setOrigin(code);
//     } else if (!destination) {
//       setDestination(code);
//     } else {
//       setOrigin(destination);
//       setDestination(code);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const options = { month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const updatePassengerCount = (type, delta) => {
//     setPassengers((prev) => {
//       const newValue = Math.max(0, prev[type] + delta);

//       // Validation rules
//       if (type === "adults" && newValue < 1) return prev; // At least 1 adult
//       if (type === "infants" && newValue > prev.adults) return prev; // Infants can't exceed adults

//       const newPassengers = {
//         ...prev,
//         [type]: newValue,
//         total: prev.total + delta,
//       };

//       return newPassengers;
//     });
//   };

//   const getPassengerSummary = () => {
//     let summary = `${passengers.adults} Adult${
//       passengers.adults !== 1 ? "s" : ""
//     }`;
//     if (passengers.children > 0)
//       summary += `, ${passengers.children} Child${
//         passengers.children !== 1 ? "ren" : ""
//       }`;
//     if (passengers.infants > 0)
//       summary += `, ${passengers.infants} Infant${
//         passengers.infants !== 1 ? "s" : ""
//       }`;
//     return summary;
//   };

//   return (
//     <div className="modern-flight-app">
//       <div className="flight-form-container">
//         <div className="form-header">
//           <h1>Find Your Perfect Flight</h1>
//           <p>Search and compare flights from hundreds of airlines</p>
//         </div>

//         <div className="trip-type-selector">
//           <button
//             className={tripType === "oneway" ? "active" : ""}
//             onClick={() => setTripType("oneway")}
//           >
//             One Way
//           </button>
//           <button
//             className={tripType === "roundtrip" ? "active" : ""}
//             onClick={() => setTripType("roundtrip")}
//           >
//             Round Trip
//           </button>
//         </div>

//         <form onSubmit={handleSearch}>
//           <div className="input-grid">
//             <div className="input-group">
//               <label>From</label>
//               <div className="input-with-icon">
//                 <span className="icon">✈</span>
//                 <input
//                   type="text"
//                   placeholder="City or airport code"
//                   value={origin}
//                   onChange={(e) => setOrigin(e.target.value.toUpperCase())}
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="button"
//               className="swap-button"
//               onClick={handleSwapCities}
//             >
//               ⇄
//             </button>

//             <div className="input-group">
//               <label>To</label>
//               <div className="input-with-icon">
//                 <span className="icon">✈</span>
//                 <input
//                   type="text"
//                   placeholder="City or airport code"
//                   value={destination}
//                   onChange={(e) => setDestination(e.target.value.toUpperCase())}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="input-group">
//               <label>Departure</label>
//               <div className="input-with-icon">
//                 <span className="icon">📅</span>
//                 <input
//                   type="date"
//                   value={departure}
//                   onChange={(e) => setDeparture(e.target.value)}
//                   min={new Date().toISOString().split("T")[0]}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="input-group">
//               <label>Return {tripType === "oneway" && "(Optional)"}</label>
//               <div className="input-with-icon">
//                 <span className="icon">📅</span>
//                 <input
//                   type="date"
//                   value={returnDate}
//                   onChange={(e) => setReturnDate(e.target.value)}
//                   min={departure || new Date().toISOString().split("T")[0]}
//                   disabled={tripType === "oneway"}
//                 />
//               </div>
//             </div>

//             <div className="input-group passenger-input">
//               <label>Passengers</label>
//               <div
//                 className="passenger-selector-trigger"
//                 onClick={() => setShowPassengerOptions(!showPassengerOptions)}
//               >
//                 <span className="icon">👥</span>
//                 <span>{getPassengerSummary()}</span>
//               </div>

//               {showPassengerOptions && (
//                 <div className="passenger-options">
//                   <div className="passenger-option">
//                     <div>
//                       <div className="passenger-type">Adults</div>
//                       <div className="passenger-age">12+ years</div>
//                     </div>
//                     <div className="passenger-controls">
//                       <button
//                         type="button"
//                         onClick={() => updatePassengerCount("adults", -1)}
//                         disabled={passengers.adults <= 1}
//                       >
//                         −
//                       </button>
//                       <span>{passengers.adults}</span>
//                       <button
//                         type="button"
//                         onClick={() => updatePassengerCount("adults", 1)}
//                         disabled={passengers.adults >= 9}
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>

//                   <div className="passenger-option">
//                     <div>
//                       <div className="passenger-type">Children</div>
//                       <div className="passenger-age">2-11 years</div>
//                     </div>
//                     <div className="passenger-controls">
//                       <button
//                         type="button"
//                         onClick={() => updatePassengerCount("children", -1)}
//                         disabled={passengers.children <= 0}
//                       >
//                         −
//                       </button>
//                       <span>{passengers.children}</span>
//                       <button
//                         type="button"
//                         onClick={() => updatePassengerCount("children", 1)}
//                         disabled={passengers.children >= 9}
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>

//                   <div className="passenger-option">
//                     <div>
//                       <div className="passenger-type">Infants</div>
//                       <div className="passenger-age">Under 2 years</div>
//                     </div>
//                     <div className="passenger-controls">
//                       <button
//                         type="button"
//                         onClick={() => updatePassengerCount("infants", -1)}
//                         disabled={passengers.infants <= 0}
//                       >
//                         −
//                       </button>
//                       <span>{passengers.infants}</span>
//                       <button
//                         type="button"
//                         onClick={() => updatePassengerCount("infants", 1)}
//                         disabled={
//                           passengers.infants >= passengers.adults ||
//                           passengers.infants >= 9
//                         }
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     className="close-passenger-options"
//                     onClick={() => setShowPassengerOptions(false)}
//                   >
//                     Done
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="input-group">
//               <label>Cabin Class</label>
//               <select
//                 value={cabinClass}
//                 onChange={(e) => setCabinClass(e.target.value)}
//               >
//                 <option value="economy">Economy</option>
//                 <option value="premium">Premium Economy</option>
//                 <option value="business">Business</option>
//                 <option value="first">First Class</option>
//               </select>
//             </div>

//             <div className="input-group">
//               <label>Currency</label>
//               <select
//                 value={currency}
//                 onChange={(e) => setCurrency(e.target.value)}
//               >
//                 <option value="usd">USD ($)</option>
//                 <option value="eur">EUR (€)</option>
//                 <option value="gbp">GBP (£)</option>
//                 <option value="jpy">JPY (¥)</option>
//                 <option value="cad">CAD (C$)</option>
//               </select>
//             </div>
//           </div>

//           <button type="submit" className="search-button" disabled={loading}>
//             {loading ? (
//               <>
//                 <span className="spinner"></span>
//                 Searching...
//               </>
//             ) : (
//               <>
//                 <span className="search-icon">🔍</span>
//                 Search Flights
//               </>
//             )}
//           </button>
//         </form>

//         <div className="popular-destinations">
//           <h3>Popular Destinations</h3>
//           <div className="destination-chips">
//             {popularDestinations.map((dest) => (
//               <button
//                 key={dest.code}
//                 className="destination-chip"
//                 onClick={() => handlePopularDestinationSelect(dest.code)}
//               >
//                 {dest.code} - {dest.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         {flights.length > 0 && (
//           <div className="results-container">
//             <h2>Available Flights</h2>
//             <p className="results-count">
//               {flights.length} flights found ·{" "}
//               {cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1)} ·{" "}
//               {getPassengerSummary()}
//             </p>

//             <div className="flights-list">
//               {flights.map((flight, index) => (
//                 <div key={index} className="flight-card">
//                   <div
//                     className="flight-main"
//                     onClick={() =>
//                       setExpandedFlight(expandedFlight === index ? null : index)
//                     }
//                   >
//                     <div className="airline-info">
//                       <div className="airline-logo">
//                         {flight.airline.charAt(0)}
//                       </div>
//                       <div className="airline-name">{flight.airline}</div>
//                       <div className="cabin-class">
//                         {flight.cabinClass.charAt(0).toUpperCase() +
//                           flight.cabinClass.slice(1)}
//                       </div>
//                     </div>

//                     <div className="flight-times">
//                       <div className="time-block">
//                         <div className="time">
//                           {new Date(flight.departure_at).toLocaleTimeString(
//                             [],
//                             { hour: "2-digit", minute: "2-digit" }
//                           )}
//                         </div>
//                         <div className="city">{flight.origin}</div>
//                         <div className="date">
//                           {formatDate(flight.departure_at)}
//                         </div>
//                       </div>

//                       <div className="flight-duration">
//                         <div className="duration-line">
//                           <span className="line"></span>
//                           <span className="plane">✈</span>
//                         </div>
//                         <div className="duration">{flight.duration}</div>
//                         <div className="stops">
//                           {flight.stops === 0
//                             ? "Nonstop"
//                             : `${flight.stops} stop${
//                                 flight.stops > 1 ? "s" : ""
//                               }`}
//                         </div>
//                       </div>

//                       <div className="time-block">
//                         <div className="time">
//                           {flight.return_at
//                             ? new Date(flight.return_at).toLocaleTimeString(
//                                 [],
//                                 { hour: "2-digit", minute: "2-digit" }
//                               )
//                             : "-"}
//                         </div>
//                         <div className="city">{flight.destination}</div>
//                         <div className="date">
//                           {formatDate(flight.return_at)}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flight-price">
//                       <div className="price">
//                         {flight.convertedPrice} {currency.toUpperCase()}
//                       </div>
//                       <div className="price-note">
//                         total for {passengers.total} passenger(s)
//                       </div>
//                       <button
//                         className="book-button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleBookNow(flight);
//                         }}
//                       >
//                         Select
//                       </button>
//                     </div>
//                   </div>

//                   {expandedFlight === index && (
//                     <div className="flight-details">
//                       <div className="detail-row">
//                         <span>Departure:</span>
//                         <span>
//                           {formatDate(flight.departure_at)} ·{" "}
//                           {new Date(flight.departure_at).toLocaleTimeString(
//                             [],
//                             { hour: "2-digit", minute: "2-digit" }
//                           )}
//                         </span>
//                       </div>
//                       {flight.return_at && (
//                         <div className="detail-row">
//                           <span>Return:</span>
//                           <span>
//                             {formatDate(flight.return_at)} ·{" "}
//                             {new Date(flight.return_at).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </span>
//                         </div>
//                       )}
//                       <div className="detail-row">
//                         <span>Duration:</span>
//                         <span>{flight.duration}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span>Stops:</span>
//                         <span>
//                           {flight.stops === 0
//                             ? "Nonstop"
//                             : `${flight.stops} stop${
//                                 flight.stops > 1 ? "s" : ""
//                               }`}
//                         </span>
//                       </div>
//                       <div className="detail-row">
//                         <span>Cabin Class:</span>
//                         <span>
//                           {flight.cabinClass.charAt(0).toUpperCase() +
//                             flight.cabinClass.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { BASE_URL } from "../config";
import "./ManualFlightForm.css";

export default function ManualFlightForm() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [passengers, setPassengers] = useState(1);
  const [tripClass, setTripClass] = useState("Y");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchId, setSearchId] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setFlights([]);
    setSearchId("");

    if (!origin || !destination || !departure) {
      setError("Origin, destination, and departure date are required.");
      return;
    }

    setLoading(true);
    setSearchStatus("Initializing flight search...");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authenticated.");
      setLoading(false);
      setSearchStatus("");
      return;
    }

    try {
      // Initialize search
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
          currency,
          passengers,
          trip_class: tripClass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize flight search");
      }

      // Set search ID for potential polling
      setSearchId(data.search_id);
      setSearchStatus("Searching for flights. This may take up to a minute...");

      // Display results if already available
      if (data.data && data.data.length > 0) {
        setFlights(data.data);
        setSearchStatus("");
      } else {
        // If results aren't immediately available, poll for them
        pollForResults(data.search_id, token);
      }
    } catch (err) {
      console.error("Flight search error:", err);
      setError(err.message);
      setSearchStatus("");
      setLoading(false);
    }
  };

  const pollForResults = async (searchId, token) => {
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      attempts++;

      try {
        const res = await fetch(`${BASE_URL}/koalaroute/flights/${searchId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch flight results");
        }

        if (data.data && data.data.length > 0) {
          // We have results
          setFlights(data.data);
          setSearchStatus("");
          setLoading(false);
          return;
        } else if (attempts < maxAttempts) {
          // Continue polling
          setSearchStatus(
            `Searching for flights... (Attempt ${attempts}/${maxAttempts})`
          );
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          // Max attempts reached
          setError("Flight search timeout. Please try again.");
          setSearchStatus("");
          setLoading(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setError("Flight search failed. Please try again.");
          setSearchStatus("");
          setLoading(false);
        }
      }
    };

    // Start polling
    poll();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="manual-flight-form">
      <h2>Search Flights</h2>
      <form onSubmit={handleSearch}>
        <div className="form-row">
          <div className="form-group">
            <label>Origin (IATA code)</label>
            <input
              type="text"
              placeholder="e.g., NYC"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              maxLength={3}
            />
          </div>

          <div className="form-group">
            <label>Destination (IATA code)</label>
            <input
              type="text"
              placeholder="e.g., LON"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              maxLength={3}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Departure Date</label>
            <input
              type="date"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label>Return Date (optional)</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={departure || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Passengers</label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Class</label>
            <select
              value={tripClass}
              onChange={(e) => setTripClass(e.target.value)}
            >
              <option value="Y">Economy</option>
              <option value="C">Business</option>
              <option value="F">First</option>
            </select>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </form>

      {searchStatus && <div className="search-status">{searchStatus}</div>}
      {error && <p className="error-text">{error}</p>}

      {flights.length > 0 && (
        <div className="results-container">
          <h3>Found {flights.length} Flights</h3>
          <div className="flights-list">
            {flights.map((flight, index) => (
              <div key={index} className="flight-card">
                <div className="flight-header">
                  <div className="airline">
                    {flight.airline || "Multiple Airlines"}
                  </div>
                  <div className="price">
                    {flight.price} {flight.currency}
                  </div>
                </div>

                <div className="flight-details">
                  <div className="route">
                    <div className="segment">
                      <div className="city">{flight.origin}</div>
                      <div className="time">
                        {formatTime(flight.departure_at)}
                      </div>
                      <div className="date">
                        {formatDate(flight.departure_at)}
                      </div>
                    </div>

                    <div className="arrow">→</div>

                    <div className="segment">
                      <div className="city">{flight.destination}</div>
                      <div className="time">
                        {formatTime(flight.arrival_at)}
                      </div>
                      <div className="date">
                        {formatDate(flight.arrival_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flight-info">
                    <div className="info-item">
                      <span className="label">Duration:</span>
                      <span className="value">{flight.duration} min</span>
                    </div>

                    <div className="info-item">
                      <span className="label">Transfers:</span>
                      <span className="value">{flight.transfers || 0}</span>
                    </div>

                    <div className="info-item">
                      <span className="label">Flight number:</span>
                      <span className="value">
                        {flight.flight_number || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="select-flight">Select Flight</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
