import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/patientNavbar.css";
import Logo from "./Logo";
import Avatar from "../images/Patient 1.png";
import Avatar2 from "../images/Doctor 1.png";
import { useNavigate } from "react-router-dom";

const PatientNavbar = ({
  patientName = "User",
  patientImage,
  isDoctor = false,
  onLogout = () => {},
  userData, // Pass userData for doctor details
}) => {
  // Default image based on user role
  const defaultImage = isDoctor ? Avatar2 : Avatar;
  const navigate = useNavigate();

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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
          </div>
          <div className="patient-name">{patientName}</div>
          <div className="dropdown">
            <button
              className="dropdown-toggle"
              type="button"
              id="userMenuDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-list"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="userMenuDropdown"
            >
              {isDoctor && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      navigate("/doctor-details", {
                        state: { doctorData: userData },
                      })
                    }
                  >
                    <i className="bi bi-person-vcard me-2"></i>My Details
                  </button>
                </li>
              )}
              {!isDoctor && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      navigate("/patient-details", {
                        state: { patientData: userData },
                      })
                    }
                  >
                    <i className="bi bi-person-vcard me-2"></i>My Details
                  </button>
                </li>
              )}
              <li>
                <button className="dropdown-item" onClick={onLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientNavbar;
