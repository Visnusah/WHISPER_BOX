import React from "react";
import "../App.css";

function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <div className="loading-message">{message}</div>
    </div>
  );
}

export default LoadingOverlay; 