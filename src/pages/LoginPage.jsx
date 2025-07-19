import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Eye, EyeOff, Mail, Loader2, AlertTriangle } from 'lucide-react'
import { authAPI } from '../services/api'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
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
      // Handle specific error types
      if (error.message?.includes('EMAIL_NOT_VERIFIED') || 
          (error.response?.status === 403 && error.response?.data?.code === 'EMAIL_NOT_VERIFIED')) {
        // Show confirmation modal for email verification
        setVerificationEmail(email)
        setShowVerificationModal(true)
        addToast('Your account is not verified. Please verify your email to continue.', 'warning')
      } else if (error.response?.status === 401) {
        addToast('Invalid email or password. Please try again.', 'error')
      } else if (error.type === 'NETWORK_ERROR') {
        addToast('Network error. Please check your internet connection.', 'error')
      } else {
        addToast(error.message || 'Login failed. Please try again.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationConfirm = async () => {
    setShowVerificationModal(false)
    try {
      const response = await authAPI.sendOTP(verificationEmail)
      if (response.success) {
        addToast('Verification code sent to your email!', 'success')
        // Redirect to email verification page instead of showing modal
        navigate('/email-verification', { state: { email: verificationEmail, fromLogin: true } })
      } else {
        addToast(response.message || 'Failed to send verification code', 'error')
      }
    } catch (error) {
      addToast(error.message || 'Failed to send verification code', 'error')
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
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

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
                <Link
                  to="/reset-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </Link>
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Admin Account:</h4>
            <div className="text-xs text-blue-800">
              <p><strong>Admin:</strong> sahk0292@gmail.com / admin123</p>
            </div>
          </div>
        </div>        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>

        {/* Email Verification Confirmation Modal */}
        {showVerificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Email Verification Required</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Your account is registered but not verified. Would you like us to send a verification code to your email?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleVerificationConfirm}
                  className="flex-1 btn-primary"
                >
                  Send Verification Code
                </button>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage