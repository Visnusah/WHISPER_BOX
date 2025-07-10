import React from "react";
import logo from "../assets/Logo.png";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo-area">
        {/* Logo Image */}
        <img src={logo} alt="Whisper Box Logo" className="logo-img" />
        <span className="site-name">WHISPER BOX</span>
      </div>
      <div className="header-buttons">
        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
        <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </header>
  );
}

export default Header; 