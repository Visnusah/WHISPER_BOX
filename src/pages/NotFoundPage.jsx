import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8 relative">
          <div className="text-9xl font-bold text-gradient bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent animate-pulse">
            404
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center animate-bounce">
            <MessageCircle className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-text-600 text-lg mb-2">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
          <p className="text-text-500">
            Don't worry, even the best explorers get lost sometimes!
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
          
          <Link 
            to="/" 
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go to Landing</span>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="btn-ghost w-full inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-background-200">
          <div className="flex items-center space-x-2 text-text-600 mb-2">
            <Search className="w-5 h-5" />
            <span className="font-medium">Looking for something specific?</span>
          </div>
          <p className="text-sm text-text-500">
            Try searching from the home page or check out trending posts.
          </p>
        </div>

        {/* Fun Facts */}
        <div className="mt-6 text-xs text-text-400">
          <p>Fun fact: 404 errors are named after room 404 at CERN, where the first web server was located! 🌐</p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
