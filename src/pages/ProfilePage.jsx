import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Navbar from '../components/Navbar'
import { Upload, AlertCircle } from 'lucide-react'

function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const { addToast } = useToast()
  const [profileData, setProfileData] = useState({
    username: user.username,
    fullName: user.fullName || '',
    bio: user.bio || ''
  })

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    updateProfile(profileData)
    addToast('Profile updated successfully!', 'success')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      addToast('Profile picture updated!', 'success')
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
                    src={user.profileImage}
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
                    <Upload className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Click the upload button to change your profile picture
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
      </div>
    </div>
  )
}

export default ProfilePage
