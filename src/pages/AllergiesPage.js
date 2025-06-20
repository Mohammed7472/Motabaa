import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

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

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      }}
    >
      <h2 style={{ color: "#2e99dc", marginBottom: 18 }}>Allergies</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "#c00" }}>{error}</div>
      ) : (
        <ul style={{ padding: 0, listStyle: "none", marginBottom: 18 }}>
          {allergies.length === 0 ? (
            <li style={{ color: "#888" }}>No allergies found.</li>
          ) : (
            allergies.map((a) => (
              <li
                key={a.id}
                style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}
              >
                {a.name}
              </li>
            ))
          )}
        </ul>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          type="text"
          value={newAllergy}
          onChange={(e) => setNewAllergy(e.target.value)}
          placeholder="Add new allergy..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
          disabled={adding}
        />
        <button
          onClick={handleAddAllergy}
          disabled={adding || !newAllergy.trim()}
          style={{
            background: "#2e99dc",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: adding ? "not-allowed" : "pointer",
          }}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
};

export default AllergiesPage;
