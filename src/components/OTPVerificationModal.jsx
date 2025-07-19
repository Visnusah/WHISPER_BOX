import { useState, useEffect } from 'react'
import { X, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { authAPI } from '../services/api'
import { useToast } from '../contexts/ToastContext'

function OTPVerificationModal({ isOpen, onClose, email, password, onSuccess, mode = 'login' }) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { addToast } = useToast()

  // Timer for resend button
  useEffect(() => {
    let interval
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOpen, resendTimer])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', ''])
      setError('')
      setSuccess('')
      setResendTimer(30)
      setCanResend(false)
    }
  }, [isOpen])

  // Handle OTP input
  const handleOTPChange = (index, value) => {
    if (value.length > 1) return
    
    const newOTP = [...otp]
    newOTP[index] = value
    setOtp(newOTP)
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
        const newOTP = [...otp]
        newOTP[index - 1] = ''
        setOtp(newOTP)
      }
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text')
    const digits = paste.replace(/\D/g, '').slice(0, 4)
    
    if (digits.length === 4) {
      setOtp(digits.split(''))
      // Focus the last input
      const lastInput = document.getElementById('otp-3')
      if (lastInput) lastInput.focus()
    }
  }

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit code')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await authAPI.verifyOTP(email, otpString, password)
      
      if (response.success) {
        setSuccess('Verification successful!')
        addToast('Email verified successfully! Please login to continue.', 'success')
        setTimeout(() => {
          onSuccess(response.data.user)
          onClose()
        }, 1000)
      } else {
        setError(response.message || 'Invalid verification code')
      }
    } catch (error) {
      setError(error.message || 'Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setIsResending(true)
    setError('')
    
    try {
      const response = await authAPI.resendOTP(email)
      
      if (response.success) {
        addToast('New verification code sent!', 'success')
        setResendTimer(30)
        setCanResend(false)
        setOtp(['', '', '', ''])
      } else {
        setError(response.message || 'Failed to resend code')
      }
    } catch (error) {
      setError(error.message || 'Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Verify Your Email</h3>
              <p className="text-sm text-gray-600">Enter the 4-digit code sent to your email</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Email info */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              We've sent a verification code to
            </p>
            <p className="font-semibold text-gray-900 mt-1">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-center space-x-2 text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          {/* Verify button */}
          <button
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.join('').length !== 4}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Code</span>
            )}
          </button>

          {/* Resend section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center space-x-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Resend Code</span>
                )}
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend code in {resendTimer} seconds
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerificationModal
