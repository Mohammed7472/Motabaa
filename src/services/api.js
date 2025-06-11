const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://motab3aa.runasp.net'
  : '';

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
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Get auth token if available
    const token = localStorage.getItem('authToken');
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
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw {
            status: response.status,
            data,
            message: data.message || 'API request failed',
          };
        }
        
        return data;
      } else {
        // Handle non-JSON response (like HTML)
        const text = await response.text();
        throw {
          status: response.status,
          message: 'Invalid response format (expected JSON)',
          data: text,
        };
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  // Auth endpoints
  auth: {
    login: (data) => api.request('/api/Account/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    registerPatient: (data) => api.request('/api/Account/PatientRegister', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    registerDoctor: (data) => api.request('/api/Account/DoctorRegister', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },
  
  // Add more API endpoints as needed
};

export default api;