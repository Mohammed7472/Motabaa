import React, { createContext, useState, useEffect, useContext } from 'react';

// Define role constants for better maintainability
export const USER_ROLES = {
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  ADMIN: 'Admin'
};

const UserContext = createContext(null);

// Custom hook for accessing user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from localStorage on initial mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        const storedRole = localStorage.getItem('userRole');
        
        if (!token || !storedRole) {
          // Clear user data if no token or role
          setUserData(null);
          setUserRole(null);
          return;
        }
        
        // Parse user data from localStorage
        const storedUserData = JSON.parse(localStorage.getItem('userData') || 'null');
        if (storedUserData && storedUserData.id) {
          setUserData(storedUserData);
          setUserRole(storedRole); // Set the role in state for easier access
        } else {
          setUserData(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError(err.message);
        setUserData(null);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load data initially
    loadUserData();
    
    // Set up event listener for storage changes
    window.addEventListener('userData', loadUserData);
    window.addEventListener('storage', loadUserData);
    
    return () => {
      window.removeEventListener('userData', loadUserData);
      window.removeEventListener('storage', loadUserData);
    };
  }, []);
  
  // Function to update user data (both in state and localStorage)
  const updateUserData = (data) => {
    if (!data) {
      localStorage.removeItem('userData');
      setUserData(null);
    } else {
      localStorage.setItem('userData', JSON.stringify(data));
      setUserData(data);
    }
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('userData'));
  };
  
  // Function to handle user login
  const loginUser = (userData, token, role) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    setUserRole(role);
    updateUserData(userData);
  };
  
  // Function to handle user logout
  const logoutUser = () => {
    localStorage.clear();
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
        isAdmin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;