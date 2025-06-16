import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/patientNavbar.css";
import Logo from "./Logo";
import Avatar from "../images/Patient 1.png";
import Avatar2 from "../images/Doctor 1.png";

const PatientNavbar = ({
  patientName = "User",
  patientImage,
  isDoctor = false,
  onPatientDataUpdate = () => {},
  onLogout = () => {}
}) => {
  // Default image based on user role
  const defaultImage = isDoctor ? Avatar2 : Avatar;
  
  // For backward compatibility
  const doctorAvatar = Avatar2;
  const patientAvatar = Avatar;

  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (!searchName.trim()) {
        setError("Please enter a patient name");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://motab3aa.runasp.net/api/Account/SearchByName?Name=${encodeURIComponent(searchName)}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data);
        console.log("Search results:", data);
        onPatientDataUpdate(data); // Pass data to parent component
      } catch (err) {
        console.error("Error searching for patient:", err);
        setError(err.message || "Error searching for patient");
        setSearchResults(null);
        onPatientDataUpdate(null); // Clear patient data on error
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="patient-navbar">
      <div className="navbar-logo">
        <Logo />
      </div>
      
      {isDoctor && (
        <div className="patient-search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="patient-search-input"
              placeholder="Search patient by name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setError(null);
              }}
              onKeyDown={handleSearch}
            />
            <button 
              className="search-button" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="bi bi-hourglass-split"></i>
              ) : (
                <i className="bi bi-search"></i>
              )}
            </button>
          </div>
          {error && <div className="search-error">{error}</div>}
        </div>
      )}

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
            <button className="dropdown-toggle" type="button" id="userMenuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-list"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuDropdown">
              <li><button className="dropdown-item" onClick={onLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientNavbar;
