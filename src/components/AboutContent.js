import React from "react";
import {
  FaHeartbeat,
  FaUserMd,
  FaMobileAlt,
  FaShieldAlt,
  FaChartLine,
  FaBell,
  FaNotesMedical,
  FaCalendarCheck,
} from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import {
  MdOutlineMonitorHeart,
  MdSecurity,
  MdHealthAndSafety,
} from "react-icons/md";
import "./componentsStyles/aboutContent.css";

function AboutContent() {
  
  const features = [
    
    {
      icon: <MdOutlineMonitorHeart />,
      title: "Health Monitoring",
      description:
        "Track vital signs, lab results, and health metrics over time with intuitive visualizations for better disease management.",
    },
    {
      icon: <FaUserMd />,
      title: "Doctor Communication",
      description:
        "Direct connection with healthcare providers for seamless follow-ups, consultations, and sharing test results.",
    },
    {
      icon: <GiMedicines />,
      title: "Medication Management",
      description:
        "Never miss a dose with medication reminders, prescription tracking, and refill notifications.",
    },
    {
      icon: <MdSecurity />,
      title: "Secure Data",
      description:
        "Your health information is protected with the highest security standards and encryption protocols.",
    },
    
    {
      icon: <FaChartLine />,
      title: "Progress Tracking",
      description:
        "Visualize your health journey with detailed charts and progress indicators to stay motivated.",
    },
    {
      icon: <FaNotesMedical />,
      title: "Medical Records",
      description:
        "Store and access your complete medical history in one secure place, organized and always available.",
    },
    {
      icon: <FaBell />,
      title: "Appointment Reminders",
      description:
        "Get timely notifications for upcoming doctor visits, lab tests, and medical procedures.",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Treatment Plans",
      description:
        "Follow structured treatment plans created by your healthcare providers with progress tracking.",
    },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>
            About <span className="highlight">Motabaa</span>
          </h1>
          <p className="tagline">
            Transforming healthcare through continuous monitoring and connection
          </p>
        </div>
      </div>

      <div className="about-mission">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <div className="mission-icon">
              <FaHeartbeat />
            </div>
            <p>
              At <span className="highlight">Motabaa</span>, we're committed to
              revolutionizing healthcare by providing a comprehensive platform
              that bridges the gap between patients and healthcare providers.
              Our mission is to empower individuals to take control of their
              health journey while giving medical professionals the insights
              they need to deliver personalized care.
            </p>
          </div>
        </div>
      </div>

      <div className="about-features">
        <div className="container">
          <h2>Key Features</h2>
          <p className="features-intro">
            Discover how <span className="highlight">Motabaa</span> can
            transform your healthcare experience with our powerful and
            easy-to-use features
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-top">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                </div>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="about-story">
        <div className="container">
          <div className="story-content">
            <h2>Our Approach</h2>
            <p>
              <span className="highlight">Motabaa</span> integrates seamlessly
              into your healthcare routine, allowing patients to record their
              medical data, track chronic conditions, and store session details
              and prescriptions—all in one place.
            </p>
            <p>
              Healthcare providers benefit from comprehensive patient histories,
              enabling them to make informed decisions and provide more
              effective treatments tailored to each individual's needs.
            </p>
            <p>
              We've designed our platform with both simplicity and security in
              mind, ensuring that managing your health is both easy and safe.
            </p>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Join the Healthcare Revolution</h2>
            <p>
              Experience the future of medical tracking and patient care with
              Motabaa
            </p>
            <div className="cta-buttons">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutContent;
