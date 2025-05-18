import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DepartmentNavbar from "../components/DepartmentNavbar";
import LabCard from "../components/LabCard";
import "./pagesStyles/RadiologyLabs.css";

const RadiologyLabs = () => {
  const navigate = useNavigate();

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
        <div className="labs-header">
          <h1>RADIOLOGY AND LABORATORY TESTS</h1>
        </div>

        <div className="labs-panel">
          <div className="labs-toolbar">
            <div className="sort-by">Sort by : {sortBy}</div>
            <button className="add-more-btn" onClick={handleAddMore}>
              Add More!
            </button>
          </div>

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
