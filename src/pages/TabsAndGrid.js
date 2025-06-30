import React, { useState } from "react";
import LabCard from "../components/LabCard";
import LabCardPopup from "../components/LabCardPopup";

const TabsAndGrid = ({ labs, handleDelete }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  // Filtering logic
  let filteredLabs = labs;
  if (activeTab === "radiology") {
    filteredLabs = labs.filter((lab) =>
      (lab.type || "").toLowerCase().includes("radio")
    );
  } else if (activeTab === "laboratory") {
    filteredLabs = labs.filter((lab) =>
      (lab.type || "").toLowerCase().includes("lab")
    );
  }
  if (search) {
    filteredLabs = filteredLabs.filter(
      (lab) =>
        (lab.type && lab.type.toLowerCase().includes(search.toLowerCase())) ||
        (lab.name && lab.name.toLowerCase().includes(search.toLowerCase())) ||
        (lab.notes && lab.notes.toLowerCase().includes(search.toLowerCase()))
    );
  }
  if (date) {
    filteredLabs = filteredLabs.filter(
      (lab) => (lab.date || "").slice(0, 10) === date
    );
  }

  const [popupLab, setPopupLab] = useState(null);
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by test name or notes..."
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 260,
            marginRight: 12,
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 160,
          }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          style={{
            padding: "6px 18px",
            borderRadius: 6,
            border: "none",
            background: activeTab === "all" ? "#2e99dc" : "#e6f3ff",
            color: activeTab === "all" ? "#fff" : "#2e99dc",
            fontWeight: 600,
          }}
          onClick={() => setActiveTab("all")}
        >
          All Tests
        </button>
        <button
          style={{
            padding: "6px 18px",
            borderRadius: 6,
            border: "none",
            background: activeTab === "radiology" ? "#2e99dc" : "#e6f3ff",
            color: activeTab === "radiology" ? "#fff" : "#2e99dc",
            fontWeight: 600,
          }}
          onClick={() => setActiveTab("radiology")}
        >
          Radiology
        </button>
        <button
          style={{
            padding: "6px 18px",
            borderRadius: 6,
            border: "none",
            background: activeTab === "laboratory" ? "#2e99dc" : "#e6f3ff",
            color: activeTab === "laboratory" ? "#fff" : "#2e99dc",
            fontWeight: 600,
          }}
          onClick={() => setActiveTab("laboratory")}
        >
          Laboratory
        </button>
      </div>
      <div
        className="labs-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
        }}
      >
        {filteredLabs.length > 0 ? (
          filteredLabs.map((lab) => (
            <LabCard
              key={lab.id || lab.testId}
              lab={lab}
              onDelete={handleDelete}
              onClick={() => setPopupLab(lab)}
            />
          ))
        ) : (
          <div className="no-labs" style={{ gridColumn: "1/-1" }}>
            No laboratories available.
          </div>
        )}
      </div>
      <LabCardPopup lab={popupLab} onClose={() => setPopupLab(null)} />
    </>
  );
};

export default TabsAndGrid;
