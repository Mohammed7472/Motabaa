import { useUser } from '../context/UserContext';

function Login() {
  const { loginUser } = useUser();
  
  const handleLoginSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Make API callimport { useUser } from '../context/UserContext';

const Dashboard = () => {
  const { userData, isLoading, error, logoutUser } = useUser();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !userData) {
      navigate('/login');
    }
  }, [userData, isLoading, navigate]);

  // Handle loading state
  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">
          {error}
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary mt-3"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Get user role
  const userRole = userData?.role;

  // Get user avatar with fallback
  const getUserAvatar = () => {
    if (userData?.profileImage) {
      return userData.profileImage;
    }
    return userRole === "Doctor" ? doctorAvatar : patientAvatar;
  };

  // Format user name with proper title
  const formatUserName = () => {
    if (!userData?.fullName && !userData?.userName) {
      return "User";
    }
    const name = userData.fullName || userData.userName;
    return userRole === "Doctor" ? `Dr. ${name}` : name;
  };

  // Rest of your component using userData directly from context
  return (
    <div className="dashboard-container">
      <PatientNavbar
        patientName={formatUserName()}
        patientImage={getUserAvatar()}
        isDoctor={userRole === "Doctor"}
        onLogout={logoutUser}
        userData={userData}
      />
      
      {/* Rest of your dashboard UI */}
    </div>
  );
};
      const response = await api.auth.login(requestData);
      
      if (!response || !response.token) {
        throw new Error("Invalid response from server");
      }

      // Create user data object
      const userData = {
        id: response.id,
        email: response.email,
        userName: response.userName,
        fullName: response.userName,
        role: response.role,
        // Add other fields as needed
      };

      // Use the context to update user data
      loginUser(userData, response.token, response.role);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };
  
  // Rest of your component
}