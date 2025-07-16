import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getImageUrl } from '../config/api'
import { postsAPI } from '../services/api'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import { Upload, AlertCircle, FileText, Heart, MessageCircle } from 'lucide-react'

function ProfilePage() {
  const { user, updateProfile, uploadProfileImage, logout } = useAuth()
  const { addToast } = useToast()
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    fullName: user?.fullName || '',
    bio: user?.bio || ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [userPosts, setUserPosts] = useState([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'posts'

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoadingPosts(true)
        console.log('Fetching posts for user:', user?.id, user?.username)
        const postsData = await postsAPI.getAllPosts()
        console.log('Posts API response:', postsData)
        if (Array.isArray(postsData)) {
          // Filter posts by current user
          const myPosts = postsData.filter(post => post.author && post.author.id === user.id)
          console.log('My posts found:', myPosts.length, myPosts)
          setUserPosts(myPosts)
        } else {
          console.error('Posts data is not an array:', postsData)
          addToast('Failed to load your posts', 'error')
        }
      } catch (error) {
        console.error('Error fetching user posts:', error)
        addToast('Failed to load your posts', 'error')
      } finally {
        setIsLoadingPosts(false)
      }
    }

    if (user?.id) {
      fetchUserPosts()
    }
  }, [user?.id, addToast])

  const handlePostDelete = (postId) => {
    setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
  }

  const handlePostUpdate = () => {
    // Refresh posts after update
    const fetchUserPosts = async () => {
      try {
        const postsData = await postsAPI.getAllPosts()
        if (Array.isArray(postsData)) {
          const myPosts = postsData.filter(post => post.author && post.author.id === user.id)
          setUserPosts(myPosts)
        }
      } catch (error) {
        console.error('Error refreshing posts:', error)
      }
    }
    fetchUserPosts()
  }

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(profileData)
      addToast('Profile updated successfully!', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to update profile', 'error')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      addToast('Please upload a valid image file (JPEG, PNG, GIF, or WebP)', 'error')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB', 'error')
      return
    }

    setIsUploading(true)
    try {
      await uploadProfileImage(file)
      addToast('Profile picture updated successfully!', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to upload profile picture', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSignOut = () => {
    logout()
    addToast('Signed out successfully', 'success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-600">
            Manage your account settings and preferences
          </p>
          
          {user.isActive === false && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <div>
                  <p className="text-sm text-red-700">
                    <strong>Account Deactivated:</strong> Your account has been deactivated by an administrator. 
                    Some features may be limited. Please contact support if you believe this is an error.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'posts'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              My Posts ({userPosts.length})
            </button>
          </div>
        </div>

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Profile Information
                </h2>
              
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fullName" className="form-label">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="form-label">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      className="textarea-field"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary inline-flex items-center"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Picture</h3>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img
                      src={getImageUrl(user?.profileImage)}
                      alt={user?.username || 'User'}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-avatar.png'
                      }}
                    />
                    <label className={`absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      {isUploading ? 'Uploading...' : 'Click the upload button to change your profile picture'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supported formats: JPEG, PNG, GIF, WebP (Max: 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-medium text-slate-800">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Member since:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Account Type:</span>
                    <span className={`font-medium ${user.isAdmin ? 'text-purple-600' : 'text-slate-800'}`}>
                      {user.isAdmin ? 'Administrator' : 'Regular User'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className={`font-medium ${
                      user.isActive === false ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {user.isActive === false ? 'Deactivated' : 'Active'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Need to change your password?</strong> Use the "Forgot password?" option on the login page to reset it securely.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
                
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{userPosts.length}</p>
                    <p className="text-sm text-slate-600">Total Posts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {userPosts.reduce((total, post) => total + (post.votes || 0), 0)}
                    </p>
                    <p className="text-sm text-slate-600">Total Votes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                    </p>
                    <p className="text-sm text-slate-600">Total Comments</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {userPosts.length > 0 ? Math.round(userPosts.reduce((total, post) => total + (post.votes || 0), 0) / userPosts.length) : 0}
                    </p>
                    <p className="text-sm text-slate-600">Avg. Votes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">My Posts</h2>
                <Link 
                  to="/create" 
                  className="btn-primary flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Create New Post</span>
                </Link>
              </div>

              {isLoadingPosts ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-600 mt-4">Loading your posts...</p>
                </div>
              ) : userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-900 mb-2">No posts yet</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Share your thoughts, ideas, and experiences with the community. Your voice matters!
                  </p>
                  <Link 
                    to="/create" 
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Create Your First Post</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4 text-sm text-slate-500">
                    Showing {userPosts.length} post{userPosts.length !== 1 ? 's' : ''} • Sorted by newest first
                  </div>
                  {userPosts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
                    .map((post) => (
                    <div key={post.id} className="bg-slate-50 rounded-xl p-1 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <PostCard
                        post={post}
                        onDelete={handlePostDelete}
                        onUpdate={handlePostUpdate}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
