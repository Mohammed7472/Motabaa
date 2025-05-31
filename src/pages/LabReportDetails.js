import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DepartmentNavbar from "../components/DepartmentNavbar";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { GiTestTubes } from "react-icons/gi";
import { FaBuilding } from "react-icons/fa";
import "./pagesStyles/LabReportDetails.css";

const LabReportDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { labId } = useParams();
  const [labData, setLabData] = useState(null);
  const [testImage, setTestImage] = useState(null);

  useEffect(() => {
    if (location.state?.lab) {
      setLabData(location.state.lab);
      if (location.state.testImage) {
        setTestImage(location.state.testImage);
      }
    } else if (labId) {
      const mockLabs = [
        { id: 1, name: "Elbadi Lab", department: "Radiology" },
        { id: 2, name: "Alpha Scan", department: "Imaging" },
        { id: 3, name: "Almokhtabar Lab", department: "Laboratory" },
      ];

      const lab = mockLabs.find((l) => l.id === parseInt(labId));
      if (lab) {
        setLabData(lab);
      }
    }
  }, [location.state, labId]);

  const handleBackClick = () => {
    navigate("/radiology-labs");
  };

  const lab = labData || { name: "Unknown Lab", department: "Unknown" };

  return (
    <div className="lab-report-container">
      <DepartmentNavbar />
      <div className="lab-report-content">
        <div className="lab-report-card">
          <div className="lab-icon">
            <GiTestTubes size={40} color="#2E99DC" />
          </div>

          <div className="lab-info">
            <h2 className="lab-name">{lab.name}</h2>
            {lab.department && (
              <div className="lab-department">
                <FaBuilding className="department-icon" />
                <span>{lab.department}</span>
              </div>
            )}
          </div>

          <div className="test-report-image-container">
            {testImage ? (
              <img
                src={URL.createObjectURL(testImage)}
                alt="Test Report"
                className="test-report-image"
              />
            ) : (
              <img
                src="https://via.placeholder.com/800x600.png?text=No+Test+Image"
                alt="Test Report"
                className="test-report-image"
              />
            )}
          </div>

          <div className="back-button-container">
            <button
              className="back-button"
              onClick={handleBackClick}
              aria-label="Go back to radiology labs"
            >
              <BsArrowLeftCircleFill size={42} color="#2E99DC" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportDetails;
