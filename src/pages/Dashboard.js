import React from "react";
import { useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import DashboardCard from "../components/DashboardCard";
import "../pages/pagesStyles/Dashboard.css";
import { useUser, USER_ROLES } from "../context/UserContext";
import { DoctorOnly, PatientOnly } from "../components/RoleBasedRender";

import departmentsIcon from "../images/Mask group (1).png";
import radiologyIcon from "../images/Mask group.png";
import sessionsIcon from "../images/medical 1.png";

import patientAvatar from "../images/Patient 1.png";
import doctorAvatar from "../images/Doctor 1.png";
import ShadowShape from "../components/ShadowShape";

const PatientProfile = ({ patientData }) => {
  if (!patientData) return null;

  return (
    <div className="patient-profile-container">
      <div className="patient-profile-card">
        <h2 className="profile-title">Patient Profile</h2>

        <div className="profile-info">
          <div className="profile-item">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{patientData.fullName}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Age:</span>
            <span className="profile-value">{patientData.age}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Gender:</span>
            <span className="profile-value">{patientData.gender}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Phone:</span>
            <span className="profile-value">{patientData.phoneNumber}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Address:</span>
            <span className="profile-value">{patientData.address}</span>
          </div>

          {patientData.diagnosis && (
            <div className="profile-item">
              <span className="profile-label">Diagnosis:</span>
              <span className="profile-value">{patientData.diagnosis}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { userData, userRole, error, isLoading, logoutUser, isDoctor } = useUser();
  const navigate = useNavigate();

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
    // Use role-specific default avatar
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

  // Doctor-specific cards definition
  const doctorCards = []; // Removed "My Department" card as requested

  // Patient-specific cards definition
  const patientCards = [
    {
      id: 1,
      title: "DEPARTMENTS",
      icon: departmentsIcon,
      link: "/departments",
      className: "departments",
    },
    {
      id: 2,
      title: "RADIOLOGY AND LABORATORY TESTS",
      icon: radiologyIcon,
      link: "/radiology-labs",
      className: "radiology",
    },
    {
      id: 3,
      title: "MEDICAL SESSIONS",
      icon: sessionsIcon,
      link: "/sessions",
      className: "sessions",
    },
  ];

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">
          {error}
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary mt-3"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <PatientNavbar
        patientName={formatUserName()}
        patientImage={getUserAvatar()}
        isDoctor={isDoctor()}
        onLogout={handleLogout}
        userData={userData}
      />

      <div className="dashboard-content">
        {/* Doctor view no longer shows any cards */}
        
        {/* Patient-specific view */}
        <PatientOnly>
          <div className="cards-container">
            {patientCards.map((card) => (
              <DashboardCard
                key={card.id}
                title={card.title}
                icon={card.icon}
                link={card.link}
                className={card.className}
              />
            ))}
          </div>
        </PatientOnly>
      </div>
    </div>
  );
};

export default Dashboard;
