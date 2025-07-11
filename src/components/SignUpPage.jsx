import React, { useState } from "react";
import logo from "../assets/Logo.png";
import "../App.css";
import { Link } from "react-router-dom";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Whisper Box Logo" className="login-logo" />
          <span className="login-title">WHISPER BOX</span>
        </div>
        <h2 className="login-welcome">Create Your Account <span role="img" aria-label="sparkles">✨</span></h2>
        <form className="login-form">
          <input type="text" placeholder="Username" className="login-input" autoComplete="username" />
          <input type="text" placeholder="Full Name" className="login-input" autoComplete="name" />
          <input type="email" placeholder="Email" className="login-input" autoComplete="email" />
          <div className="login-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input"
              autoComplete="new-password"
            />
            <span
              className="login-eye"
              onClick={() => setShowPassword((v) => !v)}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </span>
          </div>
          <button type="submit" className="login-btn-main">Create Account <span role="img" aria-label="rocket">🚀</span></button>
        </form>
        <div className="login-signup-link">
          <span>Already have an account? <Link to="/login" className="signup-link">Sign In <span role="img" aria-label="point">👈</span></Link></span>
        </div>
        <div className="login-back-link">
          <a href="/" className="back-link">&mdash; Back to Landing Page</a>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage; 