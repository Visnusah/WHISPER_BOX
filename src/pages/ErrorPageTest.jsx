import { Link } from 'react-router-dom'
import { AlertTriangle, Zap } from 'lucide-react'

function ErrorPageTest() {
  const triggerError = () => {
    throw new Error('This is a test error to demonstrate the ErrorBoundary')
  }

  const errorPages = [
    { path: '/error/404', name: '404 - Not Found', description: 'Page not found error' },
    { path: '/error/401', name: '401 - Unauthorized', description: 'Authentication required' },
    { path: '/error/403', name: '403 - Forbidden', description: 'Access denied' },
    { path: '/error/500', name: '500 - Server Error', description: 'Internal server error' },
    { path: '/error/network', name: 'Network Error', description: 'Connection issues' },
    { path: '/maintenance', name: 'Maintenance', description: 'Scheduled maintenance' },
    { path: '/nonexistent', name: '404 Test', description: 'Test 404 by visiting non-existent page' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text-800 mb-4">
            Error Pages Test Center
          </h1>
          <p className="text-text-600 text-lg">
            Test all error pages and error handling functionality
          </p>
        </div>

        {/* Error Boundary Test */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-text-800 mb-4 flex items-center">
            <Zap className="w-6 h-6 text-yellow-500 mr-2" />
            ErrorBoundary Test
          </h2>
          <p className="text-text-600 mb-4">
            Click the button below to trigger an error and test the ErrorBoundary component:
          </p>
          <button
            onClick={triggerError}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Trigger Test Error</span>
          </button>
        </div>

        {/* Error Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {errorPages.map((page, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-text-800 mb-2">
                {page.name}
              </h3>
              <p className="text-text-600 text-sm mb-4">
                {page.description}
              </p>
              <Link
                to={page.path}
                className="btn-secondary w-full text-center inline-flex items-center justify-center"
              >
                View Page
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="text-center mt-12">
          <Link
            to="/home"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Testing Instructions:</h3>
          <ul className="text-blue-700 space-y-2">
            <li>• Click "Trigger Test Error" to test the ErrorBoundary component</li>
            <li>• Visit each error page to see the different error states</li>
            <li>• Test network error by disconnecting your internet and reloading</li>
            <li>• Test 404 error by visiting a non-existent URL</li>
            <li>• Check browser console for error logging</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ErrorPageTest
