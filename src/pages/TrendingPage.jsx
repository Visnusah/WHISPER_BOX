import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { postsAPI } from '../services/api'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import { TrendingUp, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

function TrendingPage() {
  const { user } = useAuth()
  const [trendingPosts, setTrendingPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTrendingPosts = async () => {
      try {
        setLoading(true)
        let posts = await postsAPI.getTrendingPosts()
        
        // If trending endpoint doesn't exist, fallback to all posts sorted by votes
        if (!posts || posts.length === 0) {
          const allPosts = await postsAPI.getAllPosts()
          posts = allPosts.sort((a, b) => b.votes - a.votes).slice(0, 10)
        }
        
        setTrendingPosts(posts)
        setError(null)
      } catch (err) {
        console.error('Error loading trending posts:', err)
        setError('Failed to load trending posts')
      } finally {
        setLoading(false)
      }
    }

    loadTrendingPosts()
  }, [user]) // Re-fetch when user authentication changes

  const handleDeletePost = (postId) => {
    setTrendingPosts(trendingPosts.filter(post => post.id !== postId))
  }

  const handleSavePost = (postId) => {
    setTrendingPosts(trendingPosts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ))
  }

  const handleVotePost = (postId, voteType) => {
    setTrendingPosts(trendingPosts.map(post => {
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
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to="/home" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-slate-900">
                Trending Posts
              </h1>
            </div>
          </div>
          <p className="text-slate-600">
            Discover the most popular and engaging posts in the community.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/home" className="btn-primary flex-1 text-center inline-flex items-center justify-center">
              Go to Home Feed
            </Link>
            <Link to="/saved" className="btn-secondary flex-1 text-center inline-flex items-center justify-center">
              View Saved Posts
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-ghost flex-1 inline-flex items-center justify-center"
            >
              Refresh Trending
            </button>
          </div>
        </div>

        {/* Trending Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-text-600">Loading trending posts...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-text-800 mb-2">Failed to Load Trending Posts</h3>
              <p className="text-text-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary inline-flex items-center justify-center"
              >
                Try Again
              </button>
            </div>
          ) : trendingPosts.length === 0 ? (
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No trending posts yet.
              </h3>
              <p className="text-slate-500 mb-6">
                Be the first to create a post that trends!
              </p>
              <Link to="/create" className="btn-primary inline-flex items-center justify-center">
                Create Post
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing {trendingPosts.length} trending post{trendingPosts.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>Updated in real-time</span>
                </div>
              </div>
              {trendingPosts.map((post, index) => (
                <div key={post.id} className="relative">
                  {/* Trending Badge */}
                  <div className="absolute -top-2 left-6 z-10">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      #{index + 1} Trending
                    </span>
                  </div>
                  <PostCard
                    post={post}
                    onDelete={handleDeletePost}
                    onSave={handleSavePost}
                    onVote={handleVotePost}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrendingPage