import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, User, Bookmark, TrendingUp, Plus, LogOut, Sparkles, Settings } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/trending', icon: TrendingUp, label: 'Trending' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  // Add admin link only for admin users
  if (user?.isAdmin) {
    navItems.push({ path: '/admin', icon: Settings, label: 'Admin' })
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-background-200 sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-105">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold gradient-text">WHISPER BOX</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''} inline-flex items-center space-x-2`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
            
            {/* Create Post Button - Only show for non-admin users */}
            {!user?.isAdmin && (
              <Link
                to="/create"
                className="btn-primary inline-flex items-center space-x-2 ml-4 relative overflow-hidden group"
              >
                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                <span className="hidden sm:inline">Create Post</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-background-200">
              <div className="relative group">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-9 h-9 profile-avatar"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse-soft"></div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-text-700">
                    {user.username}
                  </span>
                  {user?.isAdmin && (
                    <span className="status-badge admin text-xs">Admin</span>
                  )}
                </div>
                <div className="text-xs text-text-500">Online</div>
              </div>
              <button
                onClick={handleLogout}
                className="action-button group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar