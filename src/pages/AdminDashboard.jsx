import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import { usersAPI, postsAPI } from '../services/api'
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  UserCheck, 
  UserX, 
  Trash2, 
  Eye,
  Moon,
  Sun,
  LogOut
} from 'lucide-react'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    logout()
    addToast('Logged out successfully', 'success')
    navigate('/')
  }

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true)
        const [usersData, postsData] = await Promise.all([
          usersAPI.getAllUsers(),
          postsAPI.getAllPosts()
        ])
        setUsers(usersData)
        setPosts(postsData)
      } catch (error) {
        console.error('Error loading admin data:', error)
        addToast('Failed to load admin data', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [addToast])

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.isActive !== false).length
  const totalPosts = posts.length

  const toggleUserStatus = (userId) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId 
          ? { ...u, isActive: u.isActive === false ? true : false }
          : u
      )
    )
    const updatedUser = users.find(u => u.id === userId)
    addToast(
      `User ${updatedUser.isActive === false ? 'activated' : 'deactivated'} successfully`, 
      'success'
    )
  }

  const deletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId))
    addToast('Post deleted successfully', 'success')
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null)
    }
  }

  const deleteComment = (postId, commentId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: post.comments.filter(c => c.id !== commentId) 
            }
          : post
      )
    )
    addToast('Comment deleted successfully', 'success')
    
    // Update selectedPost if it's the current one
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId)
      }))
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    addToast(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`, 'success')
  }

  const renderOverview = () => {
    // Calculate additional statistics
    const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0)
    const mostActiveUser = users.reduce((prev, current) => {
      const prevPosts = posts.filter(p => p.author.id === prev.id).length
      const currentPosts = posts.filter(p => p.author.id === current.id).length
      return currentPosts > prevPosts ? current : prev
    }, users[0])
    const mostCommentedPost = posts.reduce((prev, current) => 
      current.comments.length > prev.comments.length ? current : prev
    , posts[0])
    const recentPosts = posts.filter(post => {
      const postDate = new Date(post.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return postDate >= weekAgo
    }).length
    const averageCommentsPerPost = posts.length > 0 ? (totalComments / posts.length).toFixed(1) : 0
    const adminUsers = users.filter(u => u.isAdmin).length
    const inactiveUsers = users.filter(u => u.isActive === false).length

    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-100 text-lg">Welcome back, {user.username}! Here's what's happening on Whisperbox</p>
              <p className="text-blue-200 text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="text-2xl font-bold">{new Date().getDate()}</p>
                  <p className="text-sm">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-4 py-2 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">↑ +{Math.floor(totalUsers * 0.1)} this month</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-3xl font-bold text-slate-900">{activeUsers}</p>
                <p className="text-xs text-slate-500 mt-1">{((activeUsers/totalUsers) * 100).toFixed(1)}% of total</p>
              </div>
              <UserCheck className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Posts</p>
                <p className="text-3xl font-bold text-slate-900">{totalPosts}</p>
                <p className="text-xs text-blue-600 mt-1">{recentPosts} this week</p>
              </div>
              <FileText className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Comments</p>
                <p className="text-3xl font-bold text-slate-900">{totalComments}</p>
                <p className="text-xs text-purple-600 mt-1">Avg: {averageCommentsPerPost} per post</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">User Status</h3>
              <UserX className="w-6 h-6 text-slate-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Admin Users</span>
                <span className="font-semibold text-blue-600">{adminUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Inactive Users</span>
                <span className="font-semibold text-red-600">{inactiveUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Regular Users</span>
                <span className="font-semibold text-green-600">{totalUsers - adminUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Most Active User</h3>
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👑</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <img 
                src={mostActiveUser?.profileImage} 
                alt="" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-slate-900">@{mostActiveUser?.username}</p>
                <p className="text-sm text-slate-600">
                  {posts.filter(p => p.author.id === mostActiveUser?.id).length} posts
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Most Discussed</h3>
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🔥</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm mb-1 truncate">
                {mostCommentedPost?.description.substring(0, 40)}...
              </p>
              <p className="text-sm text-slate-600">
                {mostCommentedPost?.comments.length} comments by @{mostCommentedPost?.author.username}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveSection('users')}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-slate-700">Manage Users</span>
            </button>
            <button
              onClick={() => setActiveSection('posts')}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <FileText className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium text-slate-700">Manage Posts</span>
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-8 h-8 text-slate-500 mb-2" />
              <span className="text-sm font-medium text-slate-700">Settings</span>
            </button>
            <button
              onClick={() => addToast('Analytics feature coming soon!', 'info')}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <BarChart3 className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-sm font-medium text-slate-700">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderUserManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
      
      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={user.profileImage} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive === false 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isActive === false ? 'Deactivated' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                        user.isActive === false
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive === false ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activate
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4 mr-1" />
                          Deactivate
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderPostManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Post Management</h2>
      
      {selectedPost ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Posts
          </button>
          
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {selectedPost.description}
            </h3>
            <p className="text-slate-600 mb-4">
              By: @{selectedPost.author.username} • {new Date(selectedPost.createdAt).toLocaleDateString()}
            </p>
            
            <h4 className="text-lg font-semibold text-slate-900 mb-3">
              Comments ({selectedPost.comments.length})
            </h4>
            
            <div className="space-y-3">
              {selectedPost.comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <p className="text-slate-800">{comment.text}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      By: @{comment.author.username} • {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteComment(selectedPost.id, comment.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Comments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 max-w-xs truncate">
                        {post.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      @{post.author.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {post.comments.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
      
      <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Theme Settings</h3>
        
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {isDarkMode ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-slate-600" />}
            <div>
              <p className="font-medium text-slate-900">Dark Mode</p>
              <p className="text-sm text-slate-600">
                Toggle between light and dark theme
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview()
      case 'users':
        return renderUserManagement()
      case 'posts':
        return renderPostManagement()
      case 'settings':
        return renderSystemSettings()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900">Whisperbox</h1>
            <p className="text-sm text-slate-600">Admin Panel</p>
          </div>
          
          <nav className="mt-6">
            <div className="px-3 space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'User Management', icon: Users },
                { id: 'posts', label: 'Post Management', icon: FileText },
                { id: 'settings', label: 'System Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
