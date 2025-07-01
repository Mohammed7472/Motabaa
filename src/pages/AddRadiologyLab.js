import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedForm from "../components/SharedForm";
import DepartmentNavbar from "../components/DepartmentNavbar";
import UploadTestPhotoButton from "../components/UploadTestPhotoButton";
import ArrowButton from "../components/ArrowButton";
import { GiMedicines, GiTestTubes } from "react-icons/gi";
import { FaBuilding } from "react-icons/fa";
import "./pagesStyles/AddRadiologyLab.css";

const CustomSharedForm = ({ inputs, headerIcon, ...props }) => {
  const CustomHeader = () => {
    return (
      <div
        className="mb-3"
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          backgroundColor: "#2E99DC8A",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          border: "2px solid #2E99DC8A",
        }}
      >
        <GiTestTubes style={{ fontSize: "40px", color: "#fff" }} />
      </div>
    );
  };

  return (
    <>
      <CustomHeader />
      <SharedForm inputs={inputs} {...props} />
    </>
  );
};

const AddRadiologyLab = () => {
  const navigate = useNavigate();
  const [testImage, setTestImage] = useState(null);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const CustomInputs = [
    {
      name: "labName",
      placeholder: "Laboratory Name",
      customIcon: <GiTestTubes style={{ fontSize: "20px" }} />,
      required: true,
    },
    {
      name: "typeOfTest",
      placeholder: "Type of Test",
      customIcon: <GiMedicines style={{ fontSize: "20px" }} />,
      required: true,
    },
    {
      name: "testDate",
      placeholder: "Test Date",
      type: "date",
      customIcon: <FaBuilding style={{ fontSize: "20px" }} />,
      required: true,
    },
  ];

  const handleTestPhotoUpload = (file) => {
    setTestImage(file);
  };

  const handleSubmit = async (formData) => {
    setValidationAttempted(true);

    if (!testImage) {
      return;
    }

    // Get patientId from navigation state or sessionStorage
    let patientId = null;
    let patientName = null;
    // Try to get from navigation state
    if (window.history.state && window.history.state.usr) {
      patientId = window.history.state.usr.patientId;
      patientName = window.history.state.usr.patientName;
    }
    // Fallback to sessionStorage
    if (!patientId) {
      const regData = sessionStorage.getItem("registerFormData");
      if (regData) {
        try {
          const parsed = JSON.parse(regData);
          patientId = parsed.id;
          patientName = parsed.fullName || parsed.userName;
        } catch {}
      }
    }
    if (!patientId) {
      const userData = sessionStorage.getItem("userData");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          patientId = parsed.id || parsed.userId;
          patientName = parsed.fullName || parsed.userName;
        } catch {}
      }
    }
    if (!patientId) {
      alert("Patient ID is missing. Please log in again.");
      return;
    }

    // Format date as M/D/YYYY (like swagger example)
    let formattedDate = formData.testDate;
    if (formattedDate && formattedDate.includes("-")) {
      // Convert from yyyy-mm-dd to m/d/yyyy
      const [yyyy, mm, dd] = formattedDate.split("-");
      formattedDate = `${parseInt(mm, 10)}/${parseInt(dd, 10)}/${yyyy}`;
    }

    // Prepare API params
    const params = new URLSearchParams({
      Type: formData.typeOfTest,
      Date: formattedDate,
      PatientId: patientId,
      LabName: formData.labName,
    });

    // Prepare FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("MedicalTestImage", testImage); // <-- fix field name

    try {
      const token =
        sessionStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      const response = await fetch(
        `https://motab3aa.runasp.net/api/MedicalTest?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: formDataToSend,
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add test");
      }
      // Show success popup
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(-1); // Go back one step
      }, 1800);
    } catch (err) {
      alert("Error adding test: " + (err.message || err));
    }
  };

  const CustomInputWithIcons = ({ input, onChange, value }) => (
    <div className="input-group custom-input-group" key={input.name}>
      <span className="icon custom-icon">{input.customIcon}</span>
      <input
        type={input.type || "text"}
        name={input.name}
        value={value || ""}
        onChange={onChange}
        placeholder={input.placeholder}
        required={input.required}
      />
    </div>
  );

  // Add the missing handleFormSubmit function
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {};
    CustomInputs.forEach((input) => {
      formData[input.name] = e.target[input.name].value;
    });
    handleSubmit(formData);
  };

  return (
    <div className="add-lab-container">
      <DepartmentNavbar />
      <div className="add-lab-content">
        <div className="add-lab-form-container">
          <div className="card register-card add-lab-form">
            <button
              className="back-btn"
              style={{
                marginBottom: 18,
                padding: "8px 18px",
                borderRadius: "20px",
                border: "none",
                background: "#2e99dc",
                color: "white",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                width: 110,
                alignSelf: "flex-start",
              }}
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left" style={{ marginRight: 8 }}></i>
              Back
            </button>
            <div
              className="mb-3"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#2E99DC8A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
                border: "2px solid #2E99DC8A",
              }}
            >
              <GiTestTubes style={{ fontSize: "40px", color: "#fff" }} />
            </div>

            <h2>Add Radiology or Laboratory</h2>

            <form onSubmit={handleFormSubmit}>
              {CustomInputs.map((input) => (
                <div className="input-group" key={input.name}>
                  <span className="icon">{input.customIcon}</span>
                  <input
                    type={input.type || "text"}
                    name={input.name}
                    placeholder={input.placeholder}
                    required={input.required}
                  />
                </div>
              ))}

              <div className="upload-inside-form">
                <UploadTestPhotoButton
                  onImageUpload={handleTestPhotoUpload}
                  isRequired={true}
                  showError={validationAttempted && !testImage}
                />
              </div>

              <div className="button-container">
                <ArrowButton type="submit" className="form-submit-btn" />
              </div>
            </form>
            {showSuccess && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.18)",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 4px 24px rgba(46,153,220,0.13)",
                    padding: "38px 32px 32px 32px",
                    minWidth: 320,
                    maxWidth: "90vw",
                    textAlign: "center",
                    border: "2px solid #2e99dc",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "#2e99dc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 18px auto",
                    }}
                  >
                    <GiTestTubes style={{ color: "#fff", fontSize: 32 }} />
                  </div>
                  <h3
                    style={{
                      color: "#2e99dc",
                      fontWeight: 700,
                      fontSize: 22,
                      marginBottom: 10,
                    }}
                  >
                    Test Added Successfully
                  </h3>
                  <div style={{ color: "#333", fontSize: 16, marginBottom: 8 }}>
                    The radiology or laboratory test has been added.
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <button
                      style={{
                        background: "#2e99dc",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 28px",
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(46,153,220,0.08)",
                      }}
                      onClick={() => {
                        setShowSuccess(false);
                        navigate(-1);
                      }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRadiologyLab;
