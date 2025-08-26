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
//   const [sortOption, setSortOption] = useState("price"); // default sort by price

//   const cityToIata = {
//     Sydney: "SYD",
//     Melbourne: "MEL",
//     Kathmandu: "KTM",
//     Paris: "CDG",
//     NewYork: "JFK",
//     London: "LON",
//     Tokyo: "HND",
//     Delhi: "DEL",
//     Loss: "LAx",
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

//updated and used the fake data
// import React, { useState, useEffect } from "react";
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
//   const [tripType, setTripType] = useState("one-way");
//   const [passengers, setPassengers] = useState(1);

//   const cityToIata = {
//     Sydney: "SYD",
//     Melbourne: "MEL",
//     Brisbane: "BNE",
//     Perth: "PER",
//     Adelaide: "ADL",
//     GoldCoast: "OOL",
//     Canberra: "CBR",
//     Hobart: "HBA",
//     Darwin: "DRW",
//     Cairns: "CNS",
//     Auckland: "AKL",
//     Wellington: "WLG",
//     Christchurch: "CHC",
//     Queenstown: "ZQN",
//     Singapore: "SIN",
//     Bangkok: "BKK",
//     Tokyo: "HND",
//     Osaka: "KIX",
//     Seoul: "ICN",
//     Beijing: "PEK",
//     Shanghai: "PVG",
//     HongKong: "HKG",
//     Taipei: "TPE",
//     KualaLumpur: "KUL",
//     Jakarta: "CGK",
//     Manila: "MNL",
//     HoChiMinh: "SGN",
//     Hanoi: "HAN",
//     Dubai: "DXB",
//     London: "LHR",
//     Paris: "CDG",
//     Frankfurt: "FRA",
//     Amsterdam: "AMS",
//     Madrid: "MAD",
//     Rome: "FCO",
//     NewYork: "JFK",
//     LosAngeles: "LAX",
//     SanFrancisco: "SFO",
//     Vancouver: "YVR",
//     Toronto: "YYZ",
//     ADDISABABA: "ADD",
//     LOS_ANGELES: "LAX",
//     Kathmandu: "KTM",
//     Delhi: "DEL",
//   };

//   const cities = Object.keys(cityToIata);
//   const [originSuggestions, setOriginSuggestions] = useState([]);
//   const [destinationSuggestions, setDestinationSuggestions] = useState([]);
//   const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
//   const [showDestinationSuggestions, setShowDestinationSuggestions] =
//     useState(false);

//   // Set minimum date to today
//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     setDeparture(today);
//   }, []);

//   const handleOriginChange = (value) => {
//     setOrigin(value);
//     setShowOriginSuggestions(true);
//     setOriginSuggestions(
//       cities
//         .filter(
//           (c) =>
//             c.toLowerCase().includes(value.toLowerCase()) ||
//             cityToIata[c].toLowerCase().includes(value.toLowerCase())
//         )
//         .slice(0, 5)
//     );
//   };

//   const handleDestinationChange = (value) => {
//     setDestination(value);
//     setShowDestinationSuggestions(true);
//     setDestinationSuggestions(
//       cities
//         .filter(
//           (c) =>
//             c.toLowerCase().includes(value.toLowerCase()) ||
//             cityToIata[c].toLowerCase().includes(value.toLowerCase())
//         )
//         .slice(0, 5)
//     );
//   };

//   const selectOrigin = (city) => {
//     setOrigin(city);
//     setShowOriginSuggestions(false);
//   };

//   const selectDestination = (city) => {
//     setDestination(city);
//     setShowDestinationSuggestions(false);
//   };

//   const generateFlightNumber = (airline) => {
//     const letters = airline.substring(0, 2).toUpperCase();
//     const numbers = Math.floor(100 + Math.random() * 900);
//     return `${letters}${numbers}`;
//   };

//   const generateMockFlights = (originCode, destinationCode, departureDate) => {
//     const airlines = [
//       "Qantas",
//       "Virgin Australia",
//       "Jetstar",
//       "Air New Zealand",
//       "Singapore Airlines",
//       "Emirates",
//       "Cathay Pacific",
//       "AirAsia",
//     ];

//     const results = [];

//     // Generate 3-8 flights for this route
//     const numFlights = 3 + Math.floor(Math.random() * 6);

//     for (let i = 0; i < numFlights; i++) {
//       const airline = airlines[Math.floor(Math.random() * airlines.length)];
//       const basePrice = 100 + Math.floor(Math.random() * 400);
//       const flightTimeHours = 1 + Math.floor(Math.random() * 12);
//       const flightTimeMinutes = Math.floor(Math.random() * 60);
//       const flightDuration = `${flightTimeHours}h ${flightTimeMinutes}m`;

//       // Generate random departure time
//       const departureHour = 6 + Math.floor(Math.random() * 14);
//       const departureMinute = Math.floor(Math.random() * 4) * 15;
//       const departureTime = `${departureHour
//         .toString()
//         .padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`;

//       // Calculate arrival time
//       const arrivalHour = (departureHour + flightTimeHours) % 24;
//       const arrivalMinute = (departureMinute + flightTimeMinutes) % 60;
//       const arrivalTime = `${arrivalHour
//         .toString()
//         .padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`;

//       // Generate stops
//       const hasStopover = Math.random() > 0.7;
//       const stops = hasStopover ? 1 : 0;

//       results.push({
//         airline,
//         flightNumber: generateFlightNumber(airline),
//         origin: originCode,
//         destination: destinationCode,
//         departure_at: `${departureDate}T${departureTime}:00`,
//         arrival_at: `${departureDate}T${arrivalTime}:00`,
//         duration: flightDuration,
//         price: basePrice * (hasStopover ? 0.9 : 1), // Stopover flights are cheaper
//         stops,
//         aircraft: ["Boeing 737", "Airbus A320", "Boeing 787", "Airbus A330"][
//           Math.floor(Math.random() * 4)
//         ],
//       });
//     }

//     return results;
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
//       // In a real app, you would make an API call here
//       // For demo purposes, we'll use mock data
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       const mockFlights = generateMockFlights(
//         originCode,
//         destinationCode,
//         departure
//       );

//       if (mockFlights.length > 0) {
//         // Group by airline
//         const grouped = mockFlights.reduce((acc, flight) => {
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
//           } else if (sortOption === "duration") {
//             grouped[airline].sort((a, b) => {
//               const aDuration =
//                 parseInt(a.duration.split("h")[0]) * 60 +
//                 parseInt(a.duration.split(" ")[1].split("m")[0]);
//               const bDuration =
//                 parseInt(b.duration.split("h")[0]) * 60 +
//                 parseInt(b.duration.split(" ")[1].split("m")[0]);
//               return aDuration - bDuration;
//             });
//           }
//         });

//         setFlights(grouped);
//       } else {
//         setErrorMsg("No flights found for your search criteria.");
//       }
//     } catch (err) {
//       console.error(err);
//       setErrorMsg("Error fetching flights. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearForm = () => {
//     setOrigin("");
//     setDestination("");
//     setDeparture(new Date().toISOString().split("T")[0]);
//     setReturnDate("");
//     setFlights({});
//     setErrorMsg("");
//   };

//   return (
//     <div className="flight-fullscreen">
//       <div className="flight-container">
//         <h2>Search Flights</h2>

//         <div className="trip-type-selector">
//           <button
//             className={tripType === "one-way" ? "active" : ""}
//             onClick={() => setTripType("one-way")}
//           >
//             One-way
//           </button>
//           <button
//             className={tripType === "round-trip" ? "active" : ""}
//             onClick={() => setTripType("round-trip")}
//           >
//             Round-trip
//           </button>
//         </div>

//         <div className="flight-form">
//           <div className="input-group">
//             <label>From</label>
//             <div className="suggestion-container">
//               <input
//                 type="text"
//                 placeholder="City or airport"
//                 value={origin}
//                 onChange={(e) => handleOriginChange(e.target.value)}
//                 onFocus={() => setShowOriginSuggestions(true)}
//               />
//               {showOriginSuggestions && originSuggestions.length > 0 && (
//                 <ul className="suggestions-list">
//                   {originSuggestions.map((city, idx) => (
//                     <li key={idx} onClick={() => selectOrigin(city)}>
//                       <span className="city-name">{city}</span>
//                       <span className="iata-code">{cityToIata[city]}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           <div className="input-group">
//             <label>To</label>
//             <div className="suggestion-container">
//               <input
//                 type="text"
//                 placeholder="City or airport"
//                 value={destination}
//                 onChange={(e) => handleDestinationChange(e.target.value)}
//                 onFocus={() => setShowDestinationSuggestions(true)}
//               />
//               {showDestinationSuggestions &&
//                 destinationSuggestions.length > 0 && (
//                   <ul className="suggestions-list">
//                     {destinationSuggestions.map((city, idx) => (
//                       <li key={idx} onClick={() => selectDestination(city)}>
//                         <span className="city-name">{city}</span>
//                         <span className="iata-code">{cityToIata[city]}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//             </div>
//           </div>

//           <div className="input-group">
//             <label>Departure</label>
//             <input
//               type="date"
//               value={departure}
//               min={new Date().toISOString().split("T")[0]}
//               onChange={(e) => setDeparture(e.target.value)}
//             />
//           </div>

//           {tripType === "round-trip" && (
//             <div className="input-group">
//               <label>Return</label>
//               <input
//                 type="date"
//                 value={returnDate}
//                 min={departure}
//                 onChange={(e) => setReturnDate(e.target.value)}
//               />
//             </div>
//           )}

//           <div className="input-group">
//             <label>Passengers</label>
//             <select
//               value={passengers}
//               onChange={(e) => setPassengers(parseInt(e.target.value))}
//             >
//               {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
//                 <option key={num} value={num}>
//                   {num} {num === 1 ? "Passenger" : "Passengers"}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="input-group">
//             <label>Sort by</label>
//             <select
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//             >
//               <option value="price">Price (Lowest first)</option>
//               <option value="departure">Departure time</option>
//               <option value="duration">Duration (Shortest first)</option>
//             </select>
//           </div>

//           <div className="button-group">
//             <button
//               className="search-button"
//               onClick={searchFlights}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner"></span>
//                   Searching...
//                 </>
//               ) : (
//                 `Search Flights`
//               )}
//             </button>

//             <button className="clear-button" onClick={clearForm}>
//               Clear
//             </button>
//           </div>
//         </div>

//         {errorMsg && <div className="error-msg">{errorMsg}</div>}

//         <div className="flight-results">
//           {Object.keys(flights).length > 0 && (
//             <div className="results-header">
//               <h3>Available Flights</h3>
//               <p>{Object.values(flights).flat().length} flights found</p>
//             </div>
//           )}

//           {Object.keys(flights).map((airline) => (
//             <div key={airline} className="airline-group">
//               <h4 className="airline-header">
//                 <span className="airline-name">{airline}</span>
//                 <span className="flights-count">
//                   {flights[airline].length} flights
//                 </span>
//               </h4>

//               <div className="flights-container">
//                 {flights[airline].map((f, idx) => (
//                   <div key={idx} className="flight-card">
//                     <div className="flight-header">
//                       <div className="flight-number">{f.flightNumber}</div>
//                       <div className="flight-price">${f.price}</div>
//                     </div>

//                     <div className="flight-route">
//                       <div className="route-time">
//                         <div className="time">
//                           {new Date(f.departure_at).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </div>
//                         <div className="airport">{f.origin}</div>
//                       </div>

//                       <div className="route-duration">
//                         <div className="duration">{f.duration}</div>
//                         <div className="route-line">
//                           <div className="line"></div>
//                           <div className="stops">
//                             {f.stops} {f.stops === 1 ? "stop" : "stops"}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="route-time">
//                         <div className="time">
//                           {new Date(f.arrival_at).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </div>
//                         <div className="airport">{f.destination}</div>
//                       </div>
//                     </div>

//                     <div className="flight-details">
//                       <span className="aircraft">{f.aircraft}</span>
//                       <button className="select-flight">Select</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
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
  const [flights, setFlights] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sortOption, setSortOption] = useState("price");

  const cityToIata = {
    Sydney: "SYD",
    Melbourne: "MEL",
    Kathmandu: "KTM",
    Paris: "CDG",
    NewYork: "JFK",
    London: "LON",
    Tokyo: "HND",
    Delhi: "DEL",
    LosAngeles: "LAX",
  };
  const cities = Object.keys(cityToIata);

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const handleOriginChange = (value) => {
    setOrigin(value);
    setOriginSuggestions(
      cities.filter((c) => c.toLowerCase().startsWith(value.toLowerCase()))
    );
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
    setDestinationSuggestions(
      cities.filter((c) => c.toLowerCase().startsWith(value.toLowerCase()))
    );
  };

  const searchFlights = async () => {
    if (!origin || !destination || !departure) {
      setErrorMsg("Please fill in origin, destination, and departure date.");
      setFlights({});
      return;
    }

    setLoading(true);
    setFlights({});
    setErrorMsg("");

    const originCode = cityToIata[origin] || origin.toUpperCase();
    const destinationCode =
      cityToIata[destination] || destination.toUpperCase();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/koalaroute/flights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          origin: originCode,
          destination: destinationCode,
          departure_at: departure,
          return_at: returnDate,
          currency: "usd",
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch flights");

      const data = await res.json();

      if (data.data && data.data.length > 0) {
        // Remove duplicates
        const uniqueFlights = data.data.filter(
          (f, idx, arr) =>
            arr.findIndex(
              (x) =>
                x.airline === f.airline &&
                x.origin === f.origin &&
                x.destination === f.destination &&
                x.departure_at === f.departure_at &&
                x.price === f.price
            ) === idx
        );

        // Group by airline
        const grouped = uniqueFlights.reduce((acc, flight) => {
          if (!acc[flight.airline]) acc[flight.airline] = [];
          acc[flight.airline].push(flight);
          return acc;
        }, {});

        // Sort flights inside each airline group
        Object.keys(grouped).forEach((airline) => {
          if (sortOption === "price") {
            grouped[airline].sort((a, b) => a.price - b.price);
          } else if (sortOption === "departure") {
            grouped[airline].sort(
              (a, b) => new Date(a.departure_at) - new Date(b.departure_at)
            );
          }
        });

        setFlights(grouped);
      } else {
        const today = new Date().toISOString().split("T")[0];
        setErrorMsg(
          departure === today
            ? "No flights found for today."
            : "No flights found for the selected date."
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error fetching flights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-fullscreen">
      <div className="flight-container">
        <h2>Search Flights</h2>

        <div className="flight-form">
          <input
            type="text"
            placeholder="Origin (City)"
            value={origin}
            onChange={(e) => handleOriginChange(e.target.value)}
          />
          {originSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {originSuggestions.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setOrigin(city);
                    setOriginSuggestions([]);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}

          <input
            type="text"
            placeholder="Destination (City)"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
          />
          {destinationSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {destinationSuggestions.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setDestination(city);
                    setDestinationSuggestions([]);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}

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

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="price">Sort by Price</option>
            <option value="departure">Sort by Departure</option>
          </select>

          <button onClick={searchFlights}>
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <div className="flight-results">
          {Object.keys(flights).map((airline) => (
            <div key={airline} className="airline-group">
              <h3>{airline}</h3>
              {flights[airline].map((f, idx) => (
                <div key={idx} className="flight-card">
                  <p>
                    {f.origin} → {f.destination}
                  </p>
                  <p>Departure: {new Date(f.departure_at).toLocaleString()}</p>
                  {f.return_at && (
                    <p>Return: {new Date(f.return_at).toLocaleString()}</p>
                  )}
                  <p>Price: ${f.price}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
