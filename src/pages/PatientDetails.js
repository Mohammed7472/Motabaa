import React, { useEffect, useState } from "react";
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

  // Allergy modal state
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [allergyForm, setAllergyForm] = useState({
    allergyId: "",
    allergyName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Redirect to dashboard if no patient data
  useEffect(() => {
    if (!patientData) {
      navigate("/dashboard");
    }
  }, [patientData, navigate]);

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

  // Map applicationUserType to gender
  const getGender = (type) => {
    switch (type) {
      case 0:
        return "Male";
      case 1:
        return "Female";
      default:
        return "Not specified";
    }
  };

  // Allergy form handlers
  const handleAllergyInputChange = (e) => {
    const { name, value } = e.target;
    setAllergyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const response = await fetch("http://motab3aa.runasp.net/api/Allergens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Number(allergyForm.allergyId), // ensure this is a number
          name: allergyForm.allergyName,
          patientId: patientData.id,
          patientName: patientData.fullName || patientData.userName,
        }),
      });
      if (!response.ok) throw new Error("Failed to add allergy");
      setSubmitSuccess("Allergy added successfully!");
      setAllergyForm({ allergyId: "", allergyName: "" });
    } catch (err) {
      setSubmitError("Error adding allergy.");
    }
    setIsSubmitting(false);
  };

  // If no patient data, redirect back to dashboard
  if (!patientData) {
    return null; // Or a loading/redirecting message
  }

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
                alt={patientData.userName || patientData.fullName || "Patient"}
                className="patient-image-large"
              />
            </div>
            <div className="patient-header-info">
              <h1 className="patient-title">
                {patientData.fullName || patientData.userName || "Unknown"}
              </h1>
              <p className="patient-subtitle">
                {getGender(patientData.applicationUserType)}
              </p>
            </div>
          </div>

          <div className="patient-info-grid">
            <div className="info-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">
                    {patientData.fullName || patientData.userName || "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{patientData.email || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number:</span>
                  <span className="info-value">
                    {patientData.phoneNumber || "-"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age:</span>
                  <span className="info-value">
                    {patientData.age ? `${patientData.age} years` : "-"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">
                    {patientData.address || "-"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">
                    {getGender(patientData.applicationUserType)}
                  </span>
                </div>
                {patientData.specializationId && (
                  <div className="info-item">
                    <span className="info-label">Specialization ID:</span>
                    <span className="info-value">
                      {patientData.specializationId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">User ID:</span>
                  <span className="info-value">{patientData.id || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Status:</span>
                  <span className="info-value status-active">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn primary">View Medical History</button>
            <button className="action-btn secondary">Chronic Diseases</button>
            <button className="action-btn secondary">
              Radiology and Laboratory Tests
            </button>
            <button
              className="action-btn secondary"
              onClick={() => setShowAllergyModal(true)}
            >
              Add Allergies
            </button>
          </div>
        </div>
      </div>

      {/* Allergy Modal */}
      {showAllergyModal && (
        <div className="allergy-modal-overlay">
          <div className="allergy-modal">
            <h2>Add Allergy</h2>
            <form onSubmit={handleAllergySubmit}>
              <div className="modal-form-group">
                <label>Allergy ID:</label>
                <input
                  type="text"
                  name="allergyId"
                  value={allergyForm.allergyId}
                  onChange={handleAllergyInputChange}
                  required
                />
              </div>
              <div className="modal-form-group">
                <label>Allergy Name:</label>
                <input
                  type="text"
                  name="allergyName"
                  value={allergyForm.allergyName}
                  onChange={handleAllergyInputChange}
                  required
                />
              </div>
              {submitError && <div className="modal-error">{submitError}</div>}
              {submitSuccess && (
                <div className="modal-success">{submitSuccess}</div>
              )}
              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="action-btn primary"
                >
                  {isSubmitting ? "Adding..." : "Add Allergy"}
                </button>
                <button
                  type="button"
                  className="action-btn secondary"
                  onClick={() => {
                    setShowAllergyModal(false);
                    setSubmitError("");
                    setSubmitSuccess("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
