import React from "react";
import { FaTrash } from "react-icons/fa";
import "./componentsStyles/sessionCard.css";

const SessionCard = ({ doctor, onDelete }) => {
  return (
    <div className="session-card">
      <div className="doctor-info">
        <div className="doctor-icon">
          <i className="bi bi-person"></i>
        </div>
        <div className="doctor-name">{doctor.name}</div>
      </div>
      <button
        className="delete-button"
        onClick={() => onDelete && onDelete(doctor.id)}
        aria-label="Delete session"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default SessionCard;
