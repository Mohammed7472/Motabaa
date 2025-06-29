import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import { useUser } from "../context/UserContext";
import patientAvatar from "../images/Patient 1.png";
import doctorAvatar from "../images/Doctor 1.png";
import "./pagesStyles/PatientDetails.css";
import "./pagesStyles/MedicalHistory.css";
import "./pagesStyles/CommonStyles.css";
import api from "../services/api";

const MedicalHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, isDoctor, logoutUser } = useUser();
  const { patientId, patientName } = location.state || {};

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Redirect to dashboard if no patient data
  useEffect(() => {
    if (!patientId) {
      navigate("/dashboard");
    }
  }, [patientId, navigate]);

  // Fetch prescriptions based on doctor's specialization
  useEffect(() => {
    if (!patientId || !userData || !userData.specializationId) return;
    setLoading(true);
    setError("");
    api.prescriptions
      .getByPatientAndSpecialization(patientId, userData.specializationId)
      .then((data) => {
        // Process the data to ensure each prescription has an ID
        const processedData = Array.isArray(data)
          ? data.map((prescription, index) => {
              if (!prescription.id) {
                return { ...prescription, id: `temp_${index}` };
              }
              return prescription;
            })
          : [];
        setPrescriptions(processedData);
      })
      .catch((err) => {
        setError(
          `Error fetching prescriptions: ${err.message}. Please try again.`
        );
      })
      .finally(() => setLoading(false));
  }, [patientId, userData]); // Changed dependency to track the entire userData object

  // Filter prescriptions based on search term and date filter
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    // Filter by search term
    if (
      searchTerm &&
      !(
        prescription.content &&
        prescription.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    // Filter by date
    if (dateFilter && prescription.date) {
      const prescriptionDate = new Date(prescription.date)
        .toISOString()
        .split("T")[0];
      if (prescriptionDate !== dateFilter) return false;
    }

    return true;
  });

  // Open prescription modal
  const openPrescriptionModal = (prescription) => {
    console.log("Opening prescription modal:", prescription);
    // Create a copy of the prescription with additional image URLs to try
    const prescriptionWithImageUrls = {
      ...prescription,
      imageUrls: [
        `https://motab3aa.runasp.net/Images/rosheta/${prescription.roshetaImg}`,
        `https://motab3aa.runasp.net/Images/${prescription.roshetaImg}`,
        `https://motab3aa.runasp.net/images/rosheta/${prescription.roshetaImg}`,
        `https://motab3aa.runasp.net/images/${prescription.roshetaImg}`,
      ],
    };
    setSelectedPrescription(prescriptionWithImageUrls);
    setShowPrescriptionModal(true);
  };

  // Close prescription modal
  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedPrescription(null);
  };

  if (!patientId) {
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

        <div className="patient-details-card medical-history-card">
          <h2 className="patient-title medical-history-title">
            Medical History for {patientName}
          </h2>

          {/* Filters and Search */}
          <div className="medical-history-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="date-filter"
              />
              {(searchTerm || dateFilter) && (
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setDateFilter("");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading prescriptions...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button
                className="retry-btn"
                onClick={() => {
                  setLoading(true);
                  setError("");
                  // Retry fetching prescriptions
                  const retryFetch = async () => {
                    try {
                      // Ensure we have the latest token from sessionStorage
                      const token = sessionStorage.getItem("authToken");
                      if (!token) {
                        throw new Error("Authentication token not found");
                      }

                      // Log the request parameters for debugging
                      console.log("Retrying fetch with params:", {
                        specializationId: userData.specializationId,
                        patientId: patientId,
                      });

                      const response = await fetch(
                        `https://motab3aa.runasp.net/api/Roshta?Departmentid=${userData.specializationId}&Patientid=${patientId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      // Log the response status for debugging
                      console.log("API Response status:", response.status);

                      if (!response.ok) {
                        const errorText = await response.text();
                        console.error("API Error response:", errorText);
                        throw new Error(
                          `HTTP error! Status: ${response.status}. Details: ${errorText}`
                        );
                      }

                      const data = await response.json();
                      console.log("Prescriptions data:", data);

                      // Process the data to ensure each prescription has an ID
                      const processedData = Array.isArray(data)
                        ? data.map((prescription, index) => {
                            if (!prescription.id) {
                              return { ...prescription, id: `temp_${index}` };
                            }
                            return prescription;
                          })
                        : [];

                      setPrescriptions(processedData);
                    } catch (err) {
                      console.error("Error retrying fetch:", err);
                      setError(
                        `Error fetching prescriptions: ${err.message}. Please try again.`
                      );
                    } finally {
                      setLoading(false);
                    }
                  };

                  retryFetch();
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Prescriptions List */}
          {!loading && !error && (
            <div className="prescriptions-container">
              {filteredPrescriptions.length === 0 ? (
                <div className="no-results">
                  <p>
                    No prescriptions found for this patient under your
                    specialization.
                  </p>
                </div>
              ) : (
                <div className="prescriptions-grid">
                  {filteredPrescriptions.map((prescription, index) => (
                    <div
                      key={prescription.id || index}
                      className="prescription-card"
                      onClick={() => openPrescriptionModal(prescription)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      <div
                        className="prescription-header"
                        style={{
                          padding: "15px",
                          borderBottom: "1px solid #eaeaea",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        <h3
                          className="prescription-title"
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "#2e99dc",
                            margin: 0,
                          }}
                        >
                          {prescription.specialization || "Prescription"}
                        </h3>
                        <span
                          className="prescription-date"
                          style={{
                            backgroundColor: "#e8f4ff",
                            color: "#0066cc",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                          }}
                        >
                          {prescription.date
                            ? new Date(prescription.date).toLocaleDateString()
                            : "No date"}
                        </span>
                      </div>
                      <div
                        className="prescription-content"
                        style={{
                          padding: "15px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          flex: 1,
                        }}
                      >
                        {prescription.roshetaImg && (
                          <div
                            className="prescription-image-container"
                            style={{ margin: "12px 0" }}
                          >
                            <div
                              className="prescription-image-thumbnail"
                              style={{
                                cursor: "pointer",
                                position: "relative",
                                borderRadius: "8px",
                                overflow: "hidden",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <img
                                src={`https://motab3aa.runasp.net/Images/rosheta/${prescription.roshetaImg}`}
                                alt={
                                  prescription.specialization
                                    ? `${prescription.specialization} Prescription`
                                    : "Medical Prescription"
                                }
                                className="prescription-image"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "200px",
                                  objectFit: "contain",
                                  width: "100%",
                                  height: "auto",
                                  display: "block",
                                  backgroundColor: "#f8f8f8",
                                }}
                                onError={(e) => {
                                  console.log(
                                    `Image failed to load:`,
                                    prescription.roshetaImg
                                  );
                                  // Try alternative URL formats if the first one fails
                                  e.target.src = `https://motab3aa.runasp.net/Images/${prescription.roshetaImg}`;

                                  // If that fails, try another path
                                  e.target.onerror = () => {
                                    e.target.src = `https://motab3aa.runasp.net/images/rosheta/${prescription.roshetaImg}`;

                                    // If that fails, try one more path
                                    e.target.onerror = () => {
                                      e.target.src = `https://motab3aa.runasp.net/images/${prescription.roshetaImg}`;

                                      // If all attempts fail, show a placeholder
                                      e.target.onerror = () => {
                                        e.target.src =
                                          "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f93519d%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f93519d%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23f0f0f0%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.5%22%20y%3D%2296.3%22%3EImage%20Not%20Available%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                                        e.target.alt = "Image not available";
                                      };
                                    };
                                  };
                                }}
                              />
                              <div
                                className="view-full-overlay"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: 0,
                                  transition: "opacity 0.3s",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.opacity = 1)
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.opacity = 0)
                                }
                              >
                                <span
                                  style={{
                                    color: "white",
                                    fontWeight: "600",
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  View Prescription
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {prescription.specialization && (
                          <p className="prescription-specialization">
                            <strong>Specialization:</strong>
                            <span
                              style={{
                                backgroundColor: "#f0f7ff",
                                color: "#2e99dc",
                                padding: "4px 10px",
                                borderRadius: "4px",
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                marginLeft: "5px",
                                display: "inline-block",
                              }}
                            >
                              {prescription.specialization}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPrescription && (
        <div
          className="prescription-modal-overlay"
          onClick={closePrescriptionModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="prescription-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              width: "auto",
              overflow: "auto",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <button
              className="close-modal-btn"
              onClick={closePrescriptionModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#333",
                zIndex: 10,
              }}
            >
              &times;
            </button>
            <h3
              className="modal-prescription-title"
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#2e99dc",
                margin: "0 0 15px 0",
                paddingRight: "30px",
              }}
            >
              {selectedPrescription.specialization
                ? `${selectedPrescription.specialization} Prescription`
                : "Medical Prescription"}
            </h3>
            {selectedPrescription.roshetaImg && (
              <div
                className="modal-prescription-image-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "10px 0 20px 0",
                  maxHeight: "60vh",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`https://motab3aa.runasp.net/Images/rosheta/${selectedPrescription.roshetaImg}`}
                  alt={
                    selectedPrescription.specialization
                      ? `${selectedPrescription.specialization} Prescription`
                      : "Medical Prescription"
                  }
                  className="modal-prescription-image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "60vh",
                    objectFit: "contain",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f0f0f0",
                  }}
                  onError={(e) => {
                    console.log(
                      "Modal image failed to load:",
                      selectedPrescription.roshetaImg
                    );
                    e.target.src = `https://motab3aa.runasp.net/Images/${selectedPrescription.roshetaImg}`;
                    e.target.onerror = () => {
                      e.target.src = `http://motab3aa.runasp.net/images/rosheta/${selectedPrescription.roshetaImg}`;
                      e.target.onerror = () => {
                        e.target.src = `http://motab3aa.runasp.net/images/${selectedPrescription.roshetaImg}`;
                        e.target.onerror = () => {
                          e.target.src =
                            "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f93519d%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f93519d%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23f0f0f0%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.5%22%20y%3D%2296.3%22%3EImage%20Not%20Available%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                          e.target.alt = "Image not available";
                        };
                      };
                    };
                  }}
                />
              </div>
            )}
            <div
              className="modal-prescription-details"
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "6px",
                marginTop: "10px",
              }}
            >
              <p>
                <strong>Date:</strong>{" "}
                {selectedPrescription.date
                  ? new Date(selectedPrescription.date).toLocaleDateString()
                  : "No date"}
              </p>
              {selectedPrescription.patientName && (
                <p>
                  <strong>Patient:</strong> {selectedPrescription.patientName}
                </p>
              )}
              {selectedPrescription.specialization && (
                <p>
                  <strong>Specialization:</strong>{" "}
                  <span
                    style={{
                      backgroundColor: "#f0f7ff",
                      color: "#2e99dc",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      marginLeft: "5px",
                    }}
                  >
                    {selectedPrescription.specialization}
                  </span>
                </p>
              )}
              {selectedPrescription.content && (
                <p>
                  <strong>Content:</strong> {selectedPrescription.content}
                </p>
              )}
              {selectedPrescription.doctorName && (
                <p>
                  <strong>Doctor:</strong> {selectedPrescription.doctorName}
                </p>
              )}
              {selectedPrescription.notes && (
                <p>
                  <strong>Notes:</strong> {selectedPrescription.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
