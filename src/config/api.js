// Frontend configuration for API endpoints
// This replaces database connection for frontend-only apps

const API_CONFIG = {
  // If you add a backend later, change this to your server URL
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com/api' 
    : 'http://localhost:5000/api',
  
  // Timeout for API requests
  TIMEOUT: 10000,
  
  // Mock mode - set to false when you have a real backend
  USE_MOCK_DATA: true
}

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    TOGGLE_STATUS: (id) => `/users/${id}/toggle-status`
  },
  POSTS: {
    GET_ALL: '/posts',
    GET_BY_ID: (id) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id) => `/posts/${id}`,
    DELETE: (id) => `/posts/${id}`,
    VOTE: (id) => `/posts/${id}/vote`
  },
  COMMENTS: {
    GET_BY_POST: (postId) => `/posts/${postId}/comments`,
    CREATE: (postId) => `/posts/${postId}/comments`,
    DELETE: (postId, commentId) => `/posts/${postId}/comments/${commentId}`
  }
}

export default API_CONFIG
