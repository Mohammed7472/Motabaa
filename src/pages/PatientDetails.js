import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import { useUser } from "../context/UserContext";
import patientAvatar from "../images/Patient 1.png";
import doctorAvatar from "../images/Doctor 1.png";
import "./pagesStyles/PatientDetails.css";
import "./pagesStyles/CommonStyles.css";

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

  // Redirect to dashboard if no patient data
  useEffect(() => {
    if (!patientData) {
      navigate("/dashboard");
    }
  }, [patientData, navigate]);

  if (!patientData) {
    return null;
  }

  // تحديد هل المريض يعرض تفاصيل نفسه (وليس عن طريق دكتور)
  const isPatientViewingSelf = !isDoctor() && userData?.id === patientData?.id;

  return (
    <div className="patient-details-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <PatientNavbar
          patientName={
            isDoctor()
              ? `Dr. ${userData?.fullName || userData?.userName}`
              : userData?.fullName || userData?.userName
          }
          patientImage={
            userData?.profileImage ||
            (isDoctor() ? doctorAvatar : patientAvatar)
          }
          isDoctor={isDoctor()}
          onLogout={handleLogout}
          userData={userData}
        />
      </div>

      <div className="patient-details-content">
        <div className="common-back-button-container">
          <button
            onClick={() => navigate("/dashboard")}
            className="common-back-button"
          >
            <span className="common-back-arrow">←</span> Back to Dashboard
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
                {patientData.applicationUserType === 0
                  ? "Male"
                  : patientData.applicationUserType === 1
                  ? "Female"
                  : "Not specified"}
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
                    {patientData.applicationUserType === 0
                      ? "Male"
                      : patientData.applicationUserType === 1
                      ? "Female"
                      : "Not specified"}
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

          {/* تظهر الأزرار فقط للطبيب أو إذا كان المستخدم ليس المريض نفسه */}
          {isDoctor() || !isPatientViewingSelf ? (
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={() =>
                  navigate("/medical-history", {
                    state: {
                      patientId: patientData.id,
                      patientName: patientData.fullName || patientData.userName,
                    },
                  })
                }
              >
                View Medical History
              </button>
              <button
                className="action-btn secondary"
                onClick={() =>
                  navigate("/chronic-diseases", {
                    state: {
                      patientId: patientData.id,
                      patientName: patientData.fullName || patientData.userName,
                    },
                  })
                }
              >
                Chronic Diseases
              </button>
              <button
                className="action-btn secondary"
                onClick={() =>
                  navigate("/medical-tests", {
                    state: {
                      patientId: patientData.id,
                      patientName: patientData.fullName || patientData.userName,
                      patientData: patientData,
                    },
                  })
                }
              >
                Radiology and Laboratory Tests
              </button>
              <button
                className="action-btn secondary"
                onClick={() =>
                  navigate("/patient-allergies", {
                    state: {
                      patientId: patientData.id,
                      patientName: patientData.fullName || patientData.userName,
                    },
                  })
                }
              >
                Allergies
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
