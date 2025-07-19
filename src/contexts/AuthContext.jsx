import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user')
    const accessToken = localStorage.getItem('accessToken')
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser))
      // Verify token is still valid
      verifyCurrentUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyCurrentUser = async () => {
    try {
      const response = await authAPI.getMe()
      if (response.success && response.data.user) {
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    } catch (error) {
      // Silent logout on token verification failure
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      if (response.success && response.data.user) {
        setUser(response.data.user)
        return response.data.user
      }
      throw new Error(response.message || 'Login failed')
    } catch (error) {
      // Check if it's an email verification error
      if (error.response?.status === 403 && error.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        const verificationError = new Error(error.response.data.message || 'Please verify your email address before logging in.')
        verificationError.code = 'EMAIL_NOT_VERIFIED'
        verificationError.data = error.response.data.data
        throw verificationError
      }
      
      throw error
    }
  }

  const signup = async (email, password, username, fullName) => {
    try {
      const response = await authAPI.signup(email, password, username, fullName)
      if (response.success) {
        // Don't set user immediately for email verification flow
        return response
      }
      throw new Error(response.message || 'Signup failed')
    } catch (error) {
      throw error
    }
  }

  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token)
      return response
    } catch (error) {
      throw error
    }
  }

  const resendVerification = async (email) => {
    try {
      const response = await authAPI.resendVerification(email)
      return response
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email)
      return response
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword(token, password)
      return response
    } catch (error) {
      throw error
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword(currentPassword, newPassword)
      if (response.success) {
        // Force logout after password change
        logout()
      }
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Silent error handling for logout
    } finally {
      setUser(null)
    }
  }

  const updateProfile = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates)
      if (response.success && response.data.user) {
        const updatedUser = response.data.user
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return updatedUser
      }
      throw new Error(response.message || 'Profile update failed')
    } catch (error) {
      throw error
    }
  }

  const uploadProfileImage = async (imageFile) => {
    try {
      const response = await authAPI.uploadProfileImage(imageFile)
      if (response.success && response.data.user) {
        const updatedUser = response.data.user
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return response
      }
      throw new Error(response.message || 'Failed to upload profile image')
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    updateProfile,
    uploadProfileImage
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}