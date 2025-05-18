import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedForm from "../components/SharedForm";
import DepartmentNavbar from "../components/DepartmentNavbar";
import UploadTestPhotoButton from "../components/UploadTestPhotoButton";
import ArrowButton from "../components/ArrowButton";
import { GiMedicines, GiTestTubes } from "react-icons/gi";
import { FaBuilding } from "react-icons/fa";
import "./pagesStyles/AddRadiologyLab.css";

// Custom SharedForm wrapper to use react-icons instead of bootstrap icons
const CustomSharedForm = ({ inputs, headerIcon, ...props }) => {
  // Create a custom header component with react-icons
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

  // Render SharedForm without headerIcon to prevent using the default bootstrap icon
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

  // Create custom input elements with react-icons
  const CustomInputs = [
    {
      name: "labName",
      placeholder: "Laboratory Name",
      customIcon: <GiTestTubes style={{ fontSize: "20px" }} />,
      required: true,
    },
    {
      name: "departmentOfTest",
      placeholder: "Department of test",
      customIcon: <FaBuilding style={{ fontSize: "20px" }} />,
      required: true,
    },
  ];

  const handleTestPhotoUpload = (file) => {
    setTestImage(file);
    console.log("Test photo uploaded:", file.name);
  };

  const handleSubmit = (formData) => {
    // Mark that validation has been attempted
    setValidationAttempted(true);

    // Check if test image is provided
    if (!testImage) {
      return; // Don't proceed if there's no image
    }

    const completeData = {
      ...formData,
      testImage: testImage,
    };

    console.log("Lab data:", completeData);

    // Navigate to lab report details with the form data
    navigate("/lab-report-details", {
      state: {
        lab: { name: formData.labName },
        testImage: testImage,
      },
    });
  };

  // Custom input with react-icons rendering
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      labName: document.querySelector('input[name="labName"]').value,
      departmentOfTest: document.querySelector('input[name="departmentOfTest"]')
        .value,
    });
  };

  return (
    <div className="add-lab-container">
      <DepartmentNavbar />
      <div className="add-lab-content">
        <div className="add-lab-form-container">
          <div className="card register-card add-lab-form">
            {/* Custom header with react-icons */}
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
              {/* Custom inputs with react-icons */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRadiologyLab;
