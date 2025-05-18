import React from "react";
import PatientNavbar from "../components/PatientNavbar";
import DashboardCard from "../components/DashboardCard";
import "../pages/pagesStyles/Dashboard.css";

// Icons
import departmentsIcon from "../images/Mask group (1).png";
import radiologyIcon from "../images/Mask group.png";
import sessionsIcon from "../images/medical 1.png";

// Patient avatar
import patientAvatar from "../images/Patient 1.png";
import ShadowShape from "../components/ShadowShape";

const Dashboard = () => {
  const cards = [
    {
      id: 1,
      title: "DEPARTMENTS",
      icon: departmentsIcon,
      link: "/departments",
      className: "departments",
    },
    {
      id: 2,
      title: "RADIOLOGY AND LABORATORY TESTS",
      icon: radiologyIcon,
      link: "/radiology-labs",
      className: "radiology",
    },
    {
      id: 3,
      title: "MEDICAL SESSIONS",
      icon: sessionsIcon,
      link: "/sessions",
      className: "sessions",
    },
  ];

  return (
    <div className="dashboard-container">
      <PatientNavbar
        patientName="Mohamed Kamal"
        patientImage={patientAvatar}
      />
      <div className="dashboard-content">
        <div className="cards-container">
          {cards.map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              icon={card.icon}
              link={card.link}
              className={card.className}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
