import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DepartmentNavbar from "../components/DepartmentNavbar";
import TabsAndGrid from "./TabsAndGrid";
import api from "../services/api";
import "./pagesStyles/RadiologyLabs.css";

const RadiologyLabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // patientId and patientName are passed from Dashboard or fallback to null
  let { patientId, patientName } = location.state || {};
  // Fallback: if not passed, try multiple sessionStorage/user sources
  if (!patientId || !patientName) {
    let found = false;
    // Try registerFormData
    const userData = sessionStorage.getItem("registerFormData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (!patientId && parsedData.id) patientId = parsedData.id;
        if (!patientName && (parsedData.fullName || parsedData.userName)) {
          patientName = parsedData.fullName || parsedData.userName;
        }
        found = !!patientId;
      } catch (e) {}
    }
    // Try userData (fix: your sessionStorage key is userData not user)
    if (!found) {
      const userData2 = sessionStorage.getItem("userData");
      if (userData2) {
        try {
          const parsedUser = JSON.parse(userData2);
          if (!patientId && (parsedUser.id || parsedUser.userId))
            patientId = parsedUser.id || parsedUser.userId;
          if (!patientName && (parsedUser.fullName || parsedUser.userName))
            patientName = parsedUser.fullName || parsedUser.userName;
          found = !!patientId;
        } catch (e) {}
      }
    }
    // Try token (if it contains user info)
    if (!found) {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const parsedToken = JSON.parse(token);
          if (!patientId && (parsedToken.id || parsedToken.userId))
            patientId = parsedToken.id || parsedToken.userId;
          if (!patientName && (parsedToken.fullName || parsedToken.userName))
            patientName = parsedToken.fullName || parsedToken.userName;
        } catch (e) {}
      }
    }
  }
  console.log("Final patientId:", patientId, "patientName:", patientName);
  const [userType, setUserType] = useState("patient");

  useEffect(() => {
    const userData = sessionStorage.getItem("registerFormData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserType(parsedData.specialty ? "doctor" : "patient");
    }
  }, []);

  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
      setError("No patient selected. Please select a patient to view tests.");
      setLabs([]);
      return;
    }
    setLoading(true);
    setError("");
    console.log("Fetching labs for patientId:", patientId);
    api.patient
      .getMedicalTests(patientId)
      .then((data) => {
        console.log("API returned labs data:", data);
        // data could be array or object, normalize to array
        let labsArr = Array.isArray(data)
          ? data
          : data?.results || data?.data || [];
        setLabs(labsArr);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch lab tests.");
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  const [sortBy, setSortBy] = useState("name");

  const handleDelete = (id) => {
    setLabs(labs.filter((lab) => lab.id !== id));
  };

  const handleAddMore = () => {
    // Pass patientId and patientName if needed for add page
    navigate("/radiology-labs/add", { state: { patientId, patientName } });
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
          onClick={() => navigate("/dashboard")}
        >
          <i className="bi bi-arrow-left" style={{ marginRight: 8 }}></i>
          Back
        </button>
        <div className="labs-header">
          <h1>RADIOLOGY AND LABORATORY TESTS</h1>
          {patientName && (
            <h2 style={{ fontSize: 18, color: "#2e99dc", marginTop: 8 }}>
              Patient: {patientName}
            </h2>
          )}
        </div>

        <div className="labs-panel">
          <div className="labs-toolbar">
            <div className="sort-by">Sort by : {sortBy}</div>
            {/* Only allow patient to add more for their own labs */}
            {userType === "patient" && patientId && (
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

          {loading ? (
            <div className="loading">Loading lab tests...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              {/* Removed duplicate search and date bar, handled in TabsAndGrid */}
              <TabsAndGrid labs={labs} handleDelete={handleDelete} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RadiologyLabs;
