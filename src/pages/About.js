import React from "react";
import AboutContent from "../components/AboutContent";
import Logo from "../components/Logo";
import "../components/componentsStyles/aboutContent.css";

function About() {
  return (
    <div className="about-container-page">
      <div className="about-header">
        <div className="logo-container">
          <Logo />
        </div>
      </div>
      <AboutContent />
    </div>
  );
}

export default About;
