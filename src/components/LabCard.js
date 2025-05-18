import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FaFlask, FaBuilding } from "react-icons/fa";
import "./componentsStyles/labCard.css";

const LabCard = ({ lab, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent propagation if the delete button was clicked
    if (e.target.closest(".delete-button")) {
      return;
    }

    // Navigate to lab report details with ID
    if (lab.id) {
      navigate(`/radiology-labs/${lab.id}`, {
        state: {
          lab: lab,
        },
      });
    } else {
      // Fallback to the old route
      navigate("/lab-report-details", {
        state: {
          lab: lab,
        },
      });
    }
  };

  return (
    <div className="lab-card" onClick={handleCardClick}>
      <div className="lab-info">
        <div className="lab-icon">
          <FaFlask />
        </div>
        <div className="lab-details">
          <div className="lab-name">{lab.name}</div>
          {lab.department && (
            <div className="lab-department">
              <FaBuilding className="department-icon" />
              <span>{lab.department}</span>
            </div>
          )}
        </div>
      </div>
      <button
        className="delete-button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when delete button is clicked
          onDelete && onDelete(lab.id);
        }}
        aria-label="Delete lab"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default LabCard;
