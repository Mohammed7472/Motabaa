import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DepartmentNavbar from "../components/DepartmentNavbar";
import DepartmentCard from "../components/DepartmentCard";
import api from "../services/api";
import "./pagesStyles/Departments.css";
import departmentsIcon from "../images/Mask group (1).png";
import cardiologyIcon from "../images/cardiology.png";
import mentalHealthIcon from "../images/mental-health.png";
import chronicDiseasesIcon from "../images/chronic-diseases.png";
import allergiesIcon from "../images/allergies.png";
import dermaIcon from "../images/face.png";
import { useUser } from "../context/UserContext";

// احضر بيانات المستخدم
const getPatientId = () => {
  try {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    return userData?.id;
  } catch {
    return null;
  }
};

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userData } = useUser(); // استخدام سياق المستخدم للصول على بيانات المستخدم الحالي

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.specialization.getAll();
        setDepartments(data);
      } catch (err) {
        setError(err.message || "Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // عند الضغط على الكارد، انتقل لصفحة عرض الروشتات
  const handleDepartmentClick = (department) => {
    // الحصول على معرف المريض من بيانات المستخدم الحالي
    const patientId = userData?.id || getPatientId();
    
    // تأكد من أن لدينا معرف القسم ومعرف المريض
    if (!department || !department.id) {
      console.error("Missing department ID");
      return;
    }
    
    console.log("Navigating to prescriptions with:", {
      patientId: patientId,
      departmentId: department.id,
      departmentName: department.name
    });
    
    // تمرير البيانات المطلوبة في حالة التنقل
    navigate("/prescriptions-by-department", { 
      state: { 
        patientId: patientId,
        departmentId: department.id,
        department: department 
      } 
    });
  };

  return (
    <div className="departments-container">
      <DepartmentNavbar />
      <div className="departments-content">
        <div className="departments-header">
          <h1>Medical Departments</h1>
          <p>Choose a department to continue</p>
        </div>
        <button
          className="back-btn"
          style={{
            margin: "0 0 24px 0",
            padding: "8px 18px",
            borderRadius: "20px",
            border: "none",
            background: "#2e99dc",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            alignSelf: "flex-start",
          }}
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left" style={{ marginRight: 8 }}></i>
          Back
        </button>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="departments-grid">
              {departments.map((department) => {
                // Choose icon based on department name (case-insensitive)
                let icon = departmentsIcon;
                if (department.name && /cardio/i.test(department.name)) {
                  icon = cardiologyIcon;
                } else if (
                  department.name &&
                  /mental|psych/i.test(department.name)
                ) {
                  icon = mentalHealthIcon;
                } else if (
                  department.name &&
                  /chronic/i.test(department.name)
                ) {
                  icon = chronicDiseasesIcon;
                } else if (department.name && /allerg/i.test(department.name)) {
                  icon = allergiesIcon;
                } else if (
                  department.name &&
                  /derma|جلدية|skin/i.test(department.name)
                ) {
                  icon = dermaIcon;
                }
                return (
                  <DepartmentCard
                    key={department.id}
                    title={department.name}
                    icon={icon}
                    link={"#"}
                    className="department-item"
                    onClick={() => handleDepartmentClick(department)}
                  />
                );
              })}
            </div>
            {/* لا يوجد عرض للروشتات هنا */}
          </>
        )}
      </div>
    </div>
  );
};

export default Departments;
