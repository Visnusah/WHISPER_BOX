import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Clock, ArrowLeft, RefreshCw } from 'lucide-react'

function MaintenancePage() {
  const [countdown, setCountdown] = useState('')
  
  // Example: Set maintenance end time (you can make this dynamic)
  const maintenanceEndTime = new Date()
  maintenanceEndTime.setHours(maintenanceEndTime.getHours() + 2) // 2 hours from now

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = maintenanceEndTime.getTime() - now

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setCountdown('00:00:00')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [maintenanceEndTime])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Maintenance Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Wrench className="w-12 h-12 text-white animate-bounce" />
          </div>
          <div className="text-4xl font-bold text-gradient bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Under Maintenance
          </div>
        </div>

        {/* Maintenance Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-800 mb-4">
            We're Making Things Better!
          </h1>
          <p className="text-text-600 text-lg mb-2">
            Whisper Box is currently undergoing scheduled maintenance to improve your experience.
          </p>
          <p className="text-text-500">
            We'll be back online shortly. Thank you for your patience!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-background-200">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-text-700">Estimated Time Remaining:</span>
          </div>
          <div className="text-3xl font-mono font-bold text-orange-600">
            {countdown}
          </div>
          <p className="text-sm text-text-500 mt-2">
            Hours : Minutes : Seconds
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary w-full inline-flex items-center justify-center space-x-2 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Check Again</span>
          </button>
          
          <Link 
            to="/" 
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Landing</span>
          </Link>
        </div>

        {/* What's Being Updated */}
        <div className="text-left bg-white/50 backdrop-blur-sm rounded-xl border border-background-200 p-4">
          <h3 className="font-semibold text-text-700 mb-3 text-center">What We're Working On:</h3>
          <ul className="text-sm text-text-600 space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Database optimization</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Performance improvements</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Security updates</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>New features</span>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-500 mb-2">Stay updated on our progress:</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://twitter.com/whisperbox" 
              className="text-blue-500 hover:text-blue-600 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a 
              href="https://status.whisperbox.com" 
              className="text-green-500 hover:text-green-600 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Status Page
            </a>
            <a 
              href="mailto:support@whisperbox.com" 
              className="text-purple-500 hover:text-purple-600 text-sm"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenancePage
