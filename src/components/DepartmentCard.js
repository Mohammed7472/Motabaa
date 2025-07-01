import React from "react";
import { Link } from "react-router-dom";
import "./componentsStyles/departmentCard.css";

// أضف دعم onClick
const DepartmentCard = ({
  title,
  icon,
  link,
  description,
  className,
  onClick,
}) => {
  return (
    <div
      className={`department-card ${className || ""}`}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="department-card-content">
        <div className="department-icon-container">
          <img src={icon} alt={title} className="department-icon" />
        </div>
        <h3 className="department-title">{title}</h3>
        {description && <p className="department-description">{description}</p>}
      </div>
    </div>
  );
};

export default DepartmentCard;
