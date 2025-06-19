import React from 'react';
import { useUser, USER_ROLES } from '../../context/UserContext';
import { 
  RoleBasedRender, 
  DoctorOnly, 
  PatientOnly, 
  AdminOnly,
  NotDoctor,
  NotPatient 
} from '../RoleBasedRender';

/**
 * This is an example component demonstrating different ways to use 
 * the RoleBasedRender components for conditional rendering based on user roles.
 */
const RoleBasedExample = () => {
  const { userRole } = useUser();

  return (
    <div className="role-based-example">
      <h2>Role-Based Rendering Examples</h2>
      <p>Your current role: <strong>{userRole || 'Not logged in'}</strong></p>

      {/* Example 1: Using role-specific components */}
      <section>
        <h3>Example 1: Role-Specific Components</h3>
        
        <DoctorOnly>
          <div className="doctor-content">
            <h4>Doctor-Only Content</h4>
            <p>This content is only visible to doctors.</p>
          </div>
        </DoctorOnly>

        <PatientOnly>
          <div className="patient-content">
            <h4>Patient-Only Content</h4>
            <p>This content is only visible to patients.</p>
          </div>
        </PatientOnly>

        <AdminOnly>
          <div className="admin-content">
            <h4>Admin-Only Content</h4>
            <p>This content is only visible to admins.</p>
          </div>
        </AdminOnly>
      </section>

      {/* Example 2: Using exclusion components */}
      <section>
        <h3>Example 2: Role Exclusion</h3>
        
        <NotDoctor>
          <div className="not-doctor-content">
            <h4>Non-Doctor Content</h4>
            <p>This content is hidden from doctors but visible to everyone else.</p>
          </div>
        </NotDoctor>

        <NotPatient>
          <div className="not-patient-content">
            <h4>Non-Patient Content</h4>
            <p>This content is hidden from patients but visible to everyone else.</p>
          </div>
        </NotPatient>
      </section>

      {/* Example 3: Using the base RoleBasedRender component with custom roles */}
      <section>
        <h3>Example 3: Custom Role Configuration</h3>
        
        <RoleBasedRender allowedRoles={[USER_ROLES.DOCTOR, USER_ROLES.ADMIN]}>
          <div className="custom-allowed-content">
            <h4>Doctor & Admin Content</h4>
            <p>This content is visible to both doctors and admins.</p>
          </div>
        </RoleBasedRender>

        <RoleBasedRender excludedRoles={[USER_ROLES.PATIENT]}>
          <div className="custom-excluded-content">
            <h4>Staff-Only Content</h4>
            <p>This content is hidden from patients.</p>
          </div>
        </RoleBasedRender>
      </section>

      {/* Example 4: Using fallback content */}
      <section>
        <h3>Example 4: Fallback Content</h3>
        
        <DoctorOnly 
          fallback={true} 
          fallbackContent={
            <div className="fallback-content">
              <p>You need to be a doctor to view this content.</p>
            </div>
          }
        >
          <div className="with-fallback-content">
            <h4>Doctor Content with Fallback</h4>
            <p>This content shows a fallback message for non-doctors.</p>
          </div>
        </DoctorOnly>
      </section>
    </div>
  );
};

export default RoleBasedExample;