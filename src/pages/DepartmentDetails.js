import React from "react";
import { useParams, Link } from "react-router-dom";
import DepartmentNavbar from "../components/DepartmentNavbar";
import "./pagesStyles/DepartmentDetails.css";

const departmentsData = {
  cardiology: {
    title: "Cardiology",
    description:
      "The cardiology department specializes in diagnosing and treating heart disorders. Our cardiologists use advanced diagnostic tools to evaluate cardiac function and determine appropriate treatment plans.",
    doctors: [
      {
        id: 1,
        name: "Dr. Ahmed Mohammed",
        specialization: "Heart Surgeon",
        availability: "Sun, Tue, Thu: 9AM - 2PM",
      },
      {
        id: 2,
        name: "Dr. Fatima Ali",
        specialization: "Cardiologist",
        availability: "Mon, Wed: 10AM - 4PM",
      },
    ],
  },
  neurology: {
    title: "Neurology",
    description:
      "The neurology department focuses on disorders of the nervous system. Our team specializes in diagnosing and treating conditions affecting the brain, spinal cord, and nerves.",
    doctors: [
      {
        id: 1,
        name: "Dr. Omar Hassan",
        specialization: "Neurologist",
        availability: "Mon, Wed, Fri: 10AM - 3PM",
      },
      {
        id: 2,
        name: "Dr. Laila Ibrahim",
        specialization: "Neurosurgeon",
        availability: "Tue, Thu: 9AM - 5PM",
      },
    ],
  },
  orthopedics: {
    title: "Orthopedics",
    description:
      "The orthopedics department specializes in musculoskeletal issues. Our orthopedic surgeons and specialists diagnose and treat disorders of bones, joints, ligaments, tendons, and muscles.",
    doctors: [
      {
        id: 1,
        name: "Dr. Mahmoud Kamal",
        specialization: "Orthopedic Surgeon",
        availability: "Sun, Tue, Thu: 8AM - 2PM",
      },
      {
        id: 2,
        name: "Dr. Nadia Said",
        specialization: "Sports Medicine",
        availability: "Mon, Wed, Sat: 11AM - 4PM",
      },
    ],
  },
};

const DepartmentDetails = () => {
  const { departmentId } = useParams();
  const department = departmentsData[departmentId] || {
    title: "Department Not Found",
    description: "Sorry, the requested department does not exist.",
    doctors: [],
  };

  return (
    <div className="department-details-container">
      <DepartmentNavbar />
      <div className="department-details-content">
        <div className="department-details-header">
          <Link to="/departments" className="back-button">
            <i className="bi bi-arrow-left"></i> Back to Departments
          </Link>
          <h1>{department.title}</h1>
          <p className="department-description">{department.description}</p>
        </div>

        <div className="doctors-section">
          <h2>Available Doctors</h2>
          {department.doctors.length > 0 ? (
            <div className="doctors-list">
              {department.doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <h3>{doctor.name}</h3>
                  <p className="specialization">{doctor.specialization}</p>
                  <p className="availability">
                    <i className="bi bi-calendar"></i> {doctor.availability}
                  </p>
                  <button className="book-appointment-btn">
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-doctors">
              No doctors available for this department.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
