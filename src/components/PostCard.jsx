import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { ChevronUp, ChevronDown, MessageCircle, Bookmark, Share2, Trash2, Heart, MoreHorizontal } from 'lucide-react'
import CommentsModal from './CommentsModal'

function PostCard({ post, onDelete, onSave, onVote }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [showComments, setShowComments] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleSave = () => {
    onSave(post.id)
    addToast(`Post ${post.isSaved ? 'removed from' : 'added to'} saved posts!`, 'success')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post: ${post.title}`)
    addToast('Link copied to clipboard!', 'success')
  }

  const handleDelete = () => {
    onDelete(post.id)
    setShowDeleteConfirm(false)
    addToast('Post deleted successfully!', 'success')
  }

  const handleVote = (type) => {
    onVote(post.id, type)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    addToast(isLiked ? 'Removed like' : 'Post liked!', 'success')
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
                src={post.author.profileImage}
                alt={post.author.username}
                className="w-12 h-12 profile-avatar"
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
                className={`vote-button ${post.userVote === 'up' ? 'upvoted' : ''}`}
                title="Upvote"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-text-700 px-3 min-w-[2rem] text-center">
                {post.votes}
              </span>
              <button
                onClick={() => handleVote('down')}
                className={`vote-button ${post.userVote === 'down' ? 'downvoted' : ''}`}
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
              <span className="text-sm font-medium">{post.comments.length}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 action-button transition-all duration-300 ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'hover:bg-red-50 hover:text-red-500'
              }`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
              <span className="text-sm font-medium">
                {isLiked ? '1' : '0'}
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Save */}
            <button
              onClick={handleSave}
              className={`action-button transition-all duration-300 ${
                post.isSaved 
                  ? 'bg-accent-100 text-accent-600 shadow-soft' 
                  : 'hover:bg-accent-50 hover:text-accent-600'
              }`}
              title={post.isSaved ? 'Unsave post' : 'Save post'}
            >
              <Bookmark className={`w-5 h-5 transition-all duration-300 ${post.isSaved ? 'fill-current' : ''}`} />
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