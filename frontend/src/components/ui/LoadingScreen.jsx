import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen({ progress = 0 }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255,255,255,0.2)",
          borderTop: "4px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      {/* Text */}
      <div
        style={{
          color: "white",
          marginTop: "16px",
          fontSize: "14px",
          letterSpacing: "1px",
        }}
      >
        Loading Xpecto...
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div
          style={{
            width: "200px",
            height: "3px",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "2px",
            marginTop: "16px",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              backgroundColor: "white",
              borderRadius: "2px",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Progress Text */}
      {progress > 0 && (
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            marginTop: "8px",
            fontSize: "12px",
          }}
        >
          {Math.round(progress)}%
        </div>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
