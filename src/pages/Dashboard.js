import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import DashboardCard from "../components/DashboardCard";
import "../pages/pagesStyles/Dashboard.css";

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
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to safely parse JSON
  const safeJsonParse = (str) => {
    try {
      return str ? JSON.parse(str) : null;
    } catch (e) {
      console.error("JSON parse error:", e);
      return null;
    }
  };

  // Function to validate user data
  const validateUserData = (data) => {
    if (!data) return false;
    const requiredFields = ["id", "userName", "email"];
    return requiredFields.every((field) => data[field]);
  };

  useEffect(() => {
    // Function to load and validate user data
    const loadUserData = () => {
      try {
        // Get auth token
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Please log in to access the dashboard");
        }

        // Get and validate user role
        const storedRole = localStorage.getItem("userRole");
        if (!storedRole || !["Doctor", "Patient"].includes(storedRole)) {
          throw new Error("Invalid user role");
        }

        // Get and parse user data
        const parsedUserData = safeJsonParse(localStorage.getItem("userData"));
        if (!validateUserData(parsedUserData)) {
          throw new Error("Invalid user data format");
        }

        console.log("Loading user data:", {
          role: storedRole,
          userData: parsedUserData,
        });

        // Update state with validated data
        setUserRole(storedRole);
        setUserData(parsedUserData);
        setError(null);
      } catch (err) {
        console.error("Dashboard data loading error:", err);
        setError(err.message);

        // Clear invalid data
        localStorage.clear();
        sessionStorage.clear();

        // Redirect after a short delay
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    // Initial load
    loadUserData();

    // Set up storage event listener
    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // Get user avatar with fallback
  const getUserAvatar = () => {
    if (userData?.profileImage) {
      return userData.profileImage;
    }
    // Use role-specific default avatar
    return userRole === "Doctor" ? doctorAvatar : patientAvatar;
  };

  // Format user name with proper title
  const formatUserName = () => {
    if (!userData?.fullName && !userData?.userName) {
      return "User";
    }
    const name = userData.fullName || userData.userName;
    return userRole === "Doctor" ? `Dr. ${name}` : name;
  };

  // Determine what cards to show based on user role
  const getCards = () => {
    if (userRole === "Doctor") {
      return [
        {
          id: 1,
          title: userData?.specialty || "My Department",
          icon: departmentsIcon,
          link: `/departments/${(userData?.specialty || "general")
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          className: "departments",
        },
      ];
    }

    return [
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
  };

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

  return (
    <div className="dashboard-container">
      <PatientNavbar
        patientName={formatUserName()}
        patientImage={getUserAvatar()}
        isDoctor={userRole === "Doctor"}
        onLogout={handleLogout}
        userData={userData}
      />

      <div className="dashboard-content">
        <div
          className={
            userRole === "Doctor" ? "single-department-card" : "cards-container"
          }
        >
          {getCards().map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              icon={card.icon}
              link={card.link}
              className={card.className}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
