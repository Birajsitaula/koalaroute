import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} KoalaRoute AI. All rights reserved.</p>
    </footer>
  );
}
