import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getImageUrl } from '../config/api'
import { voteOnPost, removeVoteFromPost, savePost, unsavePost, postsAPI } from '../services/api'
import { ChevronUp, ChevronDown, MessageCircle, Bookmark, Share2, Trash2, MoreHorizontal } from 'lucide-react'
import CommentsModal from './CommentsModal'

function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [showComments, setShowComments] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [postState, setPostState] = useState({
    votes: post.votes || 0,
    userVote: post.userVote || null,
    isSaved: post.isSaved || false
  })

  const handleSave = async () => {
    if (!user) {
      addToast('Please log in to save posts', 'error')
      return
    }

    setIsSaving(true)
    try {
      if (postState.isSaved) {
        await unsavePost(post.id)
        setPostState(prev => ({ ...prev, isSaved: false }))
        addToast('Post removed from saved posts!', 'success')
      } else {
        await savePost(post.id)
        setPostState(prev => ({ ...prev, isSaved: true }))
        addToast('Post saved successfully!', 'success')
      }
      
      if (onUpdate) onUpdate()
    } catch (error) {
      addToast(error.message || 'Failed to save post', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post: ${post.title}`)
    addToast('Link copied to clipboard!', 'success')
  }

  const handleDelete = async () => {
    try {
      await postsAPI.deletePost(post.id)
      if (onDelete) onDelete(post.id)
      setShowDeleteConfirm(false)
      addToast('Post deleted successfully!', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to delete post', 'error')
      setShowDeleteConfirm(false)
    }
  }

  const handleVote = async (voteType) => {
    if (!user) {
      addToast('Please log in to vote', 'error')
      return
    }

    setIsVoting(true)
    try {
      let response
      
      // If clicking the same vote type, remove the vote
      if (postState.userVote === voteType) {
        response = await removeVoteFromPost(post.id)
        setPostState(prev => ({
          ...prev,
          userVote: null,
          votes: prev.votes + (voteType === 'up' ? -1 : 1)
        }))
        addToast('Vote removed', 'success')
      } else {
        // Otherwise, vote
        response = await voteOnPost(post.id, voteType)
        
        let voteChange = 0
        if (postState.userVote === null) {
          // New vote
          voteChange = voteType === 'up' ? 1 : -1
        } else {
          // Changing vote
          voteChange = voteType === 'up' ? 2 : -2
        }
        
        setPostState(prev => ({
          ...prev,
          userVote: voteType,
          votes: prev.votes + voteChange
        }))
        
        addToast(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} successfully!`, 'success')
      }
      
      if (onUpdate) onUpdate()
    } catch (error) {
      addToast(error.message || 'Failed to vote', 'error')
    } finally {
      setIsVoting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <>
      <article className="post-card group">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={getImageUrl(post.author?.profileImage)}
                alt={post.author?.username || 'User'}
                className="w-12 h-12 profile-avatar"
                onError={(e) => {
                  e.target.src = '/placeholder-avatar.svg'
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h4 className="font-semibold text-text-800 hover:text-primary-600 transition-colors cursor-pointer">
                {post.author.username}
              </h4>
              <div className="flex items-center space-x-2 text-sm text-text-500">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span className="text-accent-600">Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {(user.id === post.author.id || user.isAdmin) && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="action-button text-text-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Delete post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button className="action-button opacity-0 group-hover:opacity-100 transition-all duration-300">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-4">
          <h3 className="text-xl font-bold text-text-800 leading-tight hover:text-primary-700 transition-colors cursor-pointer">
            {post.title}
          </h3>
          <p className="text-text-700 leading-relaxed text-lg">
            {post.description}
          </p>
        </div>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.hashtags.map((tag) => (
              <span key={tag} className="hashtag cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-background-200">
          <div className="flex items-center space-x-6">
            {/* Voting */}
            <div className="flex items-center space-x-1 bg-background-50 rounded-2xl p-1">
              <button
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`vote-button ${postState.userVote === 'up' ? 'upvoted' : ''} ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Upvote"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-text-700 px-3 min-w-[2rem] text-center">
                {postState.votes}
              </span>
              <button
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`vote-button ${postState.userVote === 'down' ? 'downvoted' : ''} ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Downvote"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Comments */}
            <button
              onClick={() => setShowComments(true)}
              className="flex items-center space-x-2 action-button hover:bg-primary-50 hover:text-primary-600"
              title="View comments"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments?.length || 0}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Save */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`action-button transition-all duration-300 ${
                postState.isSaved 
                  ? 'bg-accent-100 text-accent-600 shadow-soft' 
                  : 'hover:bg-accent-50 hover:text-accent-600'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={postState.isSaved ? 'Unsave post' : 'Save post'}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Bookmark className={`w-5 h-5 transition-all duration-300 ${postState.isSaved ? 'fill-current' : ''}`} />
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="action-button hover:bg-secondary-50 hover:text-secondary-600"
              title="Share post"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal
          post={post}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-800">Delete Post</h3>
                  <p className="text-text-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-text-600 mb-6">
                Are you sure you want to delete this post? All comments and interactions will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-danger"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PostCard