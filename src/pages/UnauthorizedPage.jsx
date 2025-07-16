import { Link } from 'react-router-dom'
import { Shield, Lock, Home, ArrowLeft } from 'lucide-react'

function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Error Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <div className="text-6xl font-bold text-gradient bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            401
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-800 mb-4">
            Access Denied
          </h1>
          <p className="text-text-600 text-lg mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-text-500">
            Please log in or check your account permissions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            to="/login" 
            className="btn-primary w-full inline-flex items-center justify-center space-x-2 group"
          >
            <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Log In</span>
          </Link>
          
          <Link 
            to="/home" 
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="btn-ghost w-full inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Message */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-background-200">
          <p className="text-sm text-text-600 font-medium mb-1">
            Need help?
          </p>
          <p className="text-xs text-text-500">
            If you believe this is an error, please contact an administrator or try logging in with a different account.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
