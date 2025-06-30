import React from "react";
import "./componentsStyles/labCard.css";

const LabCardPopup = ({ lab, onClose }) => {
  if (!lab) return null;
  // Prepare image
  let labImage = null;
  const imgField = lab.medicalTestImg || lab.testImage || lab.image || "";
  if (
    imgField &&
    typeof imgField === "string" &&
    !imgField.includes("FormFile") &&
    !imgField.startsWith("data:") &&
    !imgField.startsWith("http")
  ) {
    labImage = `https://motab3aa.runasp.net/Images/medical/${imgField}`;
  } else if (
    imgField &&
    (imgField.startsWith("http") || imgField.startsWith("data:"))
  ) {
    labImage = imgField;
  }
  return (
    <div className="lab-popup-overlay" onClick={onClose}>
      <div className="lab-popup-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lab-popup-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="lab-popup-title">
          {lab.type || lab.name || lab.testName}
        </h2>
        {labImage && (
          <div className="lab-popup-img-container">
            <img
              src={labImage}
              alt={lab.type || lab.name}
              className="lab-popup-img"
            />
          </div>
        )}
        {!labImage && (
          <div className="lab-popup-img-container">
            <span style={{ color: "#aaa", fontSize: 16 }}>
              Image Not Available
            </span>
          </div>
        )}
        <div className="lab-popup-details">
          <div>
            <b>Date:</b> {lab.date ? lab.date.split("T")[0] : "-"}
          </div>
          <div>
            <b>Patient:</b> {lab.patientName || lab.patient || ""}
          </div>
          <div>
            <b>Lab:</b> {lab.labName || lab.source || ""}
          </div>
          {lab.notes && (
            <div>
              <b>Notes:</b> {lab.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabCardPopup;
