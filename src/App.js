import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RegisterAs from "./pages/RegisterAs";
import PatientInformation from "./pages/PatientInformation";
import HealthDetails from "./pages/HealthDetails";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import MedicalSessions from "./pages/MedicalSessions";
import AddMedicalSession from "./pages/AddMedicalSession";
import PrescriptionConfirmation from "./pages/PrescriptionConfirmation";
import RadiologyLabs from "./pages/RadiologyLabs";
import AddRadiologyLab from "./pages/AddRadiologyLab";
import LabReportDetails from "./pages/LabReportDetails";
import PatientDetails from "./pages/PatientDetails";
import Services from "./pages/Services";
import AllergiesPage from "./pages/AllergiesPage";
import PatientAllergies from "./pages/PatientAllergies";
import ChronicDiseases from "./pages/ChronicDiseases";
import MedicalTests from "./pages/MedicalTests";
import MedicalHistory from "./pages/MedicalHistory";
import { UserProvider } from "./context/UserContext";
import DoctorDetails from "./pages/DoctorDetails";
import PrescriptionsByDepartment from "./pages/PrescriptionsByDepartment";

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterAs />} />
            <Route path="/healthDetails" element={<HealthDetails />} />
            <Route path="/register/:option" element={<Register />} />
            <Route
              path="/register/:option/info"
              element={<PatientInformation />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />

            <Route path="/sessions" element={<MedicalSessions />} />
            <Route path="/sessions/add" element={<AddMedicalSession />} />
            <Route path="/radiology-labs" element={<RadiologyLabs />} />
            <Route path="/radiology-labs/add" element={<AddRadiologyLab />} />
            <Route path="/allergies" element={<AllergiesPage />} />
            <Route path="/patient-details" element={<PatientDetails />} />
            <Route path="/patient-allergies" element={<PatientAllergies />} />
            <Route path="/chronic-diseases" element={<ChronicDiseases />} />
            <Route path="/medical-tests" element={<MedicalTests />} />
            <Route path="/medical-history" element={<MedicalHistory />} />
            <Route path="/doctor-details" element={<DoctorDetails />} />
            <Route
              path="/prescriptions-by-department"
              element={<PrescriptionsByDepartment />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </HashRouter>
    </UserProvider>
  );
}

export default App;
