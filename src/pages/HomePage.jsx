import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { postsAPI } from '../services/api'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import { Search, Filter, Sparkles, TrendingUp, Clock, Star } from 'lucide-react'

function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterTag, setFilterTag] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load posts from API
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const postsData = await postsAPI.getAllPosts()
        setPosts(postsData)
        setFilteredPosts(postsData)
        setError(null)
      } catch (err) {
        console.error('Error loading posts:', err)
        setError('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  useEffect(() => {
    let filtered = [...posts]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(post => 
        post.hashtags.includes(filterTag)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'popular':
          return b.votes - a.votes
        default:
          return 0
      }
    })

    setFilteredPosts(filtered)
  }, [posts, searchTerm, sortBy, filterTag])

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  const handleSavePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ))
  }

  const handleVotePost = (postId, voteType) => {
    setPosts(posts.map(post => {
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

  const getAllTags = () => {
    const tags = new Set()
    posts.forEach(post => {
      post.hashtags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'oldest', label: 'Oldest First', icon: Clock },
    { value: 'popular', label: 'Most Popular', icon: Star }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-medium">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-800 flex items-center">
                Welcome back, <span className="text-gradient ml-2">{user.username}</span>!
              </h1>
              <p className="text-text-600">
                Discover and share thoughts with the community
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-gradient mb-8 animate-slide-up">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="form-group">
              <label className="form-label flex items-center space-x-2 mb-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts, hashtags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="form-group">
              <label className="form-label flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Sort by</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Tag */}
            <div className="form-group">
              <label className="form-label flex items-center space-x-2 mb-2">
                <Filter className="w-4 h-4" />
                <span>Filter by tag</span>
              </label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="input-field"
              >
                <option value="all">All tags</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>#{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterTag !== 'all') && (
            <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-background-200">
              <span className="text-sm font-medium text-text-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterTag !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full">
                  Tag: #{filterTag}
                  <button
                    onClick={() => setFilterTag('all')}
                    className="ml-2 text-secondary-500 hover:text-secondary-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-text-600">Loading posts...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-text-800 mb-2">Failed to Load Posts</h3>
              <p className="text-text-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary inline-flex items-center justify-center"
              >
                Try Again
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-text-700 mb-4">No posts found</h3>
              {searchTerm ? (
                <div className="space-y-2">
                  <p className="text-text-500">
                    No posts match your search for "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <p className="text-text-500">
                  Try adjusting your filters or create the first post!
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between animate-fade-in">
                <p className="text-sm text-text-600 flex items-center space-x-2">
                  <span>Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</span>
                </p>
                <div className="flex items-center space-x-2 text-sm text-text-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live updates</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PostCard
                      post={post}
                      onDelete={handleDeletePost}
                      onSave={handleSavePost}
                      onVote={handleVotePost}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage