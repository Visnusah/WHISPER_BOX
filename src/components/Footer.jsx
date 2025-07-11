import React from "react";
import "../App.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="disclaimer-title">⚠️ Disclaimer</span>
        <span className="disclaimer-text">Share your thoughts, but let's keep it positive and constructive! <span className="disclaimer-highlight">🌟</span></span>
      </div>
      <div className="footer-right">
        Are you an admin? <span role="img" aria-label="lock">🔒</span>
      </div>
    </footer>
  );
}

export default Footer; 