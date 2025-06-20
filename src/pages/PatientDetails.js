import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import { useUser } from "../context/UserContext";
import patientAvatar from "../images/Patient 1.png";
import doctorAvatar from "../images/Doctor 1.png";
import "./pagesStyles/PatientDetails.css";

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, isDoctor, logoutUser } = useUser();
  const patientData = location.state?.patientData;

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Get user avatar with fallback
  const getUserAvatar = () => {
    if (userData?.profileImage) {
      return userData.profileImage;
    }
    return isDoctor() ? doctorAvatar : patientAvatar;
  };

  // Format user name with proper title
  const formatUserName = () => {
    if (!userData?.fullName && !userData?.userName) {
      return "User";
    }
    const name = userData.fullName || userData.userName;
    return isDoctor() ? `Dr. ${name}` : name;
  };

  // If no patient data, redirect back to dashboard
  if (!patientData) {
    navigate("/dashboard");
    return null;
  }

  // Map applicationUserType to readable format
  const getUserType = (type) => {
    switch (type) {
      case 0:
        return "Doctor";
      case 1:
        return "Patient";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="patient-details-container">
      <PatientNavbar
        patientName={formatUserName()}
        patientImage={getUserAvatar()}
        isDoctor={isDoctor()}
        onLogout={handleLogout}
        userData={userData}
      />

      <div className="patient-details-content">
        <div className="back-button-container">
          <button
            onClick={() => navigate("/dashboard")}
            className="back-button"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="patient-details-card">
          <div className="patient-header">
            <div className="patient-avatar-large">
              <img
                src={patientData.profileImage || patientAvatar}
                alt={patientData.userName}
                className="patient-image-large"
              />
            </div>
            <div className="patient-header-info">
              <h1 className="patient-title">{patientData.userName}</h1>
              <p className="patient-subtitle">{getUserType(patientData.applicationUserType)}</p>
            </div>
          </div>

          <div className="patient-info-grid">
            <div className="info-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">{patientData.userName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{patientData.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number:</span>
                  <span className="info-value">{patientData.phoneNumber}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age:</span>
                  <span className="info-value">{patientData.age} years</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{patientData.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">User Type:</span>
                  <span className="info-value">{getUserType(patientData.applicationUserType)}</span>
                </div>
                {patientData.specializationId && (
                  <div className="info-item">
                    <span className="info-label">Specialization ID:</span>
                    <span className="info-value">{patientData.specializationId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">User ID:</span>
                  <span className="info-value">{patientData.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Status:</span>
                  <span className="info-value status-active">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn primary">
              Schedule Appointment
            </button>
            <button className="action-btn secondary">
              View Medical History
            </button>
            <button className="action-btn secondary">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;