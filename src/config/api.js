// Frontend configuration for API endpoints
// This replaces database connection for frontend-only apps

const API_CONFIG = {
  // Backend server URL - updated to use real backend
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com/api' 
    : 'http://localhost:5001/api',
  
  // Static files URL for images
  STATIC_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com' 
    : 'http://localhost:5001',
  
  // Timeout for API requests
  TIMEOUT: 10000
}

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-avatar.svg'
  if (imagePath.startsWith('http')) return imagePath
  return `${API_CONFIG.STATIC_URL}${imagePath}`
}

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: (token) => `/auth/verify-email/${token}`,
    RESEND_VERIFICATION: '/auth/resend-verification',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
    CHANGE_PASSWORD: '/auth/change-password',
    GET_ME: '/auth/me',
    GET_PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile'
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
  },
  CONTACT: {
    SEND: '/contact/send'
  }
}

export { API_CONFIG }
export default API_CONFIG
