import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Error404() {
  const navigate = useNavigate();
  return (
    <div className="error404-bg">
      <div className="error404-card">
        <div className="error404-big">404</div>
        <div className="error404-msg">Page Not Found <span role="img" aria-label="sad">😢</span></div>
        <button className="error404-btn" onClick={() => navigate("/")}>Go to Home</button>
      </div>
    </div>
  );
}

export default Error404; 