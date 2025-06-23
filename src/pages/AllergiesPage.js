import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../pages/pagesStyles/PatientDetails.css";

const API_URL = "http://motab3aa.runasp.net/api/Allergens";

const AllergiesPage = () => {
  const { userData } = useUser();
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!userData?.id) return;
    setLoading(true);
    setError("");
    fetch(`${API_URL}?patientId=${userData.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch allergies");
        return res.json();
      })
      .then(setAllergies)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userData?.id]);

  const handleAddAllergy = async () => {
    if (!newAllergy.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: userData.id, name: newAllergy }),
      });
      if (!res.ok) throw new Error("Failed to add allergy");
      setNewAllergy("");
      // Refresh allergies
      const updated = await fetch(`${API_URL}?patientId=${userData.id}`).then(
        (r) => r.json()
      );
      setAllergies(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="patient-details-content" style={{ padding: 32 }}>
      <div className="patient-info-grid">
        <div className="info-section">
          <h2 className="patient-title">Allergies</h2>
          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : error ? (
            <div style={{ color: "#c00", marginBottom: 16 }}>{error}</div>
          ) : (
            <>
              <h3 className="section-title">Current Allergies</h3>
              {allergies.length === 0 ? (
                <div style={{ color: "#666", fontStyle: "italic", padding: "10px 0" }}>No allergies found.</div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {allergies.map((a) => (
                    <li
                      key={a.id}
                      style={{ 
                        padding: "15px 20px", 
                        margin: "12px 0", 
                        backgroundColor: "white", 
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                        border: "1px solid #e0e0e0",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <div style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#2e99dc",
                        borderRadius: "50%",
                        marginRight: "12px"
                      }}></div>
                      <strong style={{ 
                        color: "#333", 
                        fontSize: "1.05em",
                        fontWeight: "500"
                      }}>{a.name}</strong>
                    </li>
                  ))}
                </ul>
              )}
              
              <button 
                onClick={() => setShowPopup(true)} 
                className="action-btn primary"
                style={{ 
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>+</span> Add New Allergy
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal Popup for Adding Allergy */}
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ marginTop: 0, color: "#2e99dc", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
              Add New Allergy
            </h3>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Allergy Name:
              </label>
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Enter allergy name..."
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px"
                }}
                disabled={adding}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button 
                type="button" 
                onClick={() => setShowPopup(false)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleAddAllergy();
                  if (newAllergy.trim()) {
                    setShowPopup(false);
                  }
                }}
                disabled={adding || !newAllergy.trim()}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#2e99dc",
                  color: "white",
                  cursor: adding || !newAllergy.trim() ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  opacity: adding || !newAllergy.trim() ? 0.7 : 1
                }}
              >
                {adding ? "Adding..." : "Add Allergy"}
              </button>
            </div>
            
            {error && (
              <div style={{ 
                marginTop: "16px", 
                padding: "10px", 
                borderRadius: "6px", 
                backgroundColor: "#ffebeb",
                color: "#d32f2f",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllergiesPage;
