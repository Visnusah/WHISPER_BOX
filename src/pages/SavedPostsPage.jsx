import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { savedPostsAPI } from '../services/api'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import { Bookmark } from 'lucide-react'

function SavedPostsPage() {
  const { user } = useAuth()
  const [savedPosts, setSavedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSavedPosts = async () => {
      try {
        setLoading(true)
        const posts = await savedPostsAPI.getSavedPosts()
        setSavedPosts(posts)
        setError(null)
      } catch (err) {
        console.error('Error loading saved posts:', err)
        setError('Failed to load saved posts')
      } finally {
        setLoading(false)
      }
    }

    if (user) { // Only load if user is authenticated
      loadSavedPosts()
    } else {
      setLoading(false)
      setSavedPosts([])
    }
  }, [user]) // Re-fetch when user authentication changes

  const handleDeletePost = (postId) => {
    setSavedPosts(savedPosts.filter(post => post.id !== postId))
  }

  const handleSavePost = (postId) => {
    setSavedPosts(savedPosts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ).filter(post => post.isSaved)) // Remove unsaved posts from this view
  }

  const handleVotePost = (postId, voteType) => {
    setSavedPosts(savedPosts.map(post => {
      if (post.id === postId) {
        let newVotes = post.votes
        let newUserVote = post.userVote

        if (post.userVote === voteType) {
          // Remove vote
          newUserVote = null
          newVotes += voteType === 'up' ? -1 : 1
        } else {
          // Add or change vote
          if (post.userVote) {
            // Changing vote
            newVotes += voteType === 'up' ? 2 : -2
          } else {
            // Adding vote
            newVotes += voteType === 'up' ? 1 : -1
          }
          newUserVote = voteType
        }

        return { ...post, votes: newVotes, userVote: newUserVote }
      }
      return post
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Bookmark className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Saved Posts
            </h1>
          </div>
          <p className="text-slate-600">
            Your collection of saved posts
          </p>
        </div>

        {/* Saved Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-text-600">Loading saved posts...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-text-800 mb-2">Failed to Load Saved Posts</h3>
              <p className="text-text-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary inline-flex items-center justify-center"
              >
                Try Again
              </button>
            </div>
          ) : savedPosts.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No saved posts yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start exploring and save posts you find interesting!
              </p>
              <a
                href="/home"
                className="btn-primary"
              >
                Explore Posts
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {savedPosts.length} saved post{savedPosts.length !== 1 ? 's' : ''}
                </p>
              </div>
              {savedPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  onSave={handleSavePost}
                  onVote={handleVotePost}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SavedPostsPage