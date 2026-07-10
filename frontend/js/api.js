/**
 * Swind Platform — API Client
 * 
 * Single point for all API communication.
 * Wraps fetch() with JSON handling and auth token attachment.
 */

const API_BASE = '';  // Same origin; relative paths

/**
 * Make an API request.
 * 
 * @param {string} endpoint  - API path, e.g. '/api/auth/login'
 * @param {string} method    - HTTP method
 * @param {object|null} body - Request body (will be JSON-stringified)
 * @returns {Promise<object>} Parsed JSON response
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Attach auth token if present
  const token = localStorage.getItem('swind_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      // Throw with the server message so callers can display it
      const error = new Error(data.detail || data.message || 'Something went wrong.');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Re-throw API errors as-is
    if (err.status) throw err;

    // Network / parsing errors
    const networkError = new Error('Network error. Please check your connection.');
    networkError.status = 0;
    throw networkError;
  }
}
