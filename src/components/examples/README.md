# Role-Based Rendering in Motabaa

This directory contains example components that demonstrate how to implement role-based access control (RBAC) in the Motabaa application.

## Available Components

### Base Component

- `RoleBasedRender`: The core component for conditional rendering based on user roles

### Role-Specific Components

- `DoctorOnly`: Only renders content for doctors
- `PatientOnly`: Only renders content for patients
- `AdminOnly`: Only renders content for admins

### Role Exclusion Components

- `NotDoctor`: Hides content from doctors
- `NotPatient`: Hides content from patients

## Usage Examples

### Basic Usage

```jsx
import { DoctorOnly, PatientOnly } from '../components/RoleBasedRender';

function MyComponent() {
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      
      <DoctorOnly>
        <p>This content is only visible to doctors</p>
      </DoctorOnly>
      
      <PatientOnly>
        <p>This content is only visible to patients</p>
      </PatientOnly>
    </div>
  );
}
```

### With Fallback Content

```jsx
import { DoctorOnly } from '../components/RoleBasedRender';

function MyComponent() {
  return (
    <DoctorOnly 
      fallback={true}
      fallbackContent={<p>You need to be a doctor to view this content</p>}
    >
      <p>Doctor-specific content here</p>
    </DoctorOnly>
  );
}
```

### Custom Role Configuration

```jsx
import { RoleBasedRender, USER_ROLES } from '../components/RoleBasedRender';

function MyComponent() {
  return (
    <RoleBasedRender allowedRoles={[USER_ROLES.DOCTOR, USER_ROLES.ADMIN]}>
      <p>This content is visible to both doctors and admins</p>
    </RoleBasedRender>
  );
}
```

## Best Practices

1. **Use Role Constants**: Always use the `USER_ROLES` constants from UserContext instead of hardcoding role strings
2. **Component Composition**: Prefer composing multiple role-based components over complex conditional logic
3. **Fallback Content**: Consider providing fallback content for better UX when a user doesn't have access
4. **Loading States**: Handle loading states appropriately to prevent flickering during authentication

See the `RoleBasedExample.js` component for more detailed examples.