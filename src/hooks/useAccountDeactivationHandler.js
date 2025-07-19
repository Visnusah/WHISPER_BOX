import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'

export const useAccountDeactivationHandler = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { logout } = useAuth()

  useEffect(() => {
    const handleAccountDeactivation = async () => {
      // Clear user session
      await logout()
      
      // Show toast message
      addToast(
        'Your account has been deactivated by an administrator. Please contact support for assistance.',
        'error'
      )
      
      // Redirect to contact page after a brief delay
      setTimeout(() => {
        navigate('/contact', { 
          replace: true,
          state: { reason: 'account-deactivated' }
        })
      }, 2000)
    }

    // Set global handler
    window.handleAccountDeactivation = handleAccountDeactivation

    // Cleanup
    return () => {
      delete window.handleAccountDeactivation
    }
  }, [navigate, addToast, logout])
}
