import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import CreatePostPage from './pages/CreatePostPage'
import ProfilePage from './pages/ProfilePage'
import SavedPostsPage from './pages/SavedPostsPage'
import TrendingPage from './pages/TrendingPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import ServerErrorPage from './pages/ServerErrorPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import ForbiddenPage from './pages/ForbiddenPage'
import NetworkErrorPage from './pages/NetworkErrorPage'
import MaintenancePage from './pages/MaintenancePage'
import ErrorPageTest from './pages/ErrorPageTest'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Toast from './components/Toast'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/saved" element={
                <ProtectedRoute>
                  <SavedPostsPage />
                </ProtectedRoute>
              } />
              <Route path="/trending" element={
                <ProtectedRoute>
                  <TrendingPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* Error Pages */}
              <Route path="/error/500" element={<ServerErrorPage />} />
              <Route path="/error/401" element={<UnauthorizedPage />} />
              <Route path="/error/403" element={<ForbiddenPage />} />
              <Route path="/error/network" element={<NetworkErrorPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              
              {/* Development/Testing Routes */}
              {process.env.NODE_ENV === 'development' && (
                <Route path="/test-errors" element={<ErrorPageTest />} />
              )}
              
              {/* 404 - This should be last */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toast />
          </div>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App