import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
