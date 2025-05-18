import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DepartmentNavbar from "../components/DepartmentNavbar";
import SessionCard from "../components/SessionCard";
import "./pagesStyles/MedicalSessions.css";

const MedicalSessions = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Mohamed Khaled" },
    { id: 2, name: "Dr. Sara Ahmed" },
    { id: 3, name: "Dr. Mahmoud Ibrahim" },
  ]);

  const [sortBy, setSortBy] = useState("name");

  const handleDelete = (id) => {
    setDoctors(doctors.filter((doctor) => doctor.id !== id));
  };

  const handleAddMore = () => {
    navigate("/sessions/add");
  };

  return (
    <div className="sessions-container">
      <DepartmentNavbar />
      <div className="sessions-content">
        <div className="sessions-header">
          <h1>MEDICAL SESSIONS</h1>
        </div>

        <div className="sessions-panel">
          <div className="sessions-toolbar">
            <div className="sort-by">Sort by : {sortBy}</div>
            <button className="add-more-btn" onClick={handleAddMore}>
              Add More!
            </button>
          </div>

          <div className="sessions-list">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <SessionCard
                  key={doctor.id}
                  doctor={doctor}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="no-sessions">No medical sessions available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalSessions;
