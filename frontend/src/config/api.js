// API base URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  GOOGLE_LOGIN: `${API_URL}/api/auth/google`,
  GET_USER: `${API_URL}/api/auth/me`,
  LOGOUT: `${API_URL}/api/auth/logout`,
};
