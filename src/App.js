import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import DepartmentDetails from "./pages/DepartmentDetails";
import MedicalSessions from "./pages/MedicalSessions";
import AddMedicalSession from "./pages/AddMedicalSession";
import PrescriptionConfirmation from "./pages/PrescriptionConfirmation";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
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
          <Route
            path="/departments/:departmentId"
            element={<DepartmentDetails />}
          />
          <Route path="/sessions" element={<MedicalSessions />} />
          <Route path="/sessions/add" element={<AddMedicalSession />} />
          <Route
            path="/prescription-confirmation"
            element={<PrescriptionConfirmation />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
