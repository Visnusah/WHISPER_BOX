import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { X, Trash2 } from 'lucide-react'

function CommentsModal({ post, onClose }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [comments, setComments] = useState(post.comments)
  const [newComment, setNewComment] = useState('')

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      text: newComment,
      author: {
        id: user.id,
        username: user.username,
        profileImage: user.profileImage
      },
      createdAt: new Date().toISOString()
    }

    setComments([...comments, comment])
    setNewComment('')
    addToast('Comment added!', 'success')
  }

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(c => c.id !== commentId))
    addToast('Comment deleted!', 'success')
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
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <img
                    src={comment.author.profileImage}
                    alt={comment.author.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
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