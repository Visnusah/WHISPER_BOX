import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Eye, EyeOff, Mail, Loader2 } from 'lucide-react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      addToast('Please fill in all fields', 'error')
      return
    }

    setIsLoading(true)
    try {
      const user = await login(email, password)
      addToast('Welcome back!', 'success')
      
      // Redirect based on user role
      if (user.isAdmin) {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle specific error types
      if (error.message?.includes('EMAIL_NOT_VERIFIED') || 
          (error.response?.status === 403 && error.response?.data?.code === 'EMAIL_NOT_VERIFIED')) {
        addToast('Please verify your email before logging in. Check your inbox or sign up again to resend OTP.', 'warning')
      } else if (error.response?.status === 401) {
        addToast('Invalid email or password. Please try again.', 'error')
      } else {
        addToast('Login failed. Please try again.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (!resetEmail) {
      addToast('Please enter your email address', 'error')
      return
    }

    setIsResetting(true)
    try {
      // Mock password reset - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000))
      addToast('Password reset email sent! Check your inbox.', 'success')
      setShowResetForm(false)
      setResetEmail('')
    } catch (error) {
      addToast('Failed to send reset email. Please try again.', 'error')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">WHISPER BOX</span>
          </Link>
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {showResetForm ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mt-2">
              {showResetForm ? 'Enter your email to reset your password' : 'Sign in to your account'}
            </p>
          </div>

          {showResetForm ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                {isResetting ? 'Sending Reset Email...' : 'Send Reset Email'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowResetForm(false)
                  setResetEmail('')
                }}
                className="w-full btn-ghost"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div></div>
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {!showResetForm && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          )}

          {/* Demo Account Info */}
          {!showResetForm && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Admin Account:</h4>
              <div className="text-xs text-blue-800">
                <p><strong>Admin:</strong> sahk0292@gmail.com / admin123</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage