import React, { useEffect, useState } from "react";
// Import icons (assuming from react-icons, you may need to install this)
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ShadowShape from "../components/ShadowShape";
import CircleShape from "../components/CircleShape";
import "../components/componentsStyles/home.css";

// Import icons (assuming from react-icons, you may need to install this)
import {
  FaUserMd,
  FaHospital,
  FaFileMedical,
  FaHeartbeat,
} from "react-icons/fa";

function Home() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Your Health Monitoring{" "}
            <span className="text-primary">Solution</span>
          </h1>
          <p className="hero-subtitle">
            Track your medical records, connect with healthcare professionals,
            and manage your health journey all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary get-started-btn">
              Get Started
            </Link>
            <Link
              to="/about"
              className="btn btn-outline-primary learn-more-btn"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          {/* We'll add a CSS background image here */}
        </div>
        <ShadowShape top="25%" left="90%" v="100px" h="100px" />
        <CircleShape top="65%" left="5%" size="100px" opacity="0.1" />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-container">
          {/* feature Card */}
          <div className="feature-card">
            <div className="feature-icon">
              <FaUserMd />
            </div>
            <h3>Connect with Doctors</h3>
            <p>
              Find and connect with healthcare professionals based on your
              needs.
            </p>
          </div>

          {/* feature Card */}
          <div className="feature-card">
            <div className="feature-icon">
              <FaFileMedical />
            </div>
            <h3>Manage Medical Records</h3>
            <p>
              Store and access your medical reports, prescriptions, and test
              results securely.
            </p>
          </div>

          {/* feature Card */}
          <div className="feature-card">
            <div className="feature-icon">
              <FaHospital />
            </div>
            <h3>Access Radiology Labs</h3>
            <p>
              Find radiology labs and keep all your imaging reports in one
              place.
            </p>
          </div>

          {/* feature Card */}
          <div className="feature-card">
            <div className="feature-icon">
              <FaHeartbeat />
            </div>
            <h3>Track Health Progress</h3>
            <p>Monitor your health journey and track improvements over time.</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to="/services" className="btn btn-outline-primary">
            View All Services
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-container">
          {/* testimonial Card */}
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "The platform has made managing my medical records so much
                easier. I can access everything from anywhere!"
              </p>
            </div>
            <div className="testimonial-author">
              <h4>Ahmed Hassan</h4>
              <p>Patient</p>
            </div>
          </div>

          {/* testimonial Card */}
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "As a doctor, this platform helps me keep track of my patients'
                progress and communicate efficiently."
              </p>
            </div>
            <div className="testimonial-author">
              <h4>Dr. Layla Mohamed</h4>
              <p>Cardiologist</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Take Control of Your Health?</h2>
          <p>
            Join thousands of users who have already improved their healthcare
            experience with our platform.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Register Now
          </Link>
        </div>
        <ShadowShape top="75%" right="90%" v="80px" h="80px" />
      </section>
    </div>
  );
}

export default Home;
