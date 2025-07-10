import React from "react";
import logo from "../assets/Logo.png";
import "../App.css";

function MainSection() {
  return (
    <main className="main-section">
      <div className="center-content">
        <img src={logo} alt="Whisper Box Logo" className="main-logo-img" />
        <h1 className="main-title">Whisper<br/>Box</h1>
        <p className="main-tagline">Share your Thoughts ✨</p>
      </div>
      <div className="community-card">
        <h2>Join the Community</h2>
        <ul>
          <li>📄 Share your thoughts and stories</li>
          <li>💬 Join meaningful discussions</li>
          <li>🏷️ Discover content with tags</li>
          <li>👥 Connect with like-minded people</li>
        </ul>
      </div>
    </main>
  );
}

export default MainSection; 