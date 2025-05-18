import React from "react";
import DepartmentNavbar from "../components/DepartmentNavbar";
import DepartmentCard from "../components/DepartmentCard";
import "./pagesStyles/Departments.css";

import departmentsIcon from "../images/Mask group (1).png";
import radiologyIcon from "../images/Mask group.png";
import sessionsIcon from "../images/medical 1.png";

const Departments = () => {
  const departments = [
    {
      id: 1,
      title: "Cardiology",
      icon: departmentsIcon,
      link: "/departments/cardiology",
      description: "Heart and blood vessel disorders",
    },
    {
      id: 2,
      title: "Neurology",
      icon: radiologyIcon,
      link: "/departments/neurology",
      description: "Disorders of the nervous system",
    },
    {
      id: 3,
      title: "Orthopedics",
      icon: sessionsIcon,
      link: "/departments/orthopedics",
      description: "Musculoskeletal disorders",
    },
    {
      id: 4,
      title: "Pediatrics",
      icon: departmentsIcon,
      link: "/departments/pediatrics",
      description: "Medical care for infants and children",
    },
    {
      id: 5,
      title: "Ophthalmology",
      icon: radiologyIcon,
      link: "/departments/ophthalmology",
      description: "Eye disorders and diseases",
    },
    {
      id: 6,
      title: "Dermatology",
      icon: sessionsIcon,
      link: "/departments/dermatology",
      description: "Skin related disorders",
    },
    {
      id: 7,
      title: "ENT",
      icon: departmentsIcon,
      link: "/departments/ent",
      description: "Ear, nose and throat specialists",
    },
    {
      id: 8,
      title: "Gynecology",
      icon: radiologyIcon,
      link: "/departments/gynecology",
      description: "Women's health",
    },
  ];

  return (
    <div className="departments-container">
      <DepartmentNavbar />
      <div className="departments-content">
        <div className="departments-header">
          <h1>Medical Departments</h1>
          <p>Choose a department to continue</p>
        </div>
        <div className="departments-grid">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              title={department.title}
              icon={department.icon}
              link={department.link}
              description={department.description}
              className="department-item"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Departments;
