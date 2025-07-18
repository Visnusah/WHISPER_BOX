import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authAPI } from '../services/api'
import OTPVerificationModal from '../components/OTPVerificationModal'

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const { signup } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.fullName || !formData.password || !formData.confirmPassword) {
      addToast('Please fill in all fields', 'error')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error')
      return
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error')
      return
    }

    setIsSendingOTP(true)
    try {
      // First create the user account
      const signupResponse = await authAPI.signup(
        formData.email, 
        formData.password, 
        formData.fullName
      )
      
      if (signupResponse.success) {
        // Then send OTP for verification
        const otpResponse = await authAPI.sendOTP(formData.email)
        
        if (otpResponse.success) {
          let message = 'Account created! Please verify your email with the code we sent.'
          if (otpResponse.data.devMode) {
            message = 'Account created! Development mode: Use code "0000" to verify.'
          }
          addToast(message, 'success')
          setShowOTPModal(true)
        } else {
          addToast(otpResponse.message || 'Failed to send verification code', 'error')
        }
      } else {
        addToast(signupResponse.message || 'Signup failed. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Signup failed:', error)
      addToast('Signup failed. Please try again.', 'error')
    } finally {
      setIsSendingOTP(false)
    }
  }

  const handleOTPSuccess = (user) => {
    addToast('Account verified successfully! Welcome to Whisper Box!', 'success')
    navigate('/home')
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

        {/* Signup Form */}
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join the Whisper Box community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSendingOTP}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              {isSendingOTP ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>

        {/* OTP Verification Modal */}
        <OTPVerificationModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          email={formData.email}
          password={formData.password}
          onSuccess={handleOTPSuccess}
          mode="signup"
        />
      </div>
    </div>
  )
}

export default SignupPage