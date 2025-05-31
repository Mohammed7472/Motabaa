import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/patientNavbar.css";
import Logo from "./Logo";

const PatientNavbar = ({
  patientName = "Mohamed Hassaballa",
  patientImage,
}) => {
  const defaultImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

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
