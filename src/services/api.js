// Frontend API service for handling data operations
// This replaces the backend controllers for a frontend-only app

import { mockUsers, mockPosts } from '../data/mockData'

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Authentication API
export const authAPI = {
  async login(email, password) {
    await delay(500)
    const user = mockUsers.find(u => u.email === email)
    if (user) {
      return { success: true, user }
    }
    throw new Error('Invalid credentials')
  },

  async signup(email, password, username) {
    await delay(500)
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      fullName: username,
      bio: 'New to Whisper Box!',
      profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isAdmin: false,
      createdAt: new Date().toISOString(),
      isActive: true
    }
    return { success: true, user: newUser }
  },

  async resetPassword(email) {
    await delay(1000)
    const user = mockUsers.find(u => u.email === email)
    if (user) {
      return { success: true, message: 'Password reset email sent' }
    }
    throw new Error('Email not found')
  }
}

// Posts API
export const postsAPI = {
  async getAllPosts() {
    await delay(300)
    return mockPosts
  },

  async createPost(postData) {
    await delay(500)
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      createdAt: new Date().toISOString(),
      votes: 0,
      userVote: null,
      comments: []
    }
    return newPost
  },

  async deletePost(postId) {
    await delay(300)
    return { success: true }
  },

  async votePost(postId, voteType) {
    await delay(200)
    return { success: true }
  }
}

// Comments API
export const commentsAPI = {
  async addComment(postId, commentData) {
    await delay(300)
    const newComment = {
      id: Date.now().toString(),
      ...commentData,
      createdAt: new Date().toISOString()
    }
    return newComment
  },

  async deleteComment(commentId) {
    await delay(200)
    return { success: true }
  }
}

// Users API
export const usersAPI = {
  async getAllUsers() {
    await delay(300)
    return mockUsers
  },

  async updateUser(userId, updates) {
    await delay(400)
    return { success: true }
  },

  async toggleUserStatus(userId) {
    await delay(300)
    return { success: true }
  }
}

export default {
  auth: authAPI,
  posts: postsAPI,
  comments: commentsAPI,
  users: usersAPI
}
