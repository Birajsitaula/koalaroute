// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Chat from "./Chat";
// import ManualFlightForm from "./ManualFlightForm";
// import ManualHotelForm from "./ManualHotelForm";
// import PriceAlert from "./PriceAlert";
// import TabNavigation from "./TabNavigation";
// import { BASE_URL } from "../config";
// import "./KoalaRoute.css";

// export default function KoalaRoute() {
//   const [activeTab, setActiveTab] = useState("chat");
//   const [dashboardData, setDashboardData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     fetch(`${BASE_URL}/koalaroute/dashboard`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         if (res.status === 401) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("isLoggedIn");
//           localStorage.removeItem("userEmail");
//           navigate("/login");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setDashboardData(data);
//         setIsLoading(false);
//       })
//       .catch(() => navigate("/login"));
//   }, [navigate]);

//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <p className="loading-text">Checking authentication...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="koalaroute-container">
//       <div className="dashboard-box">
//         <div className="dashboard-header">
//           <h1 className="dashboard-title">Welcome to KoalaRoute AI 🚀</h1>
//           {dashboardData && (
//             <p className="dashboard-msg">
//               {dashboardData.msg}{" "}
//               <span className="dashboard-user">
//                 User ID: {dashboardData.userId}
//               </span>
//             </p>
//           )}
//         </div>

//         {/* Tab Navigation */}
//         <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

//         {/* Tab Content */}
//         <div className="tab-content">
//           {activeTab === "chat" && <Chat />}
//           {activeTab === "flights" && <ManualFlightForm />}
//           {activeTab === "hotels" && <ManualHotelForm />}
//           {activeTab === "alerts" && <PriceAlert />}
//         </div>
//       </div>
//     </div>
//   );
// }

// updated
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import ManualFlightForm from "./ManualFlightForm";
import ManualHotelForm from "./ManualHotelForm";
import PriceAlert from "./PriceAlert";
import TabNavigation from "./TabNavigation";
import { BASE_URL } from "../config";
import "./KoalaRoute.css";

export default function KoalaRoute() {
  const [activeTab, setActiveTab] = useState("chat");
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/koalaroute/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userEmail");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setDashboardData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="koalaroute-container">
      <div className="dashboard-box">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome to KoalaRoute AI 🚀</h1>
          {dashboardData && (
            <p className="dashboard-msg">
              {dashboardData.msg}{" "}
              <span className="dashboard-user">
                User ID: {dashboardData.userId}
              </span>
            </p>
          )}
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "chat" && <Chat />}
          {activeTab === "flights" && <ManualFlightForm />}
          {activeTab === "hotels" && <ManualHotelForm />}
          {activeTab === "alerts" && <PriceAlert />}
        </div>
      </div>
    </div>
  );
}
