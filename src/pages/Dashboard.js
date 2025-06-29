import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PatientNavbar from "../components/PatientNavbar";
import DashboardCard from "../components/DashboardCard";
import "../pages/pagesStyles/Dashboard.css";
import { useUser, USER_ROLES } from "../context/UserContext";
import { DoctorOnly, PatientOnly } from "../components/RoleBasedRender";

import departmentsIcon from "../images/Mask group (1).png";
import radiologyIcon from "../images/Mask group.png";
import sessionsIcon from "../images/medical 1.png";
// import allergyIcon from "../images/allergy-icon.png"; // Removed missing icon
import chronicIcon from "../images/chronic.png"; // Add a suitable icon to your

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
  const { userData, userRole, error, isLoading, logoutUser, isDoctor } =
    useUser();
  const navigate = useNavigate();

  // Search state for doctors
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // Track if search has been performed

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
    if (!userData) return "User";

    const name = userData.fullName || userData.userName || "User";
    const prefix = isDoctor() && !name.startsWith("Dr.") ? "Dr. " : "";
    return `${prefix}${name}`;
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Set flag to indicate a search has been performed
    setHasSearched(true);
    setIsSearching(true);
    setSearchError("");

    try {
      const data = await api.search.searchByName(searchQuery);
      console.log("Search results:", data);

      // Process and filter the data
      const processData = (rawData) => {
        // Convert the data to an array if it's not already
        const dataArray = Array.isArray(rawData)
          ? rawData
          : rawData?.results || rawData?.data || [rawData];

        // Keep both patients and doctors, but mark them accordingly
        return dataArray.map((user) => ({
          ...user,
          isDoctor: Boolean(user.specializationId || user.specialization),
        }));
      };

      const processedResults = processData(data);
      setSearchResults(processedResults);
      console.log(
        "Setting processed results:",
        processedResults.length,
        "items"
      );
    } catch (error) {
      console.error("Error searching patients:", error);
      setSearchError(`Failed to search patients: ${error.message}`);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Do not reset hasSearched flag here to avoid showing "no results" message
    // while typing after a search has been performed
    // Only search when button is clicked or Enter is pressed
  };

  // Handle patient card click
  const handlePatientClick = (patient) => {
    // Navigate to patient details page with patient data
    navigate("/patient-details", { state: { patientData: patient } });
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
      title: "ADD MEDICAL SESSIONS",
      icon: sessionsIcon,
      link: "/sessions/add", // Directly go to add form
      className: "sessions",
    },
    {
      id: 4,
      title: "ALLERGIES",
      icon: radiologyIcon, // Use an existing icon for now
      link: "/allergies",
      className: "allergies",
    },
    {
      id: 5,
      title: "CHRONIC DISEASES",
      icon: chronicIcon,
      link: "/chronic-diseases",
      className: "chronic-diseases",
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
        {/* Doctor-specific view with patient search */}
        <DoctorOnly>
          <div className="doctor-search-container">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search patient by name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="patient-search-input"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="search-button"
              >
                {isSearching ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Searching...</span>
                  </div>
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {searchError && (
              <div className="alert alert-danger mt-3">{searchError}</div>
            )}

            {searchResults.length > 0 && (
              <div className="search-results-container">
                <div className="search-results-card">
                  <h3 className="search-results-title">Search Results</h3>
                  <div className="patient-cards-grid">
                    {/* Display only patients */}
                    {searchResults
                      .filter(
                        (user) =>
                          user.specializationId === null ||
                          user.specializationId === undefined
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className="modern-patient-card"
                          onClick={() => handlePatientClick(user)}
                        >
                          <div className="modern-patient-avatar">
                            <img
                              src={user.profileImage || patientAvatar}
                              alt={user.userName || "Patient"}
                              className="modern-patient-image"
                            />
                          </div>
                          <div className="modern-patient-info">
                            <h4 className="modern-patient-name">
                              {user.fullName ||
                                user.userName ||
                                "Unknown Patient"}
                            </h4>
                            <p className="modern-patient-email">
                              {user.email || "No email provided"}
                            </p>
                            <p className="modern-patient-age">
                              {user.age
                                ? `${user.age} years old`
                                : "Age not available"}
                            </p>
                            <p className="patient-phone">
                              {user.phoneNumber || "No phone number"}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Only show no results message after a search has been performed */}
            {searchQuery &&
              searchResults.length === 0 &&
              !isSearching &&
              hasSearched && (
                <div className="no-results">
                  <p>No patients found with the name "{searchQuery}"</p>
                </div>
              )}
          </div>
        </DoctorOnly>

        {/* Patient-specific view */}
        <PatientOnly>
          <div className="cards-container">
            {patientCards.map((card) => {
              // Add debug log for chronic diseases navigation
              if (card.title === "CHRONIC DISEASES") {
                return (
                  <DashboardCard
                    key={card.id}
                    title={card.title}
                    icon={card.icon}
                    link={card.link}
                    className={card.className}
                    onClick={() => {
                      console.log("Navigating to chronic diseases with:", {
                        id: userData?.id,
                        name: userData?.fullName || userData?.userName,
                        userData,
                      });
                      if (!userData?.id) {
                        alert(
                          "Patient ID is missing. Please log in again or contact support."
                        );
                        return;
                      }
                      navigate("/chronic-diseases", {
                        state: {
                          patientId: userData.id,
                          patientName: userData.fullName || userData.userName,
                        },
                      });
                    }}
                  />
                );
              }
              return (
                <DashboardCard
                  key={card.id}
                  title={card.title}
                  icon={card.icon}
                  link={card.link}
                  className={card.className}
                />
              );
            })}
          </div>
        </PatientOnly>
      </div>
    </div>
  );
};

export default Dashboard;
