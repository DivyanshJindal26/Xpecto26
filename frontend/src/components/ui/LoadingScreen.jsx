import React from "react";
import xpectoLogo from "../../assets/logo.png"; 

export default function LoadingScreen() {
  return (
    <div
      className="loading-overlay"
      role="status"
      aria-live="polite"
      style={{ backgroundColor: "black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <img
        src={xpectoLogo}
        alt="Xpecto Logo"
        style={{ width: "700px", height: "auto", marginBottom: "20px" }}
      />
      <div className="loading-text" style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>Loading...</div>
    </div>
  );
}
