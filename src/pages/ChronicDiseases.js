import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages/pagesStyles/PatientDetails.css";
import "../pages/pagesStyles/CommonStyles.css";
import { useUser } from "../context/UserContext";
import api from "../services/api";

const ChronicDiseases = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDoctor, isAuthenticated, userData } = useUser();
  // Try to get patientId/patientName from navigation state, fallback to logged-in user if missing
  let patientId = location.state?.patientId;
  let patientName = location.state?.patientName;
  if (!patientId && userData && userData.id) {
    patientId = userData.id;
  }
  // Always get the name from state, fallback to userData if not present
  const getPatientName = () => {
    if (patientName) return patientName;
    if (userData && (userData.fullName || userData.userName)) {
      return userData.fullName || userData.userName;
    }
    return "";
  };
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ diseaseName: "" });
  const [submitMsg, setSubmitMsg] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    diseaseId: null,
    diseaseName: "",
  });

  useEffect(() => {
    // Enhanced validation for patientId
    if (!patientId) {
      setError("Patient ID is missing. Please go back and try again.");
      setTimeout(() => navigate(-1), 1500);
      return;
    }

    setLoading(true);
    setError("");

    // Use api service for fetching chronic diseases
    api.chronicDiseases
      .getAll(patientId)
      .then((data) => {
        const processedData = Array.isArray(data)
          ? data.map((disease, index) => {
              if (!disease.id) {
                return { ...disease, id: `temp_${index}` };
              }
              return disease;
            })
          : [];
        setDiseases(processedData);
      })
      .catch((err) => {
        setError(
          `Error fetching chronic diseases: ${err.message}. Please check the patient ID and try again.`
        );
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMsg("");

    // Check if user is a doctor and authenticated
    if (!isDoctor()) {
      setSubmitMsg("Only doctors can add chronic diseases.");
      return;
    }

    if (!isAuthenticated) {
      setSubmitMsg("You must be logged in to add chronic diseases.");
      return;
    }

    // Enhanced validation for patient ID
    if (!patientId) {
      setSubmitMsg("Patient ID is missing. Cannot add chronic disease.");
      return;
    }

    const payload = {
      name: form.diseaseName,
      patientId: patientId,
      patientName: patientName,
    };

    // ...existing code...

    try {
      await api.chronicDiseases.add(payload);
      setSubmitMsg("Chronic disease added successfully!");
      setForm({ diseaseName: "" });
      // Refresh diseases list
      const updated = await api.chronicDiseases.getAll(patientId);
      setDiseases(Array.isArray(updated) ? updated : []);
      setShowForm(false);
    } catch (error) {
      setSubmitMsg(
        `Error: ${
          error.message || "Failed to add chronic disease. Please try again."
        }`
      );
    }
  };

  const handleDelete = async (diseaseId) => {
    // Check if user is a doctor and authenticated
    if (!isDoctor()) {
      setSubmitMsg("Only doctors can delete chronic diseases.");
      return;
    }

    if (!isAuthenticated) {
      setSubmitMsg("You must be logged in to delete chronic diseases.");
      return;
    }

    if (!diseaseId) {
      setSubmitMsg("Disease ID is missing. Cannot delete chronic disease.");
      return;
    }

    // Check if the ID is a temporary ID (starts with 'temp_')
    if (diseaseId.toString().startsWith("temp_")) {
      setSubmitMsg("Disease ID is missing. Cannot delete chronic disease.");
      return;
    }

    try {
      await api.chronicDiseases.deleteDisease(diseaseId, patientId);
      // Refresh the diseases list after successful deletion
      const updated = await api.chronicDiseases.getAll(patientId);
      // Process the updated data to ensure each disease has an ID
      const processedData = Array.isArray(updated)
        ? updated.map((disease, index) => {
            if (!disease.id) {
              return { ...disease, id: `temp_${index}` };
            }
            return disease;
          })
        : [];
      setDiseases(processedData);
      setSubmitMsg("Chronic disease deleted successfully!");
      setTimeout(() => {
        setSubmitMsg("");
      }, 3000);
    } catch (error) {
      setSubmitMsg(
        `Error: ${
          error.message || "Failed to delete chronic disease. Please try again."
        }`
      );
    }
  };

  // Function to show the delete confirmation dialog
  const showDeleteConfirmation = (diseaseId, diseaseName) => {
    setDeleteConfirmation({
      show: true,
      diseaseId,
      diseaseName,
    });
  };

  // Function to hide the delete confirmation dialog
  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({
      show: false,
      diseaseId: null,
      diseaseName: "",
    });
  };

  // Function to confirm and proceed with deletion
  const confirmDelete = () => {
    const { diseaseId } = deleteConfirmation;
    hideDeleteConfirmation();
    handleDelete(diseaseId);
  };

  // Check if any diseases have temporary IDs
  const hasMissingIds = diseases.some(
    (disease) => disease.id && disease.id.toString().startsWith("temp_")
  );

  return (
    <div className="patient-details-content" style={{ padding: 32 }}>
      <div className="common-back-button-container">
        <button
          onClick={() => {
            if (isDoctor()) {
              // Go back to previous page (PatientDetails)
              navigate(-1);
            } else {
              // Go to Dashboard for patients
              navigate("/dashboard");
            }
          }}
          className="common-back-button"
        >
          <span className="common-back-arrow">←</span> Back
        </button>
      </div>
      <div className="patient-details-card" style={{ marginTop: 20 }}>
        <h2
          className="patient-title"
          style={{
            color: "#2e99dc",
            fontSize: "28px",
            marginBottom: "24px",
            textAlign: "center",
            borderBottom: "2px solid #f0f0f0",
            paddingBottom: "16px",
          }}
        >
          Chronic Diseases for {getPatientName()}
        </h2>

        {loading && (
          <div
            className="loading-indicator"
            style={{ textAlign: "center", padding: "30px" }}
          >
            Loading...
          </div>
        )}
        {error && (
          <div
            style={{
              color: "red",
              marginBottom: 16,
              textAlign: "center",
              padding: "10px",
              backgroundColor: "#ffebee",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}
        {hasMissingIds && !loading && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: "#fff3e0",
              color: "#e65100",
              textAlign: "center",
            }}
          >
            Disease ID is missing. Cannot delete chronic disease.
          </div>
        )}
        {submitMsg && !showForm && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: submitMsg.includes("success")
                ? "#e6f7e6"
                : "#ffebeb",
              color: submitMsg.includes("success") ? "#2e7d32" : "#d32f2f",
              textAlign: "center",
            }}
          >
            {submitMsg}
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                className="section-title"
                style={{
                  color: "#333",
                  fontSize: "20px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#2e99dc",
                    borderRadius: "50%",
                  }}
                ></div>
                Current Chronic Diseases
              </h3>

              {diseases.length === 0 ? (
                <div
                  style={{
                    color: "#666",
                    fontStyle: "italic",
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px dashed #ddd",
                  }}
                >
                  No chronic diseases found for this patient.
                </div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {diseases.map((disease, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "16px 24px",
                        margin: "12px 0",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                        border: "1px solid #e0e0e0",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: "#2e99dc",
                            borderRadius: "50%",
                            marginRight: "16px",
                          }}
                        ></div>
                        <strong
                          style={{
                            color: "#333",
                            fontSize: "1.1em",
                            fontWeight: "500",
                          }}
                        >
                          {disease.name}
                        </strong>
                      </div>
                      {isDoctor() ? (
                        disease.id &&
                        disease.id.toString().startsWith("temp_") ? (
                          <button
                            disabled
                            style={{
                              background: "none",
                              border: "none",
                              color: "#aaa",
                              cursor: "not-allowed",
                              fontSize: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                            }}
                            title="Cannot delete - ID is missing"
                          >
                            <span style={{ fontSize: "18px" }}>🗑️</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showDeleteConfirmation(disease.id, disease.name);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#e74c3c",
                              cursor: "pointer",
                              fontSize: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              transition: "background-color 0.2s",
                            }}
                            title="Delete disease"
                          >
                            <span style={{ fontSize: "18px" }}>🗑️</span>
                          </button>
                        )
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}

              {isDoctor() && (
                <button
                  onClick={() => setShowForm(true)}
                  className="action-btn primary"
                  style={{
                    marginTop: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#2e99dc",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                    +
                  </span>{" "}
                  Add New Chronic Disease
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Popup for Adding Chronic Disease */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#2e99dc",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              Add New Chronic Disease
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Disease Name:
                </label>
                <input
                  type="text"
                  name="diseaseName"
                  value={form.diseaseName}
                  onChange={handleChange}
                  placeholder="Enter disease name..."
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                    backgroundColor: "#f9f9f9",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "24px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f5f5f5",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#2e99dc",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Add Disease
                </button>
              </div>

              {submitMsg && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "10px",
                    borderRadius: "6px",
                    backgroundColor: submitMsg.includes("success")
                      ? "#e6f7e6"
                      : "#ffebeb",
                    color: submitMsg.includes("success")
                      ? "#2e7d32"
                      : "#d32f2f",
                    textAlign: "center",
                  }}
                >
                  {submitMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deleting Chronic Disease */}
      {deleteConfirmation.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#e74c3c",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              Confirm Deletion
            </h3>

            <div style={{ margin: "20px 0", textAlign: "center" }}>
              <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
                Are you sure you want to delete the chronic disease{" "}
                <strong>"{deleteConfirmation.diseaseName}"</strong>?
              </p>
              <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                This action cannot be undone.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <button
                onClick={hideDeleteConfirmation}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  fontWeight: "500",
                  minWidth: "100px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  minWidth: "100px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChronicDiseases;
