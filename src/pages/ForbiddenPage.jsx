import { Link } from 'react-router-dom'
import { Ban, Home, ArrowLeft, Mail } from 'lucide-react'

function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Error Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-500 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Ban className="w-12 h-12 text-white" />
          </div>
          <div className="text-6xl font-bold text-gradient bg-gradient-to-r from-gray-500 to-slate-500 bg-clip-text text-transparent">
            403
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-800 mb-4">
            Forbidden
          </h1>
          <p className="text-text-600 text-lg mb-2">
            You don't have the necessary permissions to access this resource.
          </p>
          <p className="text-text-500">
            This area is restricted to authorized users only.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            to="/home" 
            className="btn-primary w-full inline-flex items-center justify-center space-x-2 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Back to Home</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <a 
            href="mailto:admin@whisperbox.com"
            className="btn-ghost w-full inline-flex items-center justify-center space-x-2"
          >
            <Mail className="w-5 h-5" />
            <span>Request Access</span>
          </a>
        </div>

        {/* Info Message */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-background-200">
          <p className="text-sm text-text-600 font-medium mb-1">
            Access Restricted
          </p>
          <p className="text-xs text-text-500">
            If you need access to this resource, please contact an administrator or check your account permissions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForbiddenPage
