import React from "react";
import { Link } from "react-router-dom";
import "../components/componentsStyles/dashboardCard.css";

const DashboardCard = ({ title, icon, link, className, onClick }) => {
  return (
    <Link to={link} className={`dashboard-card ${className}`} onClick={onClick}>
      <div className="card-content">
        <div className="icon-container">
          <img src={icon} alt={title} className="card-icon" />
        </div>
        <h2 className="card-title">{title}</h2>
      </div>
    </Link>
  );
};

export default DashboardCard;
