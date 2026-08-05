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
export async function apiRequest(endpoint, method = 'GET', body = null) {
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
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // 401 Unauthorized handling: Clear stale token & notify app
      if (response.status === 401 && endpoint !== '/api/auth/login' && endpoint !== '/api/auth/signup') {
        localStorage.removeItem('swind_token');
        localStorage.removeItem('swind_user_name');
        localStorage.removeItem('swind_user_email');
        window.dispatchEvent(new Event('swind:unauthorized'));
      }

      const error = new Error(data.detail || data.message || 'Something went wrong.');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.status) throw err;

    const networkError = new Error('Network error. Please check your connection.');
    networkError.status = 0;
    throw networkError;
  }
}
