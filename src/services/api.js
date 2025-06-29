const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://motab3aa.runasp.net";
console.log("🔍 API_BASE_URL:", API_BASE_URL);

const api = {
  /**
   * Make an API request with proper error handling
   * @param {string} endpoint - The API endpoint (starting with /)
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} - The response data

   * Make an API request with enhanced error handling for various response formats
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

    // Get auth token if available (try sessionStorage first, then localStorage)
    const token =
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get("content-type") || "";

      // First, try to get the response text to avoid losing it if JSON parsing fails
      let responseText = "";
      try {
        responseText = await response.clone().text();
      } catch (textError) {
        console.warn("Could not read response text:", textError);
        responseText = "Unable to read response";
      }

      // Attempt to parse as JSON regardless of content type
      let data = null;
      let parseError = null;

      if (responseText && responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (err) {
          parseError = err;
          // Don't throw here - we'll handle this gracefully below
        }
      }

      // Handle successful responses
      if (response.ok) {
        // If we successfully parsed JSON, return it
        if (data !== null) {
          return data;
        }

        // If not JSON but response is OK, return the text or an empty object
        return responseText || {};
      }

      // Handle error responses
      // Case 1: We have valid JSON error data
      if (data !== null) {
        // Handle RFC9110 problem+json format
        if (data.type && (data.title || data.detail)) {
          throw {
            status: response.status,
            data,
            message: data.title || data.detail || "API request failed",
            validationErrors: data.errors || null,
            type: data.type,
            isValidationError: response.status === 400 && data.errors,
            originalText: responseText,
          };
        }
        // Handle standard API error responses
        else if (data.message || data.error || data.errors) {
          throw {
            status: response.status,
            data,
            message: data.message || data.error || "API request failed",
            validationErrors: data.errors || null,
            isValidationError: response.status === 400 && data.errors,
            originalText: responseText,
          };
        }
        // Any other JSON error format
        else {
          throw {
            status: response.status,
            data,
            message: "API request failed with status " + response.status,
            originalText: responseText,
          };
        }
      }

      // Case 2: We couldn't parse JSON but have a response
      throw {
        status: response.status,
        message: `Request failed with status ${response.status}`,
        data: responseText,
        contentType,
        parseError: parseError ? parseError.message : null,
      };
    } catch (error) {
      // If this is already our formatted error, just rethrow it
      if (error.status) {
        throw error;
      }

      // Handle network errors or other exceptions
      console.error("API request failed:", error);
      throw {
        status: 0,
        message: error.message || "Network error or request failed",
        originalError: error,
      };
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

  // Search endpoints
  search: {
    searchByName: (name) =>
      api.request(
        `/api/Account/SearchByName?Name=${encodeURIComponent(name)}`,
        {
          method: "GET",
        }
      ),
  },

  // Patient endpoints
  patient: {
    getProfile: (patientId) =>
      api.request(`/api/Patient/Profile/${patientId}`, {
        method: "GET",
      }),

    getAllergies: async (patientId) => {
      return api.request(`/api/Allergens?patientId=${patientId}`, {
        method: "GET",
      });
    },

    getMedicalTests: async (patientId) => {
      return api.request(`/api/MedicalTest?Patientid=${patientId}`, {
        method: "GET",
      });
    },

    addAllergy: async (data) => {
      const payload = {
        patientId: data.patientId,
        name: data.allergenName || data.name,
        patientName: data.patientName,
      };

      console.log("Sending allergy data:", payload);

      return api.request("/api/Allergens", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    deleteAllergy: async (allergyId, patientId) => {
      if (!allergyId || !patientId) {
        throw new Error("Missing allergyId or patientId");
      }
      const endpoint = `/api/Allergens?id=${allergyId}&patientId=${encodeURIComponent(
        patientId
      )}`;
      return api.request(endpoint, {
        method: "DELETE",
      });
    },
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
            if (
              !spec ||
              (!spec.id && !spec.specializationId) ||
              (!spec.name && !spec.specializationName)
            ) {
              console.warn("Invalid specialization entry:", spec);
              return null;
            }

            // Return the specialization with consistent property names
            return {
              id: spec.id || spec.specializationId,
              name: spec.name || spec.specializationName,
              // Keep original properties for backward compatibility
              specializationId: spec.id || spec.specializationId,
              specializationName: spec.name || spec.specializationName,
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

  // Chronic Diseases endpoints
  chronicDiseases: {
    getAll: async (patientId) => {
      return api.request(
        `/api/ChronicDiseases?patientId=${encodeURIComponent(patientId)}`,
        {
          method: "GET",
        }
      );
    },
    add: async (data) => {
      const payload = {
        name: data.diseaseName || data.name,
        patientId: data.patientId,
        patientName: data.patientName,
      };
      return api.request("/api/ChronicDiseases", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    deleteDisease: async (diseaseId, patientId) => {
      if (!diseaseId || !patientId) {
        throw new Error("Missing diseaseId or patientId");
      }
      const endpoint = `/api/ChronicDiseases?id=${diseaseId}&patientId=${encodeURIComponent(
        patientId
      )}`;
      return api.request(endpoint, {
        method: "DELETE",
      });
    },
  },

  // Prescriptions endpoints
  prescriptions: {
    getByPatientAndSpecialization: async (patientId, specializationId) => {
      if (!patientId || !specializationId)
        throw new Error("Missing patientId or specializationId");
      // Use the correct endpoint and query params as in the old code
      return api.request(
        `/api/Roshta?Departmentid=${encodeURIComponent(
          specializationId
        )}&Patientid=${encodeURIComponent(patientId)}`,
        {
          method: "GET",
        }
      );
    },
  },

  // Add more API endpoints as needed
};

export default api;
