import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.user.email);
        navigate("/koalaroute");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to connect to backend.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/"); // redirect if already logged in
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form" autoComplete="on">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username" // <-- browser uses saved email
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" // <-- browser uses saved password
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
