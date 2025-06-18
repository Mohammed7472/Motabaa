import { useParams, useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import RectangleShape from "../components/RectangleShape";
import SharedForm from "../components/SharedForm";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";
import { useState, useEffect } from "react";
import "./pagesStyles/Register.css";
import api from "../services/api";

function Register() {
  const { option } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [specializationsLoading, setSpecializationsLoading] = useState(false);

  const [initialData, setInitialData] = useState(() => {
    const savedData = sessionStorage.getItem("registerFormData");
    return savedData ? JSON.parse(savedData) : {};
  });

  // Fetch specializations when component mounts and option is doctor
  useEffect(() => {
    if (option === "doctor") {
      fetchSpecializations();
    }
  }, [option]);

  // Function to fetch specializations from API
  const fetchSpecializations = async () => {
    try {
      setSpecializationsLoading(true);
      setError(null); // Clear any previous errors

      // Make the API call
      const response = await api.specialization.getAll();

      // Log the API response for debugging
      console.log("Specialization API response:", response);

      // Check if response exists and is an array
      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid API response format");
      }

      // Transform the data for dropdown options - handle both possible response formats
      const options = response
        .map((spec) => {
          const id = spec.specializationId || spec.id;
          const name = spec.specializationName || spec.name;

          // Validate each specialization
          if (!id || !name) {
            console.warn("Invalid specialization data:", spec);
            return null;
          }

          return {
            value: parseInt(id),
            label: name.trim(),
          };
        })
        .filter((opt) => opt !== null); // Remove any invalid entries

      // Validate we have options after transformation
      if (options.length === 0) {
        throw new Error("No valid specializations received from API");
      }

      console.log("Transformed specialization options:", options);
      setSpecializations(options);
    } catch (err) {
      console.error("Error fetching specializations:", err);
      setError("Failed to load specializations. Please try again later.");
      setSpecializations([]); // Clear any existing specializations
    } finally {
      setSpecializationsLoading(false);
    }
  };
  const commonInputs = [
    {
      icon: "bi-person-fill",
      placeholder: "Full Name",
      name: "fullName",
      required: true,
      minLength: 3, // Ensure name is at least 3 characters
      pattern: "^[A-Za-z. ]{3,50}$", // Allow letters, spaces, and dots for titles (e.g., "Dr.")
      title: "Please enter a valid full name",
    },
    {
      icon: "bi-envelope-fill",
      placeholder: "Email",
      name: "email",
      type: "email",
      required: true,
    },
    {
      icon: "bi-key-fill",
      placeholder: "Password",
      name: "password",
      type: "password",
      required: true,
    },
    {
      icon: "bi-calendar-fill",
      placeholder: "Age",
      name: "age",
      type: "number",
      required: true,
    },
    {
      icon: "bi-telephone-fill",
      placeholder: "Phone Number",
      name: "phone",
      required: true,
    },
    {
      icon: "bi-geo-alt-fill",
      placeholder: "Address",
      name: "address",
      required: true,
    },
    {
      icon: "bi-gender-ambiguous",
      name: "gender",
      showAsDropdown: false,
      required: true,
    },
  ];

  const doctorInputs = [
    commonInputs[0],
    {
      icon: "bi-person-badge-fill",
      placeholder: "Select Your Specialty",
      name: "specialty",
      type: "select",
      options: specializations,
      loading: specializationsLoading,
      required: true,
      valueType: "number", // Explicitly specify that the value should be a number
    },
    ...commonInputs.slice(1),
  ];

  const inputs = option === "doctor" ? doctorInputs : commonInputs;

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate full name
      if (!formData.fullName || formData.fullName.trim().length < 3) {
        setError("Please enter a valid full name (minimum 3 characters)");
        return;
      }

      // Store form data in session storage for potential use later
      sessionStorage.setItem("registerFormData", JSON.stringify(formData));

      // Prepare the request data - ensure userName is set from fullName
      console.log("Form data received:", formData);

      const requestData = {
        userName: formData.fullName.trim(), // Set userName directly from fullName, removing any extra spaces
        fullName: formData.fullName.trim(),
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        phoneNumber: formData.phone,
        address: formData.address,
        gender: formData.gender,
      };

      // Log the request data for verification
      console.log("Request data to be sent:", requestData); // Add specialty for doctor registration
      if (option === "doctor") {
        // Validate the specialty selection
        if (!formData.specialty || !formData.specialty.value) {
          setError("Please select a specialization");
          return;
        }

        // Ensure specializationId is sent as a number
        const specializationId = parseInt(formData.specialty.value);
        if (isNaN(specializationId) || specializationId <= 0) {
          setError("Invalid specialization selected");
          return;
        }

        requestData.specializationId = specializationId;
        console.log(
          "Sending doctor registration with specializationId:",
          requestData.specializationId
        );
      }

      // Use the API client instead of fetch
      let data;
      if (option === "doctor") {
        data = await api.auth.registerDoctor(requestData);
      } else {
        data = await api.auth.registerPatient(requestData);
      }

      console.log("Registration successful:", data);

      // Store user data including any tokens returned from the API
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Store user role based on registration type
      localStorage.setItem(
        "userRole",
        option === "doctor" ? "Doctor" : "Patient"
      );

      // Store user data if available
      if (data.user) {
        // Make sure specialty is included for doctors
        if (option === "doctor" && formData.specialty) {
          // Add specialty to user data
          data.user.specialty = formData.specialty;

          // If specialty is an object with label/value (from dropdown), use the label
          if (
            typeof data.user.specialty === "object" &&
            data.user.specialty.label
          ) {
            data.user.specialty = data.user.specialty.label;
          }
        }

        localStorage.setItem("userData", JSON.stringify(data.user));

        // Dispatch a storage event to notify other components of the change
        window.dispatchEvent(new Event("storage"));
      }

      // Navigate to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="logo-container">
        <Link to="/">
          <Logo v={"150px"} h={"150px"} bgColor={"#2E99DC"} />
        </Link>
      </div>

      <div className="register-header">
        <h1 className="register-title">
          {option === "doctor" ? "Doctor Registration" : "Patient Registration"}
        </h1>
        <p className="register-subtitle">
          Create your account to join our healthcare platform
        </p>
      </div>

      <div className="container">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <SharedForm
          title={`Create Account`}
          headerIcon="bi-person-badge"
          inputs={inputs}
          showProfileUpload={true}
          showSocialLogin={true}
          socialIcons={{ facebook, google: gmail }}
          onSubmit={handleFormSubmit}
          initialData={initialData}
          useResponsiveGrid={true}
          isLoading={isLoading}
          createAccountLink={{
            url: "/login",
            text: "Already have an account? Login",
          }}
        />
      </div>

      <div className="back-link">
        <Link to="/register-as">
          <i className="bi bi-arrow-left"></i> Back
        </Link>
      </div>

      <RectangleShape />
    </div>
  );
}

export default Register;
