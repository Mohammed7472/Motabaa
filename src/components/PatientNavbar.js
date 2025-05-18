import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/patientNavbar.css";
import Logo from "./Logo";

const PatientNavbar = ({
  patientName = "Mohamed Hassaballa",
  patientImage,
}) => {
  // Default image if none provided
  const defaultImage = "https://via.placeholder.com/50";

  return (
    <div className="patient-navbar">
      <div className="navbar-logo">
        <Logo />
      </div>
      <div className="patient-info-container">
        <div className="patient-info">
          <div className="patient-avatar">
            <img
              src={patientImage || defaultImage}
              alt={patientName}
              className="avatar-img"
            />
          </div>
          <div className="patient-name">{patientName}</div>
          <button className="dropdown-toggle">
            <i className="bi bi-list"></i>
          </button>
        </div>
      </div>
      <div className="navbar-spacer"></div>
    </div>
  );
};

export default PatientNavbar;
