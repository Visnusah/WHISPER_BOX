import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function EmailVerificationPage() {
  const { token } = useParams()
  const { verifyEmail } = useAuth()
  const { showToast } = useToast()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      handleVerification()
    } else {
      setStatus('error')
      setMessage('Invalid verification link')
    }
  }, [token])

  const handleVerification = async () => {
    try {
      const response = await verifyEmail(token)
      if (response.success) {
        setStatus('success')
        setMessage('Email verified successfully! You can now log in.')
        showToast('Email verified successfully!', 'success')
      } else {
        setStatus('error')
        setMessage(response.message || 'Email verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Email verification failed')
      showToast(error.message || 'Email verification failed', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4">
            {status === 'verifying' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            )}
            {status === 'success' && (
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            {status === 'error' && (
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>

          <p className="text-gray-600 mb-8">{message}</p>

          <div className="space-y-4">
            {status === 'success' && (
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 inline-block text-center"
              >
                Go to Login
              </Link>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <Link
                  to="/resend-verification"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 inline-block text-center"
                >
                  Resend Verification Email
                </Link>
                <Link
                  to="/signup"
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 inline-block text-center"
                >
                  Sign Up Again
                </Link>
              </div>
            )}

            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 transition duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
