import React from "react";
import "./componentsStyles/labCard.css";

const ConfirmDeletePopup = ({ open, title, message, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="lab-popup-overlay" onClick={onCancel}>
      <div
        className="lab-popup-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 400, alignItems: "stretch" }}
      >
        <h2
          style={{
            color: "#e74c3c",
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {title}
        </h2>
        <div
          style={{ textAlign: "center", marginBottom: 10, fontSize: "1.1rem" }}
        >
          {message}
        </div>
        <div style={{ textAlign: "center", marginBottom: 18, color: "#888" }}>
          This action cannot be undone.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            style={{
              background: "#f5f5f5",
              color: "#333",
              border: "none",
              borderRadius: 6,
              padding: "10px 28px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              minWidth: 100,
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            style={{
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 28px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              minWidth: 100,
            }}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
