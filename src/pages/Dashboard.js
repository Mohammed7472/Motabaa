import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import DashboardCard from "../components/DashboardCard";
import "../pages/pagesStyles/Dashboard.css";
import { useUser, USER_ROLES } from "../context/UserContext";
import { DoctorOnly, PatientOnly } from "../components/RoleBasedRender";

import departmentsIcon from "../images/Mask group (1).png";
import radiologyIcon from "../images/Mask group.png";
import sessionsIcon from "../images/medical 1.png";
// import allergyIcon from "../images/allergy-icon.png"; // Removed missing icon

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
    if (!userData?.fullName && !userData?.userName) {
      return "User";
    }
    const name = userData.fullName || userData.userName;
    return isDoctor() ? `Dr. ${name}` : name;
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
      console.log("Searching for:", searchQuery);
      // Use relative path to work with the proxy setup
      console.log(
        "API URL:",
        `/api/Account/SearchByName?name=${encodeURIComponent(searchQuery)}`
      );

      // Get token from localStorage if available
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // Add authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Use relative path to work with the proxy setup
      const response = await fetch(
        `/api/Account/SearchByName?name=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
          headers: headers,
          // No need for CORS mode when using relative paths with proxy
          credentials: "include", // Added to include cookies if needed for authentication
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Search results:", data);

      // Filter and process the data to only include patients
      const processData = (rawData) => {
        const dataArray = Array.isArray(rawData) ? rawData : rawData?.results || rawData?.data || [rawData];
        // Filter out doctors (users with specializationId)
        const patientsOnly = dataArray.filter(user => user.specializationId === null);
        return patientsOnly;
      };

      const filteredResults = processData(data);
      setSearchResults(filteredResults);
      console.log("Setting filtered patient results:", filteredResults.length, "items");
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
                    {/* Display both patients and doctors with different handling */}
                    {searchResults.map((user) => {
                      const isDoctor = user.specializationId !== null;
                      return (
                        <div
                          key={user.id}
                          className={`modern-patient-card ${isDoctor ? 'doctor-card' : ''}`}
                          onClick={() => {
                            if (isDoctor) {
                              // Navigate to doctor details page
                              navigate("/doctor-details", { state: { doctorData: user } });
                            } else {
                              // Navigate to patient details page
                              handlePatientClick(user);
                            }
                          }}
                        >
                          <div className="modern-patient-avatar">
                            <img
                              src={user.profileImage || (isDoctor ? doctorAvatar : patientAvatar)}
                              alt={user.userName || (isDoctor ? "Doctor" : "Patient")}
                              className="modern-patient-image"
                            />
                          </div>
                          <div className="modern-patient-info">
                            <h4 className="modern-patient-name">
                              {isDoctor ? `Dr. ${user.fullName || user.userName || "Unknown Doctor"}` : 
                                (user.fullName || user.userName || "Unknown Patient")}
                            </h4>
                            <p className="modern-patient-email">
                              {user.email || "No email provided"}
                            </p>
                            {isDoctor ? (
                              <p className="modern-patient-specialization">
                                {user.specialization || "Specialist"}
                              </p>
                            ) : (
                              <p className="modern-patient-age">
                                {user.age ? `${user.age} years old` : "Age not available"}
                              </p>
                            )}
                            <p className="patient-phone">
                              {user.phoneNumber || "No phone number"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Only show no results message after a search has been performed */}
            {searchQuery && searchResults.length === 0 && !isSearching && hasSearched && (
              <div className="no-results">
                <p>No patients found with the name "{searchQuery}"</p>
              </div>
            )}
          </div>
        </DoctorOnly>

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
