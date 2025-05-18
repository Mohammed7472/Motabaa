import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/departmentNavbar.css";
import Logo from "./Logo";

const DepartmentNavbar = () => {
  return (
    <div className="department-navbar">
      <div className="navbar-logo">
        <Logo />
      </div>
    </div>
  );
};

export default DepartmentNavbar;
