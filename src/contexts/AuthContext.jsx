import { createContext, useContext, useState, useEffect } from 'react'

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
    const storedUser = localStorage.getItem('whisper_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email, password) => {
    // Mock login - in real app, this would call an API
    const mockUser = {
      id: '1',
      email: email,
      username: email.split('@')[0],
      fullName: 'Test User',
      bio: 'Hello! I love sharing thoughts on Whisper Box.',
      profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isAdmin: email === 'admin@whisperbox.com'
    }
    
    setUser(mockUser)
    localStorage.setItem('whisper_user', JSON.stringify(mockUser))
    return Promise.resolve(mockUser)
  }

  const signup = (email, password, username) => {
    // Mock signup
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      username: username,
      fullName: username,
      bio: 'New to Whisper Box!',
      profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isAdmin: false
    }
    
    setUser(mockUser)
    localStorage.setItem('whisper_user', JSON.stringify(mockUser))
    return Promise.resolve(mockUser)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('whisper_user')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('whisper_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}