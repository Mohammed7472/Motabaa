import React from "react";
import { Link } from "react-router-dom";
import "./componentsStyles/departmentCard.css";

const DepartmentCard = ({ title, icon, link, description, className }) => {
  return (
    <Link to={link} className={`department-card ${className || ""}`}>
      <div className="department-card-content">
        <div className="department-icon-container">
          <img src={icon} alt={title} className="department-icon" />
        </div>
        <h3 className="department-title">{title}</h3>
        {description && <p className="department-description">{description}</p>}
      </div>
    </Link>
  );
};

export default DepartmentCard;
