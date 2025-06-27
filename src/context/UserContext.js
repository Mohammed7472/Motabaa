import React, { createContext, useState, useEffect, useContext } from "react";

// Define role constants for better maintainability
export const USER_ROLES = {
  DOCTOR: "Doctor",
  PATIENT: "Patient",
  ADMIN: "Admin",
};

const UserContext = createContext(null);

// Custom hook for accessing user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hydrate userData and userRole from sessionStorage on mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUserData = sessionStorage.getItem("userData");
      const storedUserRole = sessionStorage.getItem("userRole");
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
      if (storedUserRole) {
        setUserRole(storedUserRole);
      }
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setUserRole(null);
    }
    setIsLoading(false);
  }, []);

  // Keep sessionStorage in sync if userData or userRole changes
  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
    if (userRole) {
      sessionStorage.setItem("userRole", userRole);
    }
  }, [userData, userRole]);

  // Function to update user data (both in state and sessionStorage)
  const updateUserData = (data) => {
    if (!data) {
      sessionStorage.removeItem("userData");
      setUserData(null);
    } else {
      sessionStorage.setItem("userData", JSON.stringify(data));
      setUserData(data);
    }
    window.dispatchEvent(new Event("userData"));
  };

  // Function to handle user login
  const loginUser = (userData, token, role) => {
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("userRole", role);
    setUserRole(role);
    updateUserData(userData);
  };

  // Function to handle user logout
  const logoutUser = () => {
    sessionStorage.clear();
    setUserRole(null);
    updateUserData(null);
  };

  // Role-based utility functions
  const hasRole = (role) => userRole === role;
  const isDoctor = () => hasRole(USER_ROLES.DOCTOR);
  const isPatient = () => hasRole(USER_ROLES.PATIENT);
  const isAdmin = () => hasRole(USER_ROLES.ADMIN);

  return (
    <UserContext.Provider
      value={{
        userData,
        userRole,
        isLoading,
        error,
        updateUserData,
        loginUser,
        logoutUser,
        isAuthenticated: !!userData,
        hasRole,
        isDoctor,
        isPatient,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
