import React, { useState, useEffect } from "react";
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
  const [patientData, setPatientData] = useState(null);
  const [userData, setUserData] = useState(null);
  const registrationDataProcessed = React.useRef(false);
  
  // Check if user is a doctor from localStorage
  const isDoctor = localStorage.getItem("userRole") === "Doctor";

  // Get user data from localStorage on component mount or when localStorage changes
  useEffect(() => {
    // Function to load user data from localStorage
    const loadUserData = () => {
      // Debug: Log all localStorage keys
      console.log("All localStorage keys:", Object.keys(localStorage));
      
      const storedUserData = localStorage.getItem("userData");
      console.log("Raw userData from localStorage:", storedUserData);
      
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          console.log("Parsed userData:", parsedUserData);
          setUserData(parsedUserData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    // Load user data immediately
    loadUserData();

    // Set up a storage event listener to detect changes to localStorage
    window.addEventListener('storage', loadUserData);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('storage', loadUserData);
    };
  }, []);

  // Check for registration data in session storage
  useEffect(() => {
    // Only process registration data once to avoid infinite loops
    if (registrationDataProcessed.current) return;
    
    const registrationData = sessionStorage.getItem("registerFormData");
    console.log("Raw registerFormData from sessionStorage:", registrationData);
    
    if (registrationData) {
      try {
        const parsedRegData = JSON.parse(registrationData);
        console.log("Parsed registerFormData:", parsedRegData);
        
        // Create a new user data object with combined data
        const updatedUserData = { ...userData };
        let needsUpdate = false;
        
        // If userData doesn't have fullName but registration data does, use it
        if (parsedRegData.fullName && (!updatedUserData.fullName || updatedUserData.fullName === "")) {
          updatedUserData.fullName = parsedRegData.fullName;
          needsUpdate = true;
          console.log("Using fullName from registration data:", parsedRegData.fullName);
        }
        
        // If userData doesn't have profileImage but registration data does, use it
        if (parsedRegData.profileImage && (!updatedUserData.profileImage || updatedUserData.profileImage === "")) {
          updatedUserData.profileImage = parsedRegData.profileImage;
          needsUpdate = true;
          console.log("Using profileImage from registration data");
        }
        
        // Only update if we made changes
        if (needsUpdate) {
          setUserData(updatedUserData);
        }
        
        // Mark as processed
        registrationDataProcessed.current = true;
      } catch (error) {
        console.error("Error parsing registration data:", error);
      }
    }
  }, [userData]);

  // Format user name with Dr. prefix if user is a doctor
  const formatUserName = () => {
    if (!userData?.fullName) return "User";
    return isDoctor ? `Dr. ${userData.fullName}` : userData.fullName;
  };
  
  // Handle user logout
  const handleLogout = () => {
    // Clear all localStorage and sessionStorage data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = "/login";
  };

  // Get appropriate avatar based on user role or uploaded profile image
  const getUserAvatar = () => {
    if (userData?.profileImage) return userData.profileImage;
    return isDoctor ? doctorAvatar : patientAvatar;
  };

  const cards = [
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

  // Callback function to receive patient data from the navbar
  const handlePatientDataUpdate = (data) => {
    setPatientData(data);
  };

  return (
    <div className="dashboard-container">
      <PatientNavbar 
        patientName={formatUserName()} 
        patientImage={getUserAvatar()} 
        isDoctor={isDoctor}
        onPatientDataUpdate={handlePatientDataUpdate}
        onLogout={handleLogout}
      />
      
      <div className="dashboard-content">
        {patientData ? (
          <PatientProfile patientData={patientData} />
        ) : (
          <div className="cards-container">
            {cards.map((card) => (
              <DashboardCard
                key={card.id}
                title={card.title}
                icon={card.icon}
                link={card.link}
                className={card.className}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
