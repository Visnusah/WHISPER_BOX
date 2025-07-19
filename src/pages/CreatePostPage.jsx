import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { postsAPI } from '../services/api'
import Navbar from '../components/Navbar'
import { X, Hash, Type, FileText, Sparkles, Send } from 'lucide-react'

function CreatePostPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hashtags: []
  })
  const [hashtagInput, setHashtagInput] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddHashtag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = hashtagInput.trim().replace('#', '').toLowerCase()
      
      if (tag && !formData.hashtags.includes(tag) && formData.hashtags.length < 5) {
        setFormData({
          ...formData,
          hashtags: [...formData.hashtags, tag]
        })
        setHashtagInput('')
      } else if (formData.hashtags.length >= 5) {
        addToast('Maximum 5 hashtags allowed', 'warning')
      }
    }
  }

  const removeHashtag = (tagToRemove) => {
    setFormData({
      ...formData,
      hashtags: formData.hashtags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast('Please fill in both title and description', 'error')
      return
    }

    try {
      await postsAPI.createPost({
        title: formData.title.trim(),
        description: formData.description.trim(),
        hashtags: formData.hashtags
      })

      addToast('Post created successfully!', 'success')
      navigate('/home')
    } catch (error) {
      console.error('Error creating post:', error)
      addToast(error.message || 'Failed to create post', 'error')
    }
  }

  const suggestedTags = ['thoughts', 'inspiration', 'life', 'technology', 'creativity', 'discussion']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-medium">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-800">
                Create New Post
              </h1>
              <p className="text-text-600">
                Share your thoughts with the community
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="card-gradient animate-slide-up">
            <div className="form-group">
              <label htmlFor="title" className="form-label flex items-center space-x-2">
                <Type className="w-4 h-4" />
                <span>Title *</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="input-field text-lg font-semibold"
                placeholder="What's on your mind?"
                maxLength={200}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="form-help">
                  Make it catchy and descriptive
                </p>
                <span className={`text-sm ${formData.title.length > 180 ? 'text-red-500' : 'text-text-500'}`}>
                  {formData.title.length}/200
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card-gradient animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="form-group">
              <label htmlFor="description" className="form-label flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Description *</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea-field text-lg leading-relaxed"
                placeholder="Share your thoughts in detail..."
                rows={8}
                maxLength={2000}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="form-help">
                  Express yourself freely and authentically
                </p>
                <span className={`text-sm ${formData.description.length > 1800 ? 'text-red-500' : 'text-text-500'}`}>
                  {formData.description.length}/2000
                </span>
              </div>
            </div>
          </div>

          {/* Hashtags */}
          <div className="card-gradient animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="form-group">
              <label htmlFor="hashtags" className="form-label flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Hashtags</span>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {formData.hashtags.length}/5
                </span>
              </label>
              <input
                id="hashtags"
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleAddHashtag}
                className="input-field"
                placeholder="Type a hashtag and press Enter"
                disabled={formData.hashtags.length >= 5}
              />
              <p className="form-help">
                Press Enter or comma to add tags. Maximum 5 tags allowed.
              </p>
              
              {/* Selected Hashtags */}
              {formData.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 p-4 bg-background-50 rounded-xl border border-background-200">
                  {formData.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 text-sm rounded-xl font-medium border border-primary-200 animate-scale-in"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeHashtag(tag)}
                        className="text-primary-500 hover:text-primary-700 transition-colors hover:scale-110 transform"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested Tags */}
              {formData.hashtags.length < 5 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-text-600 mb-2">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags
                      .filter(tag => !formData.hashtags.includes(tag))
                      .slice(0, 6)
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (formData.hashtags.length < 5) {
                              setFormData({
                                ...formData,
                                hashtags: [...formData.hashtags, tag]
                              })
                            }
                          }}
                          className="px-3 py-1.5 bg-background-100 hover:bg-primary-100 text-text-600 hover:text-primary-700 text-sm rounded-lg transition-all duration-300 border border-background-200 hover:border-primary-200"
                        >
                          #{tag}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="btn-secondary inline-flex items-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary group inline-flex items-center"
              disabled={!formData.title.trim() || !formData.description.trim()}
            >
              <Send className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
              Publish Post
            </button>
          </div>
        </form>

        {/* Preview Card */}
        {(formData.title || formData.description) && (
          <div className="mt-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-text-700 mb-4">Preview:</h3>
            <div className="card border-2 border-dashed border-primary-200 bg-primary-50/30">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={user.profileImage || '/placeholder-avatar.svg'}
                  alt={user.username}
                  className="w-10 h-10 profile-avatar"
                  onError={(e) => {
                    e.target.src = '/placeholder-avatar.svg'
                  }}
                />
                <div>
                  <h4 className="font-semibold text-text-800">{user.username}</h4>
                  <p className="text-sm text-text-500">Just now</p>
                </div>
              </div>
              
              {formData.title && (
                <h3 className="text-lg font-semibold text-text-800 mb-2">
                  {formData.title}
                </h3>
              )}
              
              {formData.description && (
                <p className="text-text-700 mb-4 leading-relaxed">
                  {formData.description}
                </p>
              )}
              
              {formData.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.hashtags.map((tag) => (
                    <span key={tag} className="hashtag">
                      #{tag}
                    </span>
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

export default CreatePostPage