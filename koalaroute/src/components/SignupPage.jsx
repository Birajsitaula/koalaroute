import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Account created! Please login.");
        navigate("/login");
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to connect to backend.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup} className="signup-form" autoComplete="on">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password" // <-- browser knows this is new password
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
