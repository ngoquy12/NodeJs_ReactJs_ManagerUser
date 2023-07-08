import React from "react";
import "./loading.css";

export default function Loading() {
  return (
    <>
      <div className="loading-container">
        <div className="loading-overlay"></div>
        <div className="loading-spinner"></div>
      </div>
    </>
  );
}
