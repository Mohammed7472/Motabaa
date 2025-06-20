import React from "react";
import { Link } from "react-router-dom";
import "../components/componentsStyles/services.css";
import Logo from "../components/Logo";
import ShadowShape from "../components/ShadowShape";
import {
  FaClipboardList,
  FaChartLine,
  FaNotesMedical,
  FaUserMd,
  FaStethoscope,
  FaCalendarCheck,
  FaShieldAlt,
} from "react-icons/fa";

function Services() {
  const services = [
    {
      icon: <FaClipboardList />,
      title: "Medical Data Recording",
      description:
        "Easily log and manage your personal health records in one place.",
    },
    {
      icon: <FaChartLine />,
      title: "Chronic Condition Tracking",
      description:
        "Monitor chronic diseases continuously for better health outcomes.",
    },
    {
      icon: <FaNotesMedical />,
      title: "Session & Prescription Storage",
      description:
        "Save and access past medical sessions and prescriptions securely.",
    },
    {
      icon: <FaUserMd />,
      title: "Doctor Access to Patient History",
      description:
        "Allow doctors to view your complete medical background for informed care.",
    },
    {
      icon: <FaStethoscope />,
      title: "Specialized Diagnosis Management",
      description:
        "Doctors can add and manage diagnoses within their medical specialty.",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Treatment Plan Updates",
      description:
        "Stay up to date with your latest treatment plans and medical advice.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Medical Tracking System",
      description:
        "Your health data is safe, centralized, and always accessible when needed.",
    },
  ];
  return (
    <div className="services-page">
      {" "}
      <div className="logo-section">
        <Logo h="100px" v="100px" />
      </div>
      <div className="services-container">
        <div className="services-header">
          <h1>Services</h1>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <h2>Ready to Get Started?</h2>
          <p>
            Experience seamless health tracking and management with our comprehensive medical platform
          </p>
          <Link to="/register">
            <button className="btn btn-primary">Register Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Services;
