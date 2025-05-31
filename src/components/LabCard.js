import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FaFlask, FaBuilding } from "react-icons/fa";
import "./componentsStyles/labCard.css";

const LabCard = ({ lab, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    
    if (e.target.closest(".delete-button")) {
      return;
    }

    
    if (lab.id) {
      navigate(`/radiology-labs/${lab.id}`, {
        state: {
          lab: lab,
        },
      });
    } else {
      
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
          e.stopPropagation(); 
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
