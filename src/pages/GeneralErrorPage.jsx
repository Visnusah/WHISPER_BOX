import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, RefreshCw, Home, Mail, Copy, Check } from 'lucide-react'

function GeneralErrorPage({ error = null, resetError = null }) {
  const [copied, setCopied] = useState(false)
  
  const errorDetails = error || {
    name: 'UnknownError',
    message: 'An unexpected error occurred',
    stack: 'Error details not available'
  }

  const copyErrorDetails = async () => {
    const errorText = `Error: ${errorDetails.name}
Message: ${errorDetails.message}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Stack Trace:
${errorDetails.stack}`

    try {
      await navigator.clipboard.writeText(errorText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy error details:', err)
    }
  }

  const handleReload = () => {
    if (resetError) {
      resetError()
    }
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Error Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <div className="text-4xl font-bold text-gradient bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Oops!
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-800 mb-4">
            Something went wrong
          </h1>
          <p className="text-text-600 text-lg mb-2">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
          <p className="text-text-500">
            Please try refreshing the page or go back to the home page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button 
            onClick={handleReload}
            className="btn-primary w-full inline-flex items-center justify-center space-x-2 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Reload Page</span>
          </button>
          
          <Link 
            to="/home" 
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <a 
            href="mailto:support@whisperbox.com?subject=Error Report&body=Please find error details below:%0A%0A[Error details will be copied when you click 'Copy Error Details']"
            className="btn-ghost w-full inline-flex items-center justify-center space-x-2"
          >
            <Mail className="w-5 h-5" />
            <span>Report Issue</span>
          </a>
        </div>

        {/* Error Details (Collapsible) */}
        <details className="text-left bg-white/50 backdrop-blur-sm rounded-xl border border-background-200 p-4">
          <summary className="cursor-pointer font-medium text-text-700 mb-2 flex items-center justify-between">
            Error Details
            <span className="text-text-500 text-sm">Click to expand</span>
          </summary>
          
          <div className="space-y-3 mt-3">
            <div>
              <label className="text-xs font-semibold text-text-600 uppercase tracking-wide">Error Type:</label>
              <p className="text-sm text-text-800 font-mono bg-gray-100 p-2 rounded">{errorDetails.name}</p>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-text-600 uppercase tracking-wide">Message:</label>
              <p className="text-sm text-text-800 bg-gray-100 p-2 rounded">{errorDetails.message}</p>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-text-600 uppercase tracking-wide">Page:</label>
              <p className="text-sm text-text-800 font-mono bg-gray-100 p-2 rounded break-all">{window.location.href}</p>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-text-600 uppercase tracking-wide">Timestamp:</label>
              <p className="text-sm text-text-800 font-mono bg-gray-100 p-2 rounded">{new Date().toISOString()}</p>
            </div>

            {errorDetails.stack && (
              <div>
                <label className="text-xs font-semibold text-text-600 uppercase tracking-wide">Stack Trace:</label>
                <pre className="text-xs text-text-700 bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                  {errorDetails.stack}
                </pre>
              </div>
            )}
            
            <button
              onClick={copyErrorDetails}
              className="w-full mt-3 btn-ghost text-sm inline-flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Error Details</span>
                </>
              )}
            </button>
          </div>
        </details>

        {/* Help Text */}
        <div className="mt-6 text-xs text-text-400">
          <p>Error ID: {Date.now()}-{Math.random().toString(36).substr(2, 9)}</p>
        </div>
      </div>
    </div>
  )
}

export default GeneralErrorPage
