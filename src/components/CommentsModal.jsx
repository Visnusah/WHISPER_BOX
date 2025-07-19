import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getImageUrl } from '../config/api'
import { commentsAPI } from '../services/api'
import { X, Trash2 } from 'lucide-react'

function CommentsModal({ post, onClose }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load comments when modal opens
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true)
        const response = await commentsAPI.getComments(post.id)
        if (response.success) {
          setComments(response.data.comments || [])
        }
      } catch (error) {
        console.error('Error loading comments:', error)
        setComments(post.comments || []) // Fallback to passed comments
      } finally {
        setIsLoading(false)
      }
    }

    loadComments()
  }, [post.id, post.comments])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const response = await commentsAPI.createComment(post.id, { text: newComment.trim() })
      
      if (response.success) {
        // Add the new comment to the local state
        setComments([...comments, response.data.comment])
        setNewComment('')
        addToast('Comment added successfully!', 'success')
      }
    } catch (error) {
      addToast(error.message || 'Failed to add comment', 'error')
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.deleteComment(post.id, commentId)
      setComments(comments.filter(c => c.id !== commentId))
      addToast('Comment deleted successfully!', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to delete comment', 'error')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments on "{post.title}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comments List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <img
                    src={getImageUrl(comment.author.profileImage)}
                    alt={comment.author.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/placeholder-avatar.svg'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {comment.author.username}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {(user.id === comment.author.id || user.isAdmin) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleAddComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="textarea-field"
              rows={3}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {newComment.length}/500 characters
              </span>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CommentsModal