
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./pagesStyles/PrescriptionsByDepartment.css";
import "./pagesStyles/MedicalHistory.css";
import { useUser } from "../context/UserContext";

// مكون لعرض حالة تحميل الصورة
const PrescriptionImageLoader = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '12px',
    }}>
      <div style={{
        width: '30px',
        height: '30px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #2e99dc',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  );
};

// أنماط CSS للرسوم المتحركة
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleElement);

const PrescriptionsByDepartment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser(); // استخدام سياق المستخدم للحصول على بيانات المستخدم الحالي
  
  // محاولة الحصول على معرف المريض ومعرف القسم من حالة التنقل، مع الرجوع إلى بيانات المستخدم المسجل إذا كانت مفقودة
  let patientId = location.state?.patientId;
  let departmentId = location.state?.departmentId;
  let department = location.state?.department;
  
  // إذا لم يتم تمرير معرف المريض، استخدم معرف المستخدم الحالي
  if (!patientId && userData && userData.id) {
    patientId = userData.id;
    console.log("Using current user ID as patient ID:", patientId);
  }
  
  // إذا تم تمرير كائن القسم ولكن ليس معرف القسم، استخرج المعرف من الكائن
  if (!departmentId && department && department.id) {
    departmentId = department.id;
    console.log("Extracted department ID from department object:", departmentId);
  }
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // دالة لفتح النافذة المنبثقة للوصفة الطبية
  const openPrescriptionModal = (prescription) => {
    console.log("Opening prescription modal:", prescription);
    // Create a copy of the prescription with additional image URLs to try
    const prescriptionWithImageUrls = {
      ...prescription,
      imageUrls: [
        `https://motab3aa.runasp.net/Images/rosheta/${prescription.roshetaImg}`,
        `https://motab3aa.runasp.net/Images/${prescription.roshetaImg}`,
        `https://motab3aa.runasp.net/images/rosheta/${prescription.roshetaImg}`,
        `https://motab3aa.runasp.net/images/${prescription.roshetaImg}`,
      ],
    };
    setSelectedPrescription(prescriptionWithImageUrls);
    setShowPrescriptionModal(true);
  };

  // دالة لإغلاق النافذة المنبثقة
  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedPrescription(null);
  };

  useEffect(() => {
    // التحقق من وجود معرف المريض ومعرف القسم
    if (!patientId || !departmentId) {
      setError("Missing department or patient info");
      setLoading(false);
      return;
    }
    
    console.log("Fetching prescriptions with patientId:", patientId, "and departmentId:", departmentId);
    
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.prescriptions.getByPatientAndSpecialization(
          patientId,
          departmentId
        );
        console.log("Prescriptions API response:", data);
        console.log("Department name:", department?.name);
        
        // تحليل البيانات المستلمة
        if (Array.isArray(data)) {
          console.log(`Received ${data.length} prescriptions for ${department?.name || departmentId}`);
          
          // فحص بيانات الصور
          data.forEach((presc, index) => {
            console.log(`Prescription ${index+1} image data:`, {
              id: presc.id,
              hasRoshetaImg: !!presc.roshetaImg,
              roshetaImgType: typeof presc.roshetaImg,
              roshetaImgValue: presc.roshetaImg
            });
          });
          
          setPrescriptions(data);
        } else {
          console.log("Received non-array data:", data);
          setPrescriptions([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [patientId, departmentId, department]);

  return (
    <div className="prescriptions-by-department-container">
      <button
        className="common-back-button"
        style={{
          margin: "32px 0 32px 32px",
          padding: "10px 24px",
          borderRadius: "22px",
          border: "none",
          background: "#2e99dc",
          color: "white",
          fontWeight: 600,
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          alignSelf: "flex-start",
          zIndex: 2,
        }}
        onClick={() => navigate(-1)}
      >
        <span className="common-back-arrow">←</span> Back
      </button>
      <div className="prescriptions-content">
        <h2
          className="medical-history-title"
          style={{
            marginBottom: 32,
            fontWeight: 700,
            fontSize: 32,
            color: "#222",
          }}
        >
          Prescriptions for {department?.name || "Selected Department"}
        </h2>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading prescriptions...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              className="retry-btn"
              onClick={() => {
                setLoading(true);
                setError("");
                // Retry fetching prescriptions
                const retryFetch = async () => {
                  try {
                    const data = await api.prescriptions.getByPatientAndSpecialization(
                      patientId,
                      departmentId
                    );
                    if (Array.isArray(data)) {
                      setPrescriptions(data);
                    } else {
                      setPrescriptions([]);
                    }
                  } catch (err) {
                    setError(err.message || "Failed to fetch prescriptions");
                  } finally {
                    setLoading(false);
                  }
                };
                retryFetch();
              }}
            >
              Retry
            </button>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="no-results">
            <p>No prescriptions found for this department.</p>
          </div>
        ) : (
          <div className="prescriptions-container">
            <div className="prescriptions-grid">
              {prescriptions.map((presc, idx) => {
                // استخراج قيمة roshtaImg وتنظيفها
                let imageUrl = null;
                let debugRoshta = presc?.roshetaImg;
                let debugImageUrl = null;
                
                if (
                  presc &&
                  typeof presc.roshetaImg === "string" &&
                  presc.roshetaImg.trim() !== "" &&
                  !presc.roshetaImg.toLowerCase().startsWith("microsoft.aspnetcore")
                ) {
                  let originalUrl = presc.roshetaImg.trim();
                  // إزالة المسافات من البداية والنهاية وأي رموز غريبة
                  originalUrl = originalUrl.replace(/\s+/g, "");
                  
                  // إذا كان الرابط كامل
                  if (/^https?:\/\//i.test(originalUrl)) {
                    try {
                      // التحقق من صحة URL
                      const url = new URL(originalUrl);
                      imageUrl = url.toString();
                    } catch (error) {
                      imageUrl = null;
                    }
                  } else {
                    // تنظيف اسم الملف
                    let cleanFileName = originalUrl.split("/").pop().split("\\").pop();
                    cleanFileName = cleanFileName.split("?")[0];
                    
                    // معالجة اسم الملف
                    if (!cleanFileName || cleanFileName === '') {
                      cleanFileName = 'prescription.png';
                    } else if (!cleanFileName.includes(".")) {
                      cleanFileName = cleanFileName + ".png";
                    }
                    
                    // إزالة أي أحرف غير صالحة في اسم الملف
                    cleanFileName = cleanFileName.replace(/[\s\\/:*?"<>|]/g, '_');
                    
                    // معالجة المسافات والأحرف الخاصة
                    cleanFileName = encodeURIComponent(cleanFileName);
                    
                    // التحقق من الامتداد
                    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".JPG", ".JPEG", ".PNG", ".GIF", ".WEBP"];
                    // تحويل اسم الملف إلى أحرف صغيرة للمقارنة
                    const lowerFileName = cleanFileName.toLowerCase();
                    // التحقق من وجود امتداد صالح
                    const hasValidExtension = validExtensions.some(ext => {
                      return lowerFileName.endsWith(ext.toLowerCase());
                    });
                    
                    if (cleanFileName && hasValidExtension) {
                      try {
                        const baseUrl = 'https://motab3aa.runasp.net/Images/rosheta/';
                        const url = new URL(cleanFileName, baseUrl);
                        imageUrl = url.toString();
                      } catch (error) {
                        imageUrl = `https://motab3aa.runasp.net/Images/rosheta/${cleanFileName}`;
                      }
                    }
                  }
                }
                debugImageUrl = imageUrl;
                
                return (
                  <div
                    key={presc.id || idx}
                    className="prescription-card"
                    onClick={() => openPrescriptionModal(presc)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <div
                      className="prescription-header"
                      style={{
                        padding: "15px",
                        borderBottom: "1px solid #eaeaea",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <h3
                        className="prescription-title"
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: "#2e99dc",
                          margin: 0,
                        }}
                      >
                        {department?.name || "Prescription"}
                      </h3>
                      <span
                        className="prescription-date"
                        style={{
                          backgroundColor: "#e8f4ff",
                          color: "#0066cc",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        {presc.date || presc.sessionDate
                          ? new Date(presc.date || presc.sessionDate).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                    <div
                      className="prescription-content"
                      style={{
                        padding: "15px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        flex: 1,
                      }}
                    >
            
                      
                      {presc.roshetaImg && (
                        <div
                          className="prescription-image-container"
                          style={{ margin: "12px 0" }}
                        >
                          <div
                            className="prescription-image-thumbnail"
                            style={{
                              cursor: "pointer",
                              position: "relative",
                              borderRadius: "8px",
                              overflow: "hidden",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <img
                              src={imageUrl || `https://motab3aa.runasp.net/Images/rosheta/${presc.roshetaImg}`}
                              alt={"Medical Prescription"}
                              className="prescription-image"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                objectFit: "contain",
                                width: "100%",
                                height: "auto",
                                display: "block",
                                backgroundColor: "#f8f8f8",
                              }}
                              onError={(e) => {
                                // Try alternative URL formats if the first one fails
                                e.target.src = `https://motab3aa.runasp.net/Images/${presc.roshetaImg}`;

                                // If that fails, try another path
                                e.target.onerror = () => {
                                  e.target.src = `https://motab3aa.runasp.net/images/rosheta/${presc.roshetaImg}`;

                                  // If that fails, try one more path
                                  e.target.onerror = () => {
                                    e.target.src = `https://motab3aa.runasp.net/images/${presc.roshetaImg}`;

                                    // If all attempts fail, show a placeholder
                                    e.target.onerror = () => {
                                      e.target.alt = "Image not available";
                                    };
                                  };
                                };
                              }}
                            />
                            <div
                              className="view-full-overlay"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.opacity = 1)
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.opacity = 0)
                              }
                            >
                              <span
                                style={{
                                  color: "white",
                                  fontWeight: "600",
                                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                                  padding: "8px 16px",
                                  borderRadius: "4px",
                                }}
                              >
                                View Prescription
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {presc.doctorName && (
                        <p className="prescription-doctor">
                          <strong>Doctor:</strong> {presc.doctorName}
                        </p>
                      )}
                      {presc.notes && (
                        <p className="prescription-notes">
                          <strong>Notes:</strong> {presc.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPrescription && (
        <div
          className="prescription-modal-overlay"
          onClick={closePrescriptionModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="prescription-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              width: "auto",
              overflow: "auto",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <button
              className="close-modal-btn"
              onClick={closePrescriptionModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#333",
                zIndex: 10,
              }}
            >
              &times;
            </button>
            <h3
              className="modal-prescription-title"
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#2e99dc",
                margin: "0 0 15px 0",
                paddingRight: "30px",
              }}
            >
              {department?.name ? `${department.name} Prescription` : "Medical Prescription"}
            </h3>
            {selectedPrescription.roshetaImg && (
              <div
                className="modal-prescription-image-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "10px 0 20px 0",
                  maxHeight: "60vh",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`https://motab3aa.runasp.net/Images/rosheta/${selectedPrescription.roshetaImg}`}
                  alt={"Medical Prescription"}
                  className="modal-prescription-image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "60vh",
                    objectFit: "contain",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f0f0f0",
                  }}
                  onError={(e) => {
                    e.target.src = `https://motab3aa.runasp.net/Images/${selectedPrescription.roshetaImg}`;
                    e.target.onerror = () => {
                      e.target.src = `https://motab3aa.runasp.net/images/rosheta/${selectedPrescription.roshetaImg}`;
                      e.target.onerror = () => {
                        e.target.src = `https://motab3aa.runasp.net/images/${selectedPrescription.roshetaImg}`;
                        e.target.onerror = () => {
                          e.target.alt = "Image not available";
                        };
                      };
                    };
                  }}
                />
              </div>
            )}
            <div
              className="modal-prescription-details"
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "6px",
                marginTop: "10px",
              }}
            >
              <p>
                <strong>Date:</strong>{" "}
                {selectedPrescription.date || selectedPrescription.sessionDate
                  ? new Date(selectedPrescription.date || selectedPrescription.sessionDate).toLocaleDateString()
                  : "No date"}
              </p>
              {selectedPrescription.doctorName && (
                <p>
                  <strong>Doctor:</strong> {selectedPrescription.doctorName}
                </p>
              )}
              {selectedPrescription.notes && (
                <p>
                  <strong>Notes:</strong> {selectedPrescription.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsByDepartment;
