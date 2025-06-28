import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import { useUser } from "../context/UserContext";
import patientAvatar from "../images/Patient 1.png";
import doctorAvatar from "../images/Doctor 1.png";
import "./pagesStyles/PatientDetails.css";
import "./pagesStyles/CommonStyles.css";

const DoctorDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, isDoctor, logoutUser } = useUser();
  const doctorData = location.state?.doctorData;
  const [specializations, setSpecializations] = useState([]);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Redirect to dashboard if no doctor data
  useEffect(() => {
    if (!doctorData) {
      navigate("/dashboard");
    }
  }, [doctorData, navigate]);

  useEffect(() => {
    // جلب التخصصات من الـ API
    fetch("http://motab3aa.runasp.net/api/Specialization")
      .then((res) => res.json())
      .then((data) => setSpecializations(data))
      .catch(() => setSpecializations([]));
  }, []);

  const getSpecializationName = (id) => {
    const spec = specializations.find((s) => s.id === Number(id));
    return spec ? spec.name : "-";
  };

  if (!doctorData) {
    return null;
  }

  return (
    <div className="patient-details-container">
      <PatientNavbar
        patientName={
          isDoctor()
            ? `Dr. ${userData?.fullName || userData?.userName}`
            : userData?.fullName || userData?.userName
        }
        patientImage={
          userData?.profileImage || (isDoctor() ? doctorAvatar : patientAvatar)
        }
        isDoctor={isDoctor()}
        onLogout={handleLogout}
        userData={userData}
      />

      <div className="patient-details-content">
        <div className="common-back-button-container">
          <button onClick={() => navigate(-1)} className="common-back-button">
            <span className="common-back-arrow">←</span> Back
          </button>
        </div>

        <div className="patient-details-card">
          <div className="patient-header">
            <div className="patient-avatar-large">
              <img
                src={doctorData.profileImage || doctorAvatar}
                alt={doctorData.userName || doctorData.fullName || "Doctor"}
                className="patient-image-large"
              />
            </div>
            <div className="patient-header-info">
              <h1 className="patient-title">
                Dr. {doctorData.fullName || doctorData.userName || "Unknown"}
              </h1>
              <p className="patient-subtitle">
                {doctorData.specialization || "Specialist"}
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
                    {doctorData.fullName || doctorData.userName || "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{doctorData.email || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number:</span>
                  <span className="info-value">
                    {doctorData.phoneNumber || "-"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">
                    {doctorData.applicationUserType === 0
                      ? "Male"
                      : doctorData.applicationUserType === 1
                      ? "Female"
                      : "Not specified"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">
                    {doctorData.address || "-"}
                  </span>
                </div>
                {doctorData.specialization && (
                  <div className="info-item">
                    <span className="info-label">Specialization:</span>
                    <span className="info-value">
                      {doctorData.specialization}
                    </span>
                  </div>
                )}
                {doctorData.specializationId && (
                  <div className="info-item">
                    <span className="info-label">Specialization:</span>
                    <span className="info-value">
                      {getSpecializationName(doctorData.specializationId)}
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
                  <span className="info-value">{doctorData.id || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Status:</span>
                  <span className="info-value status-active">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
