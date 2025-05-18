import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import "./pagesStyles/PrescriptionConfirmation.css";

const PrescriptionConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionData = location.state || {};

  const getPrescriptionImageUrl = () => {
    if (sessionData.prescriptionImage) {
      return URL.createObjectURL(sessionData.prescriptionImage);
    }
    return null;
  };

  const getDepartmentSpecialty = () => {
    return sessionData.department || "Department";
  };

  const formatDoctorName = () => {
    const name = sessionData.doctorName || "Mohamed Khaled";
    if (name.startsWith("Dr.") || name.startsWith("dr.")) {
      return name;
    } else {
      return `Dr. ${name}`;
    }
  };

  const handleBackClick = () => {
    navigate("/sessions");
  };

  return (
    <div className="prescription-confirmation-container">
      <div className="prescription-confirmation-card">
        <div className="doctor-info">
          <div className="doctor-name">{formatDoctorName()}</div>
          <div className="doctor-specialty">{getDepartmentSpecialty()}</div>
        </div>

        <div className="prescription-image-container">
          {getPrescriptionImageUrl() ? (
            <img
              src={getPrescriptionImageUrl()}
              alt="Prescription"
              className="prescription-image"
            />
          ) : (
            <div className="no-prescription">
              No prescription image available
            </div>
          )}
        </div>

        <button className="back-button" onClick={handleBackClick}>
          <BsFillArrowLeftCircleFill className="back-icon" />
        </button>
      </div>
    </div>
  );
};

export default PrescriptionConfirmation;
