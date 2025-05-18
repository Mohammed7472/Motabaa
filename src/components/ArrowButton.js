import React from "react";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./componentsStyles/ArrowButton.css";

/**
 * ArrowButton component for consistent arrow icon usage throughout the app
 * @param {Object} props - Component props
 * @param {string} [props.to] - Route path for Link (if used as navigation)
 * @param {Function} [props.onClick] - Click handler function
 * @param {string} [props.type="button"] - Button type (submit, button, etc.)
 * @param {Object} [props.style] - Additional style object
 * @param {string} [props.className] - Additional CSS classes
 */
const ArrowButton = ({ to, onClick, type = "button", style, className }) => {
  // If 'to' is provided, render as Link
  if (to) {
    return (
      <Link to={to} className={`arrow-button ${className || ""}`}>
        <BsArrowRightCircleFill size={36} />
      </Link>
    );
  }

  // Otherwise render as button
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
