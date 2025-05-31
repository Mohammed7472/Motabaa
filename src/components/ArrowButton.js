import React from "react";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./componentsStyles/ArrowButton.css";


const ArrowButton = ({ to, onClick, type = "button", style, className }) => {
  
  if (to) {
    return (
      <Link to={to} className={`arrow-button ${className || ""}`}>
        <BsArrowRightCircleFill size={36} />
      </Link>
    );
  }

  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`arrow-button ${className || ""}`}
    >
      <BsArrowRightCircleFill size={36} />
    </button>
  );
};

export default ArrowButton;
