import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import SharedForm from "../components/SharedForm";
import DepartmentNavbar from "../components/DepartmentNavbar";
import UploadPrescriptionButton from "../components/UploadPrescriptionButton";
import "./pagesStyles/AddMedicalSession.css";

const AddMedicalSession = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [prescriptionImage, setPrescriptionImage] = useState(null);

  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    setLoadingSpecializations(true);
    fetch("https://motab3aa.runasp.net/api/Specialization")
      .then((res) => res.json())
      .then((data) => {
        // Expecting array of specializations with id and name
        setSpecializations(
          Array.isArray(data)
            ? data.map((item) => ({ value: item.id, label: item.name }))
            : []
        );
        setLoadingSpecializations(false);
      })
      .catch((err) => {
        setFetchError("Failed to fetch departments");
        setSpecializations([]);
        setLoadingSpecializations(false);
      });
  }, []);

  const formInputs = [
    {
      name: "doctorName",
      placeholder: "Doctor Name",
      icon: "bi-person",
      required: true,
    },
    {
      name: "department",
      placeholder: "Select Department",
      icon: "bi-building",
      required: true,
      type: "select",
      options: specializations,
      loading: loadingSpecializations,
      errorMessage: fetchError,
    },
    {
      name: "sessionDate",
      placeholder: "Session Date",
      icon: "bi-calendar",
      type: "date",
      required: true,
    },
  ];

  const handlePrescriptionUpload = (file) => {
    setPrescriptionImage(file);
  };

  const handleSubmit = async (formData) => {
    // Extract values
    const specializationId = formData.department;
    const date = formData.sessionDate;
    const patientId = userData?.id;

    // Build API URL (add RoshetalImg as file name if exists)
    let roshetalImgValue = "";
    if (prescriptionImage && prescriptionImage.name) {
      roshetalImgValue = encodeURIComponent(prescriptionImage.name);
    }
    const url = `https://motab3aa.runasp.net/api/Roshta?Date=${encodeURIComponent(
      date
    )}&SpecializationId=${encodeURIComponent(
      specializationId
    )}&PatientId=${encodeURIComponent(
      patientId
    )}&RoshetalImg=${roshetalImgValue}`;

    // Prepare FormData for file upload
    const formDataToSend = new FormData();
    if (prescriptionImage) {
      formDataToSend.append("RoshetalImage", prescriptionImage);
    }

    try {
      // Debug: Print all sessionStorage keys and values
      // Get token from sessionStorage (check key name matches login logic)
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // لا تضع Content-Type هنا، المتصفح سيضبطها تلقائياً مع boundary
        },
        body: formDataToSend,
      });
      if (!response.ok) {
        let errorMsg = "Failed to submit medical session";
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
        } catch (e) {
          // ignore json parse error
        }
        if (response.status === 401) {
          throw new Error("Unauthorized: Please login again");
        }
        throw new Error(errorMsg);
      }
      const result = await response.json();
      // Navigate to confirmation page with result
      navigate("/prescription-confirmation", {
        state: { ...formData, prescriptionImage, apiResult: result },
      });
    } catch (error) {
      alert(error.message || "Error submitting medical session");
    }
  };

  return (
    <div className="add-session-container">
      <DepartmentNavbar />
      <div className="add-session-content">
        <button
          className="back-btn"
          style={{
            margin: "20px 0 0 20px",
            padding: "8px 18px",
            borderRadius: "20px",
            border: "none",
            background: "#2e99dc",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left" style={{ marginRight: 8 }}></i>
          Back
        </button>
        <div className="add-session-form-container">
          <SharedForm
            title="Add Medical Session"
            headerIcon="bi-person"
            inputs={formInputs}
            onSubmit={handleSubmit}
            formClassName="add-session-form"
            renderAfterInputs={() => (
              <div className="upload-inside-form">
                <UploadPrescriptionButton
                  onImageUpload={handlePrescriptionUpload}
                />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMedicalSession;
