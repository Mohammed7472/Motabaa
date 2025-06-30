const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://motab3aa.runasp.net";

const api = {
  medicalTest: {
    delete: async function (id) {
      if (!id) throw new Error("Missing test id");
      return api.request(`/api/MedicalTest?id=${id}`, {
        method: "DELETE",
      });
    },
  },
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

    // ...existing code...
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // ...existing code...
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

      // ...existing code...
      let responseText = "";
      try {
        responseText = await response.clone().text();
      } catch (textError) {
        responseText = "Unable to read response";
      }

      // ...existing code...
      let data = null;
      let parseError = null;

      if (responseText && responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (err) {
          parseError = err;
          // ...existing code...
        }
      }

      // ...existing code...
      if (response.ok) {
        // ...existing code...
        if (data !== null) {
          return data;
        }

        // ...existing code...
        return responseText || {};
      }

      // ...existing code...
      // ...existing code...
      if (data !== null) {
        // ...existing code...
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
        // ...existing code...
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
        // ...existing code...
        else {
          throw {
            status: response.status,
            data,
            message: "API request failed with status " + response.status,
            originalText: responseText,
          };
        }
      }

      // ...existing code...
      throw {
        status: response.status,
        message: `Request failed with status ${response.status}`,
        data: responseText,
        contentType,
        parseError: parseError ? parseError.message : null,
      };
    } catch (error) {
      // ...existing code...
      if (error.status) {
        throw error;
      }

      // Handle network errors or other exceptions
      // ...existing code...
      throw {
        status: 0,
        message: error.message || "Network error or request failed",
        originalError: error,
      };
    }
  },

  // ...existing code...
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

  // ...existing code...
  search: {
    searchByName: (name) =>
      api.request(
        `/api/Account/SearchByName?Name=${encodeURIComponent(name)}`,
        {
          method: "GET",
        }
      ),
  },

  // ...existing code...
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

        // ...existing code...
        if (!Array.isArray(data)) {
          throw new Error("Invalid specialization data format");
        }

        // Map and validate each specialization
        return data
          .map((spec) => {
            // ...existing code...
            if (
              !spec ||
              (!spec.id && !spec.specializationId) ||
              (!spec.name && !spec.specializationName)
            ) {
              // ...existing code...
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
        // ...existing code...
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
        // ...existing code...
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
