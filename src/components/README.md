# Motabaa Components

## Role-Based Rendering

The `RoleBasedRender.js` component provides a clean, declarative way to implement role-based access control (RBAC) in your React components. It allows you to conditionally render UI elements based on the user's role.

### Key Features

- **Declarative API**: Simple component-based approach to role-based rendering
- **Role Constants**: Uses centralized role definitions to avoid hardcoded strings
- **Flexible Configuration**: Support for both inclusion and exclusion patterns
- **Fallback Content**: Option to display alternative content for unauthorized users
- **Type-Safe**: Fully typed with JSDoc annotations

### Basic Usage

```jsx
import { DoctorOnly, PatientOnly } from './RoleBasedRender';

function MyComponent() {
  return (
    <div>
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

### Advanced Usage

For more advanced usage examples, see the [examples directory](./examples/README.md).

## Other Components

- `DashboardCard.js`: Card component used on the dashboard
- `PatientNavbar.js`: Navigation bar for the patient dashboard
- `SharedForm.js`: Reusable form component
- ... (other components)