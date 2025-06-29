import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DepartmentNavbar from "../components/DepartmentNavbar";
import LabCard from "../components/LabCard";
import "./pagesStyles/RadiologyLabs.css";

const RadiologyLabs = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("patient");

  useEffect(() => {
    const userData = sessionStorage.getItem("registerFormData");
    if (userData) {
      const parsedData = JSON.parse(userData);

      setUserType(parsedData.specialty ? "doctor" : "patient");
    }
  }, []);

  const [labs, setLabs] = useState([
    { id: 1, name: "Elbadi Lab" },
    { id: 2, name: "Alpha Scan" },
    { id: 3, name: "Almokhtabar Lab" },
  ]);

  const [sortBy, setSortBy] = useState("name");

  const handleDelete = (id) => {
    setLabs(labs.filter((lab) => lab.id !== id));
  };

  const handleAddMore = () => {
    navigate("/radiology-labs/add");
  };

  return (
    <div className="labs-container">
      <DepartmentNavbar />
      <div className="labs-content">
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
        <div className="labs-header">
          <h1>RADIOLOGY AND LABORATORY TESTS</h1>
        </div>

        <div className="labs-panel">
          <div className="labs-toolbar">
            <div className="sort-by">Sort by : {sortBy}</div>
            {userType === "patient" && (
              <button className="add-more-btn" onClick={handleAddMore}>
                Add More
              </button>
            )}
          </div>

          {userType === "doctor" && (
            <div className="doctor-info-message">
              <p>As a doctor, you can only view patient test results.</p>
            </div>
          )}

          <div className="labs-list">
            {labs.length > 0 ? (
              labs.map((lab) => (
                <LabCard key={lab.id} lab={lab} onDelete={handleDelete} />
              ))
            ) : (
              <div className="no-labs">No laboratories available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiologyLabs;
