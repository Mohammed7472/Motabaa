import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedForm from "../components/SharedForm";
import DepartmentNavbar from "../components/DepartmentNavbar";
import UploadPrescriptionButton from "../components/UploadPrescriptionButton";
import "./pagesStyles/AddMedicalSession.css";

const AddMedicalSession = () => {
  const navigate = useNavigate();
  const [prescriptionImage, setPrescriptionImage] = useState(null);

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
    console.log("Prescription image uploaded:", file.name);
  };

  const handleSubmit = (formData) => {
    const completeData = {
      ...formData,
      prescriptionImage: prescriptionImage,
    };

    console.log("Session data:", completeData);

    navigate("/prescription-confirmation", { state: completeData });
  };

  return (
    <div className="add-session-container">
      <DepartmentNavbar />
      <div className="add-session-content">
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
