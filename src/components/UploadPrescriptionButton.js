import React, { useState, useRef } from "react";
import "./componentsStyles/UploadPrescriptionButton.css";
import { BsImage } from "react-icons/bs";

const UploadPrescriptionButton = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);

      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-prescription-container">
      <button
        className="upload-prescription-button"
        onClick={handleButtonClick}
        type="button"
      >
        <BsImage className="upload-icon" />
        <span className="upload-text">Upload prescription photo</span>
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      {selectedImage && (
        <div className="selected-file-name">{selectedImage.name}</div>
      )}
    </div>
  );
};

export default UploadPrescriptionButton;
