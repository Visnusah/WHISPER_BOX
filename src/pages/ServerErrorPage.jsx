import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'

function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Error Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <div className="text-6xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            500
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-800 mb-4">
            Server Error
          </h1>
          <p className="text-text-600 text-lg mb-2">
            Something went wrong on our end. Our team has been notified.
          </p>
          <p className="text-text-500">
            Please try again in a few moments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary w-full inline-flex items-center justify-center space-x-2 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
          
          <Link 
            to="/home" 
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <a 
            href="mailto:support@whisperbox.com"
            className="btn-ghost w-full inline-flex items-center justify-center space-x-2"
          >
            <Mail className="w-5 h-5" />
            <span>Contact Support</span>
          </a>
        </div>

        {/* Status Message */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-background-200">
          <p className="text-sm text-text-600">
            <strong>Error Code:</strong> 500 - Internal Server Error
          </p>
          <p className="text-xs text-text-500 mt-1">
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ServerErrorPage
