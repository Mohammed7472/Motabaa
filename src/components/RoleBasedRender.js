import React from 'react';
import { useUser, USER_ROLES } from '../context/UserContext';

/**
 * RoleBasedRender - A component for conditionally rendering content based on user roles
 * 
 * @param {Object} props
 * @param {string|string[]} props.allowedRoles - Single role or array of roles allowed to see the content
 * @param {string|string[]} props.excludedRoles - Single role or array of roles NOT allowed to see the content
 * @param {boolean} props.fallback - Whether to render fallback content for unauthorized users
 * @param {React.ReactNode} props.children - The content to conditionally render
 * @param {React.ReactNode} props.fallbackContent - Content to show for unauthorized users
 * @returns {React.ReactNode|null}
 */
const RoleBasedRender = ({
  allowedRoles,
  excludedRoles,
  fallback = false,
  children,
  fallbackContent = null
}) => {
  const { userRole, isAuthenticated } = useUser();
  
  // If user is not authenticated, don't render anything
  if (!isAuthenticated) return null;
  
  // Convert single roles to arrays for consistent handling
  const allowedRolesArray = allowedRoles ? (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]) : null;
  const excludedRolesArray = excludedRoles ? (Array.isArray(excludedRoles) ? excludedRoles : [excludedRoles]) : null;
  
  // Check if user has an allowed role (if specified)
  const hasAllowedRole = !allowedRolesArray || allowedRolesArray.includes(userRole);
  
  // Check if user has an excluded role (if specified)
  const hasExcludedRole = excludedRolesArray && excludedRolesArray.includes(userRole);
  
  // Determine if content should be rendered
  const shouldRender = hasAllowedRole && !hasExcludedRole;
  
  // Return appropriate content
  if (shouldRender) {
    return children;
  } else if (fallback) {
    return fallbackContent;
  } else {
    return null;
  }
};

/**
 * DoctorOnly - A component that only renders content for doctors
 */
export const DoctorOnly = ({ children, fallback = false, fallbackContent = null }) => (
  <RoleBasedRender 
    allowedRoles={USER_ROLES.DOCTOR}
    fallback={fallback}
    fallbackContent={fallbackContent}
  >
    {children}
  </RoleBasedRender>
);

/**
 * PatientOnly - A component that only renders content for patients
 */
export const PatientOnly = ({ children, fallback = false, fallbackContent = null }) => (
  <RoleBasedRender 
    allowedRoles={USER_ROLES.PATIENT}
    fallback={fallback}
    fallbackContent={fallbackContent}
  >
    {children}
  </RoleBasedRender>
);

/**
 * AdminOnly - A component that only renders content for admins
 */
export const AdminOnly = ({ children, fallback = false, fallbackContent = null }) => (
  <RoleBasedRender 
    allowedRoles={USER_ROLES.ADMIN}
    fallback={fallback}
    fallbackContent={fallbackContent}
  >
    {children}
  </RoleBasedRender>
);

/**
 * NotDoctor - A component that hides content from doctors
 */
export const NotDoctor = ({ children, fallback = false, fallbackContent = null }) => (
  <RoleBasedRender 
    excludedRoles={USER_ROLES.DOCTOR}
    fallback={fallback}
    fallbackContent={fallbackContent}
  >
    {children}
  </RoleBasedRender>
);

/**
 * NotPatient - A component that hides content from patients
 */
export const NotPatient = ({ children, fallback = false, fallbackContent = null }) => (
  <RoleBasedRender 
    excludedRoles={USER_ROLES.PATIENT}
    fallback={fallback}
    fallbackContent={fallbackContent}
  >
    {children}
  </RoleBasedRender>
);

export default RoleBasedRender;