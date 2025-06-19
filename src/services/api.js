// API Base URL configuration
// In development: Uses REACT_APP_API_URL from .env or defaults to empty string (relative to current domain)
// In production: Uses REACT_APP_API_URL from .env.production or defaults to your production API URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://your-backend-domain.com"
    : "");

const api = {
  /**
   * Make an API request with proper error handling
   * @param {string} endpoint - The API endpoint (starting with /)
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} - The response data
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    // Set default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Get auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw {
            status: response.status,
            data,
            message: data.message || "API request failed",
          };
        }

        return data;
      } else {
        // Handle non-JSON response (like HTML)
        const text = await response.text();
        throw {
          status: response.status,
          message: "Invalid response format (expected JSON)",
          data: text,
        };
      }
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    login: (data) =>
      api.request("/api/Account/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    registerPatient: (data) =>
      api.request("/api/Account/PatientRegister", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    registerDoctor: (data) =>
      api.request("/api/Account/DoctorRegister", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Patient endpoints
  patient: {
    getProfile: (patientId) =>
      api.request(`/api/Patient/Profile/${patientId}`, {
        method: "GET",
      }),
  },

  // Specialization endpoints
  specialization: {
    getAll: async () => {
      try {
        const data = await api.request("/api/Specialization", {
          method: "GET",
        });

        // Validate the response format
        if (!Array.isArray(data)) {
          throw new Error("Invalid specialization data format");
        }

        // Map and validate each specialization
        return data
          .map((spec) => {
            // Ensure we have both an ID and name
            if (!spec || (!spec.id && !spec.specializationId) || (!spec.name && !spec.specializationName)) {
              console.warn("Invalid specialization entry:", spec);
              return null;
            }

            // Return the specialization with consistent property names
            return {
              id: spec.id || spec.specializationId,
              name: spec.name || spec.specializationName,
              // Keep original properties for backward compatibility
              specializationId: spec.id || spec.specializationId,
              specializationName: spec.name || spec.specializationName
            };
          })
          .filter(Boolean); // Remove null entries
      } catch (error) {
        console.error("Error fetching specializations:", error);
        throw new Error(error.message || "Failed to fetch specializations");
      }
    },

    getById: async (id) => {
      try {
        const data = await api.request(`/api/Specialization/${id}`, {
          method: "GET",
        });

        if (!data || (!data.specializationName && !data.name)) {
          throw new Error("Invalid specialization data");
        }

        return {
          id: data.specializationId || data.id,
          name: data.specializationName || data.name,
        };
      } catch (error) {
        console.error(`Error fetching specialization ${id}:`, error);
        throw new Error(
          error.message || "Failed to fetch specialization details"
        );
      }
    },
  },

  // Add more API endpoints as needed
};

export default api;
