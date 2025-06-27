import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import { useUser } from "../context/UserContext";
import patientAvatar from "../images/Patient 1.png";
import doctorAvatar from "../images/Doctor 1.png";
import api from "../services/api";
import "./pagesStyles/PatientDetails.css";
import "./pagesStyles/MedicalTests.css";
import "./pagesStyles/CommonStyles.css";

const MedicalTests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, isDoctor, logoutUser } = useUser();
  const { patientId, patientName } = location.state || {};
  
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, radiology, laboratory
  const [selectedTest, setSelectedTest] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Redirect to dashboard if no patient data
  useEffect(() => {
    if (!patientId) {
      navigate("/dashboard");
    }
  }, [patientId, navigate]);

  // Fetch medical tests
  useEffect(() => {
    if (!patientId) return;
    
    setLoading(true);
    setError("");
    
    api.patient.getMedicalTests(patientId)
      .then(data => {
        console.log("Medical tests data received:", data);
        // Process the data to ensure each test has an ID
        const processedData = Array.isArray(data) ? data.map((test, index) => {
          if (!test.id) {
            return { ...test, id: `temp_${index}` };
          }
          return test;
        }) : [];
        setTests(processedData);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError(`Error fetching medical tests: ${err.message || "Unknown error"}. Please try again.`);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  // Filter tests based on active tab, search term, and date filter
  const filteredTests = tests.filter(test => {
    // Filter by tab
    if (activeTab === "radiology" && test.type !== "Radiology") return false;
    if (activeTab === "laboratory" && test.type !== "Laboratory") return false;
    
    // Filter by search term
    if (searchTerm && !(
      (test.name && test.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (test.notes && test.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    )) return false;
    
    // Filter by date
    if (dateFilter && test.date) {
      const testDate = new Date(test.date).toISOString().split('T')[0];
      if (testDate !== dateFilter) return false;
    }
    
    return true;
  });

  // Open image modal
  const openImageModal = (test) => {
    // Construct the full image URL based on test type
    let imageUrl;
    if (test.type === "Laboratory") {
      imageUrl = `http://motab3aa.runasp.net/images/laboratory/${test.medicalTestImg}`;
    } else if (test.type === "Radiology") {
      imageUrl = `http://motab3aa.runasp.net/images/tests/${test.medicalTestImg}`;
    } else {
      // Fallback for any other test types
      imageUrl = `http://motab3aa.runasp.net/images/medical/${test.medicalTestImg}`;
    }
    
    console.log(`Opening modal for ${test.type} test with URL:`, imageUrl);
    
    setSelectedTest({...test, imageUrl});
    setShowImageModal(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedTest(null);
  };

  if (!patientId) {
    return null;
  }

  return (
    <div className="patient-details-container">
      <PatientNavbar
        patientName={isDoctor() ? `Dr. ${userData?.fullName || userData?.userName}` : (userData?.fullName || userData?.userName)}
        patientImage={
          userData?.profileImage || (isDoctor() ? doctorAvatar : patientAvatar)
        }
        isDoctor={isDoctor()}
        onLogout={handleLogout}
        userData={userData}
      />

      <div className="patient-details-content">
        <div className="common-back-button-container">
          <button
            onClick={() => navigate("/patient-details", { state: { patientData: location.state?.patientData } })}
            className="common-back-button"
          >
            <span className="common-back-arrow">←</span> Back to Patient Details
          </button>
        </div>

        <div className="patient-details-card medical-tests-card">
          <h2 className="patient-title medical-tests-title">
            Radiology & Laboratory Tests for {patientName}
          </h2>

          {/* Filters and Search */}
          <div className="medical-tests-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by test name or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="date-filter"
              />
              {(searchTerm || dateFilter) && (
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setDateFilter("");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="medical-tests-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Tests
            </button>
            <button
              className={`tab-btn ${activeTab === "radiology" ? "active" : ""}`}
              onClick={() => setActiveTab("radiology")}
            >
              Radiology
            </button>
            <button
              className={`tab-btn ${activeTab === "laboratory" ? "active" : ""}`}
              onClick={() => setActiveTab("laboratory")}
            >
              Laboratory
            </button>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading medical tests...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={() => {
                  setLoading(true);
                  setError("");
                  // Re-fetch data
                  api.patient.getMedicalTests(patientId)
                    .then(data => {
                      console.log("Medical tests data received:", data);
                      // Process the data to ensure each test has an ID
                      const processedData = Array.isArray(data) ? data.map((test, index) => {
                        if (!test.id) {
                          return { ...test, id: `temp_${index}` };
                        }
                        return test;
                      }) : [];
                      setTests(processedData);
                    })
                    .catch((err) => {
                      console.error("API error:", err);
                      setError(`Error fetching medical tests: ${err.message || "Unknown error"}. Please try again.`);
                    })
                    .finally(() => setLoading(false));
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Test Results */}
          {!loading && !error && (
            <div className="medical-tests-results">
              {filteredTests.length === 0 ? (
                <div className="no-tests-message">
                  <p>No medical tests found{activeTab !== "all" ? ` in ${activeTab}` : ""}.</p>
                </div>
              ) : (
                <div className="tests-grid">
                  {filteredTests.map((test) => {
                    // Construct the full image URL from the API data based on test type
                    let imageUrl;
                    if (test.type === "Laboratory") {
                      imageUrl = `http://motab3aa.runasp.net/images/laboratory/${test.medicalTestImg}`;
                    } else if (test.type === "Radiology") {
                      imageUrl = `http://motab3aa.runasp.net/images/tests/${test.medicalTestImg}`;
                    } else {
                      imageUrl = `http://motab3aa.runasp.net/images/medical/${test.medicalTestImg}`;
                    }
                    
                    return (
                      <div key={test.id} className="test-card">
                        <div className="test-header">
                          {/* Use test type as the main title, emphasized with larger font and color */}
                          {test.type && (
                            <h2 className="test-type-title" style={{
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              color: '#2e99dc',
                              margin: '0 0 10px 0',
                              padding: '0 0 8px 0',
                              borderBottom: '1px solid #eaeaea'
                            }}>{test.type}</h2>
                          )}
                          {!test.type && (
                            <h2 className="test-type-title unknown-type" style={{
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              color: '#888',
                              margin: '0 0 10px 0',
                              padding: '0 0 8px 0',
                              borderBottom: '1px solid #eaeaea'
                            }}>Unknown</h2>
                          )}
                        </div>
                        
                        <div className="test-details">
                          <p className="test-date">
                            <strong>Date:</strong> {test.date ? new Date(test.date).toLocaleDateString() : "No date"}
                          </p>
                          {test.patientName && (
                            <p className="test-patient">
                              <strong>Patient:</strong> {test.patientName}
                            </p>
                          )}
                          
                          {/* Add lab name as a badge for laboratory tests */}
                          {test.type === "Laboratory" && test.labName && (
                            <div className="lab-badge">
                              {test.labName}
                            </div>
                          )}
                          {test.type === "Laboratory" && !test.labName && (
                            <div className="lab-badge">
                              Laboratory Test
                            </div>
                          )}
                        </div>
                        
                        {imageUrl && (
                          <div className="test-image-container" style={{ margin: '12px 0' }}>
                            <div 
                              className="test-image-thumbnail" 
                              onClick={() => openImageModal({...test, imageUrl})}
                              style={{ 
                                cursor: 'pointer',
                                position: 'relative',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <img 
                                src={imageUrl} 
                                alt={test.type || "Medical test image"} 
                                className="test-thumbnail"
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '200px',
                                  objectFit: 'contain',
                                  width: '100%',
                                  height: 'auto',
                                  display: 'block',
                                  backgroundColor: '#f8f8f8'
                                }}
                                onError={(e) => {
                                  console.log(`Image failed to load for ${test.type} test:`, imageUrl);
                                  const currentSrc = e.target.src;
                                  const paths = [
                                    '/images/laboratory/',
                                    '/images/tests/',
                                    '/images/medical/',
                                    '/Images/laboratory/',
                                    '/Images/tests/',
                                    '/Images/medical/'
                                  ];
                                  
                                  // Find current path
                                  const currentPath = paths.find(path => currentSrc.includes(path));
                                  const currentIndex = paths.indexOf(currentPath);
                                  
                                  // Try next path if available
                                  if (currentIndex < paths.length - 1) {
                                    const nextPath = paths[currentIndex + 1];
                                    e.target.src = `http://motab3aa.runasp.net${nextPath}${test.medicalTestImg}`;
                                  } else {
                                    // If all paths tried, show placeholder
                                    e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f93519d%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f93519d%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23f0f0f0%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.5%22%20y%3D%2296.3%22%3EImage%20Not%20Available%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                                    e.target.alt = 'Image not available';
                                  }
                                }}
                              />
                              <div className="view-full-overlay" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.3s'
                              }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0}>
                                <span style={{
                                  color: 'white',
                                  fontWeight: '600',
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  padding: '8px 16px',
                                  borderRadius: '4px'
                                }}>View Full Image</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Lab name footer */}
                        {test.labName && (
                          <div className="test-footer" style={{
                            marginTop: 'auto',
                            padding: '10px 0 0 0',
                            borderTop: '1px solid #eaeaea',
                            display: 'flex',
                            justifyContent: 'flex-end'
                          }}>
                            <span className="lab-badge" style={{
                              backgroundColor: '#f0f7ff',
                              color: '#2e99dc',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                            }}>{test.labName}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedTest && (
        <div className="image-modal-overlay" onClick={closeImageModal} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: 'auto',
            overflow: 'auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <button className="close-modal-btn" onClick={closeImageModal} style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#333',
              zIndex: 10
            }}>
              &times;
            </button>
            <h3 className="modal-test-name" style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#2e99dc',
              margin: '0 0 15px 0',
              paddingRight: '30px'
            }}>{selectedTest.type || "Medical Test Image"}</h3>
            <div className="modal-image-container" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              margin: '10px 0 20px 0',
              maxHeight: '60vh',
              overflow: 'hidden'
            }}>
              <img 
                src={selectedTest.imageUrl} 
                alt={selectedTest.type || "Medical test full image"} 
                className="modal-image"
                style={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#f0f0f0'
                }}
                onError={(e) => {
                  console.log('Image failed to load:', selectedTest.imageUrl);
                  // Try alternative URL format if the first one fails
                  if (selectedTest.type === "Laboratory" && e.target.src.includes('/images/laboratory/')) {
                    e.target.src = selectedTest.imageUrl.replace('/images/laboratory/', '/images/tests/');
                  } else if (selectedTest.type === "Radiology" && e.target.src.includes('/images/tests/')) {
                    e.target.src = selectedTest.imageUrl.replace('/images/tests/', '/images/laboratory/');
                  } else {
                    // If all attempts fail, show a placeholder
                    e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f93519d%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f93519d%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23f0f0f0%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.5%22%20y%3D%2296.3%22%3EImage%20Not%20Available%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                    e.target.alt = 'Image not available';
                  }
                }}
              />
            </div>
            <div className="modal-test-details" style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              marginTop: '10px'
            }}>
              <p><strong>Date:</strong> {selectedTest.date ? new Date(selectedTest.date).toLocaleDateString() : "No date"}</p>
              {selectedTest.patientName && <p><strong>Patient:</strong> {selectedTest.patientName}</p>}
              {selectedTest.labName && <p><strong>Lab:</strong> <span className="lab-badge" style={{ marginLeft: '5px' }}>{selectedTest.labName}</span></p>}
              {selectedTest.type === "Laboratory" && !selectedTest.labName && (
                <p><strong>Lab:</strong> <span className="lab-badge" style={{ marginLeft: '5px' }}>Laboratory Test</span></p>
              )}
              {selectedTest.notes && (
                <p><strong>Notes:</strong> {selectedTest.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalTests;