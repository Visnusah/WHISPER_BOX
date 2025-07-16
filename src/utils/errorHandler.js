// Error handling utilities
import { useNavigate } from 'react-router-dom'

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  GENERAL: 'GENERAL_ERROR'
}

// Error handler hook
export const useErrorHandler = () => {
  const navigate = useNavigate()

  const handleError = (error, context = '') => {
    console.error(`Error in ${context}:`, error)

    // Check for network errors
    if (!navigator.onLine || error.message?.includes('fetch')) {
      navigate('/error/network')
      return
    }

    // Check for specific HTTP status codes
    if (error.response || error.status) {
      const status = error.response?.status || error.status

      switch (status) {
        case 401:
          navigate('/error/401')
          return
        case 403:
          navigate('/error/403')
          return
        case 404:
          navigate('/error/404')
          return
        case 500:
        case 502:
        case 503:
        case 504:
          navigate('/error/500')
          return
        default:
          // For other HTTP errors, show general error
          break
      }
    }

    // Check for specific error types
    if (error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')) {
      // Handle chunk loading errors (usually from code splitting)
      window.location.reload()
      return
    }

    // For any other errors, you might want to show a toast or handle differently
    // navigate('/error/general')
  }

  return { handleError }
}

// Global error handler for fetch requests
export const handleApiError = (error, navigate = null) => {
  console.error('API Error:', error)

  if (!navigator.onLine) {
    if (navigate) navigate('/error/network')
    return { type: ERROR_TYPES.NETWORK, message: 'No internet connection' }
  }

  if (error.status) {
    switch (error.status) {
      case 401:
        if (navigate) navigate('/error/401')
        return { type: ERROR_TYPES.UNAUTHORIZED, message: 'Unauthorized access' }
      case 403:
        if (navigate) navigate('/error/403')
        return { type: ERROR_TYPES.FORBIDDEN, message: 'Access forbidden' }
      case 404:
        return { type: ERROR_TYPES.NOT_FOUND, message: 'Resource not found' }
      case 500:
      case 502:
      case 503:
      case 504:
        if (navigate) navigate('/error/500')
        return { type: ERROR_TYPES.SERVER_ERROR, message: 'Server error' }
      default:
        return { type: ERROR_TYPES.GENERAL, message: error.message || 'An error occurred' }
    }
  }

  return { type: ERROR_TYPES.GENERAL, message: error.message || 'An unexpected error occurred' }
}

// Utility to check if user should be redirected to error page
export const shouldRedirectToErrorPage = (error) => {
  if (!navigator.onLine) return true
  if (error.status && [401, 403, 500, 502, 503, 504].includes(error.status)) return true
  if (error.name === 'ChunkLoadError') return true
  return false
}

// Enhanced API request wrapper with error handling
export const apiRequestWithErrorHandling = async (requestFn, navigate = null, showToast = null) => {
  try {
    return await requestFn()
  } catch (error) {
    const errorInfo = handleApiError(error, navigate)
    
    // Show toast for non-redirecting errors
    if (!shouldRedirectToErrorPage(error) && showToast) {
      showToast(errorInfo.message, 'error')
    }
    
    throw error
  }
}

export default {
  ERROR_TYPES,
  useErrorHandler,
  handleApiError,
  shouldRedirectToErrorPage,
  apiRequestWithErrorHandling
}
