import React, { useState, useRef } from "react";
import "./componentsStyles/UploadTestPhotoButton.css";
import { BsImage } from "react-icons/bs";

const UploadTestPhotoButton = ({
  onImageUpload,
  isRequired = false,
  showError = false,
}) => {
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
    <div className="upload-test-container">
      {isRequired && showError && !selectedImage && (
        <div className="required-info">
          Please attach a test photo - Test photo is required
        </div>
      )}

      <button
        className="upload-test-button"
        onClick={handleButtonClick}
        type="button"
      >
        <BsImage className="upload-icon" />
        <span className="upload-text">Upload test photo</span>
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

export default UploadTestPhotoButton;
