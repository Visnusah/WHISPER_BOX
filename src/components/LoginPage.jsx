import React, { useState } from "react";
import logo from "../assets/Logo.png";
import "../App.css";
import { Link } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Here you would redirect to dashboard
    }, 2000);
  };

  if (loading) {
    return <LoadingOverlay message="Welcome back! ✨\nRedirecting to your dashboard..." />;
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Whisper Box Logo" className="login-logo" />
          <span className="login-title">WHISPER BOX</span>
        </div>
        <h2 className="login-welcome">Welcome Back <span role="img" aria-label="wave">👋</span></h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="login-input" autoComplete="username" />
          <div className="login-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input"
              autoComplete="current-password"
            />
            <span
              className="login-eye"
              onClick={() => setShowPassword((v) => !v)}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </span>
          </div>
          <button type="submit" className="login-btn-main">Sign In <span role="img" aria-label="key">🔑</span></button>
        </form>
        <div className="login-signup-link">
          <span>Don't have an account? <Link to="/signup" className="signup-link">Sign Up <span role="img" aria-label="sparkles">🎉</span></Link></span>
        </div>
        <div className="login-back-link">
          <a href="/" className="back-link">&mdash; Back to Landing Page</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 