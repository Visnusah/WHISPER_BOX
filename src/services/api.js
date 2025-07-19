// Frontend API service for handling data operations
// Connects to real backend API with email verification

import { API_CONFIG } from '../config/api'

// Get auth tokens from localStorage
const getAuthToken = () => localStorage.getItem('accessToken')
const getRefreshToken = () => localStorage.getItem('refreshToken')

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// API request wrapper with auto token refresh
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  const config = {
    headers: getAuthHeaders(),
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      // Handle token expiry
      if (response.status === 401 && data.message?.includes('expired')) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          // Retry the original request with new token
          config.headers = getAuthHeaders()
          const retryResponse = await fetch(url, config)
          const retryData = await retryResponse.json()
          
          if (!retryResponse.ok) {
            const error = new Error(retryData.message || 'API request failed')
            error.status = retryResponse.status
            error.response = { status: retryResponse.status, data: retryData }
            throw error
          }
          
          return retryData
        }
      }
      
      const error = new Error(data.message || 'API request failed')
      error.status = response.status
      error.response = { status: response.status, data }
      throw error
    }
    
    return data
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle network errors
    if (!navigator.onLine) {
      const networkError = new Error('No internet connection')
      networkError.type = 'NETWORK_ERROR'
      throw networkError
    }
    
    // Re-throw with additional context
    if (!error.status && error.message.includes('fetch')) {
      error.type = 'NETWORK_ERROR'
    }
    
    throw error
  }
}

// Refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token')
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      return true
    }

    // Refresh failed, clear tokens and redirect to login
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return false
  } catch (error) {
    console.error('Token refresh failed:', error)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return false
  }
}

// Authentication API
export const authAPI = {
  async signup(email, password, fullName) {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName })
    })
    
    return response
  },

  async verifyEmail(token) {
    return await apiRequest(`/auth/verify-email/${token}`)
  },

  async sendOTP(email) {
    return await apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  async verifyOTP(email, otpCode) {
    return await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otpCode })
    })
  },

  async resendOTP(email) {
    return await apiRequest('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  async resendVerification(email) {
    return await apiRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  async login(email, password) {
    // Clear any existing tokens before attempting login
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      
      // Only store tokens if login is completely successful
      if (response.success && response.data && response.data.user && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response
      } else {
        // If response doesn't have proper data, treat as failure
        throw new Error('Invalid login response')
      }
    } catch (error) {
      // Ensure no tokens are stored on any error
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      throw error
    }
  },

  async forgotPassword(email) {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  async resetPassword(token, password) {
    return await apiRequest(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password })
    })
  },

  async changePassword(currentPassword, newPassword) {
    return await apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    })
  },

  async getProfile() {
    return await apiRequest('/auth/profile')
  },

  async updateProfile(profileData) {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  },

  async uploadProfileImage(imageFile) {
    const formData = new FormData()
    formData.append('profileImage', imageFile)

    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/upload-profile-picture`, {
      method: 'POST',
      headers: {
        ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to upload profile image')
      error.status = response.status
      error.response = { status: response.status, data }
      throw error
    }

    return data
  },

  async getMe() {
    return await apiRequest('/auth/me')
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }
}

// Posts API
export const postsAPI = {
  async getAllPosts() {
    const response = await apiRequest('/posts')
    if (response.success && response.data && response.data.posts) {
      return response.data.posts // Return just the posts array for backward compatibility
    }
    return [] // Return empty array if no posts or error
  },

  async getTrendingPosts() {
    const response = await apiRequest('/posts/trending')
    return response.data?.posts || []
  },

  async createPost(postData) {
    return await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    })
  },

  async deletePost(postId) {
    return await apiRequest(`/posts/${postId}`, {
      method: 'DELETE'
    })
  },

  async votePost(postId, voteType) {
    return await apiRequest(`/posts/${postId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType })
    })
  }
}

// Comments API
export const commentsAPI = {
  async createComment(postId, commentData) {
    return await apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    })
  },

  async getComments(postId) {
    return await apiRequest(`/posts/${postId}/comments`)
  },

  async deleteComment(postId, commentId) {
    return await apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

// Saved Posts API
export const savedPostsAPI = {
  async getSavedPosts() {
    const response = await apiRequest('/saved-posts')
    return response.data?.posts || []
  }
}

// Users API (Admin)
export const usersAPI = {
  async getAllUsers() {
    const response = await apiRequest('/users')
    return response.data?.users || []
  },

  async updateUser(userId, updates) {
    return await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
  },

  async toggleUserStatus(userId) {
    return await apiRequest(`/users/${userId}/toggle-status`, {
      method: 'PUT'
    })
  }
}

// Profile image upload
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('profileImage', imageFile)

    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/upload-profile-picture`, {
      method: 'POST',
      headers: {
        ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to upload profile image')
      error.status = response.status
      error.response = { status: response.status, data }
      throw error
    }

    return data
  } catch (error) {
    console.error('Upload profile image error:', error)
    throw error
  }
}

// Vote on a post
export const voteOnPost = async (postId, voteType) => {
  return apiRequest(`/posts/${postId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ voteType })
  })
}

// Remove vote from a post
export const removeVoteFromPost = async (postId) => {
  return apiRequest(`/posts/${postId}/vote`, {
    method: 'DELETE'
  })
}

// Get post votes
export const getPostVotes = async (postId) => {
  return apiRequest(`/posts/${postId}/votes`)
}

// Individual exports for convenience
export const savePost = async (postId) => {
  return await apiRequest(`/saved-posts/${postId}`, {
    method: 'POST'
  })
}

export const unsavePost = async (postId) => {
  return await apiRequest(`/saved-posts/${postId}`, {
    method: 'DELETE'
  })
}

export default {
  auth: authAPI,
  posts: postsAPI,
  comments: commentsAPI,
  savedPosts: savedPostsAPI,
  users: usersAPI
}
