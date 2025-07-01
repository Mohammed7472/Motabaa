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

  // لإظهار رسالة النجاح أو الخطأ
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  useEffect(() => {
    setLoadingSpecializations(true);
    fetch("https://motab3aa.runasp.net/api/Specialization")
      .then((res) => res.json())
      .then((data) => {
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

  // دالة لتحويل التاريخ لصيغة yyyy-MM-dd
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj)) return dateStr;
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (formData) => {
    const specializationId = formData.department;
    // Format date as MM/dd/yyyy for API
    const dateObj = new Date(formData.sessionDate);
    let date = formData.sessionDate;
    if (!isNaN(dateObj)) {
      // M/d/yyyy format (no leading zeros)
      const m = dateObj.getMonth() + 1;
      const d = dateObj.getDate();
      const yyyy = dateObj.getFullYear();
      date = `${m}/${d}/${yyyy}`;
    }
    const patientId = userData?.id;

    let url = `https://motab3aa.runasp.net/api/Roshta?Date=${encodeURIComponent(
      date
    )}&SpecializationId=${encodeURIComponent(
      specializationId
    )}&PatientId=${encodeURIComponent(patientId)}`;

    let fetchOptions = {
      method: "POST",
      headers: {},
    };
    const token = sessionStorage.getItem("authToken");
    if (token) fetchOptions.headers["Authorization"] = `Bearer ${token}`;

    if (prescriptionImage && prescriptionImage.name) {
      // RoshetalImg must match the file name exactly (not encoded)
      url += `&RoshetalImg=${prescriptionImage.name}`;
      const formDataToSend = new FormData();
      formDataToSend.append("RoshetalImage", prescriptionImage);
      fetchOptions.body = formDataToSend;
    }

    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        let errorMsg = "Failed to add prescription";
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
        } catch (e) {}
        if (response.status === 401) {
          setMessageType("error");
          setMessage("Unauthorized: Please login again");
          return;
        }
        setMessageType("error");
        setMessage(errorMsg);
        return;
      }
      const result = await response.json();
      setMessageType("success");
      setMessage("Prescription added successfully!");
      setTimeout(() => {
        setMessage("");
        navigate("/prescription-confirmation", {
          state: { ...formData, prescriptionImage, apiResult: result },
        });
      }, 1200);
    } catch (error) {
      setMessageType("error");
      setMessage(
        error.message || "An error occurred while adding the prescription"
      );
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
        {message && (
          <div className={`session-message ${messageType}`}>{message}</div>
        )}
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
