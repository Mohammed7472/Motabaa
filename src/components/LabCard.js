import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FaFlask, FaBuilding } from "react-icons/fa";
import "./componentsStyles/labCard.css";
import ConfirmDeletePopup from "./ConfirmDeletePopup";

const LabCard = ({ lab, onDelete, onClick }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Disable body scroll when popup is open
  React.useEffect(() => {
    if (showConfirm) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showConfirm]);
  // Display details as in the doctor view: name, date, patient, image, notes, etc.
  // Fallbacks for missing fields
  // Try to show the same fields as the doctor view (based on your screenshot)
  // Most likely the API returns: name, testName, testImage, patientName, date, source, type, etc.
  // API fields: id, type, date, medicalTestImg, patientName, labName
  const testName = lab.type || lab.name || lab.testName || "Test";
  const testDate = lab.date ? lab.date.split("T")[0] : "-";
  const patient = lab.patientName || lab.patient || "";
  // Handle image for all possible field names and values
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
  // Debug: log the image field for troubleshooting
  // console.log("LabCard imgField:", imgField, "labImage:", labImage);
  const notes = lab.notes || lab.description || "";
  const labType = lab.type || lab.testType || "";
  const labDepartment = lab.departmentOfTest || lab.department || "";
  const source = lab.labName || lab.source || "";

  // Add popup-open class if confirm popup is open
  return (
    <div
      className={`lab-card${showConfirm ? " popup-open" : ""}`}
      onClick={showConfirm ? undefined : onClick}
    >
      <div className="lab-info">
        <div className="lab-details" style={{ width: "100%" }}>
          <div
            className="lab-name"
            style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}
          >
            {testName}
          </div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
            <b>Date:</b> {testDate}
          </div>
          {patient && (
            <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
              <b>Patient:</b> {patient}
            </div>
          )}
          {labDepartment && (
            <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
              <b>Department:</b> {labDepartment}
            </div>
          )}
          {labType && (
            <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
              <b>Type:</b> {labType}
            </div>
          )}
          {notes && (
            <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
              <b>Notes:</b> {notes}
            </div>
          )}
          {source && (
            <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
              <b>Source:</b> {source}
            </div>
          )}
        </div>
        <div
          style={{
            minWidth: 120,
            minHeight: 90,
            marginLeft: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f7fa",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {labImage ? (
            <img
              src={labImage}
              alt={testName}
              style={{ maxWidth: 120, maxHeight: 90, objectFit: "contain" }}
            />
          ) : (
            <span style={{ color: "#aaa", fontSize: 13 }}>
              Image Not Available
            </span>
          )}
        </div>
      </div>
      {/* Delete button absolutely positioned, not affected by card hover/active */}
      <button
        className="delete-button"
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirm(true);
        }}
        aria-label="Delete lab"
        tabIndex={0}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 20,
          background: "none",
        }}
      >
        <FaTrash />
      </button>
      {/* ConfirmDeletePopup overlays everything, disables card interaction */}
      <ConfirmDeletePopup
        open={showConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this test${
          lab.type ? ` "${lab.type}"` : ""
        }?`}
        onCancel={() => setShowConfirm(false)}
        onConfirm={async () => {
          setShowConfirm(false);
          const id = lab.id || lab.testId;
          if (!id) return;
          try {
            const api = await import("../services/api");
            await api.default.medicalTest.delete(id);
            onDelete && onDelete(id);
          } catch (err) {
            alert("Failed to delete test. Please try again.");
          }
        }}
      />
    </div>
  );
};

export default LabCard;
