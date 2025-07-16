import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Wifi, WifiOff, RefreshCw, Home } from 'lucide-react'

function NetworkErrorPage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = async () => {
    setRetrying(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (navigator.onLine) {
      window.location.reload()
    } else {
      setRetrying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Connection Status */}
        <div className="mb-8 relative">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse ${
            isOnline ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-red-500 to-orange-500'
          }`}>
            {isOnline ? (
              <Wifi className="w-12 h-12 text-white" />
            ) : (
              <WifiOff className="w-12 h-12 text-white" />
            )}
          </div>
          <div className={`text-2xl font-bold ${
            isOnline ? 'text-green-600' : 'text-red-600'
          }`}>
            {isOnline ? 'Connected' : 'No Connection'}
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-800 mb-4">
            {isOnline ? 'Connection Restored!' : 'Network Error'}
          </h1>
          <p className="text-text-600 text-lg mb-2">
            {isOnline 
              ? 'Your connection has been restored. You can now continue using Whisper Box.'
              : 'Unable to connect to Whisper Box. Please check your internet connection.'
            }
          </p>
          <p className="text-text-500">
            {isOnline 
              ? 'Click below to reload the page.'
              : 'Make sure you\'re connected to the internet and try again.'
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {isOnline ? (
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary w-full inline-flex items-center justify-center space-x-2 group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Reload Page</span>
            </button>
          ) : (
            <button 
              onClick={handleRetry}
              disabled={retrying}
              className="btn-primary w-full inline-flex items-center justify-center space-x-2 group disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${retrying ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
              <span>{retrying ? 'Checking...' : 'Try Again'}</span>
            </button>
          )}
          
          <Link 
            to="/home" 
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Network Status */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-background-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-600">Network Status:</span>
            <span className={`text-sm font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-xs text-text-500">
            {isOnline 
              ? 'Your device is connected to the internet.'
              : 'Check your WiFi or mobile data connection.'
            }
          </p>
        </div>

        {/* Troubleshooting Tips */}
        {!isOnline && (
          <div className="mt-6 text-left">
            <h3 className="text-sm font-semibold text-text-700 mb-2">Troubleshooting Tips:</h3>
            <ul className="text-xs text-text-500 space-y-1">
              <li>• Check your WiFi or mobile data connection</li>
              <li>• Try turning airplane mode on and off</li>
              <li>• Restart your router or modem</li>
              <li>• Contact your internet service provider</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkErrorPage
