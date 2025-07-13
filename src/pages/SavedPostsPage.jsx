import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { mockPosts } from '../data/mockData'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import { Bookmark } from 'lucide-react'

function SavedPostsPage() {
  const { user } = useAuth()
  const [savedPosts, setSavedPosts] = useState([])

  useEffect(() => {
    // In a real app, this would fetch saved posts from an API
    // For now, we'll simulate some saved posts
    const simulatedSavedPosts = mockPosts.slice(0, 2).map(post => ({
      ...post,
      isSaved: true,
      userVote: null
    }))
    setSavedPosts(simulatedSavedPosts)
  }, [])

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
          {savedPosts.length === 0 ? (
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