import express from 'express';
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateComment } from '../middleware/validation.js';

const router = express.Router();

// Get comments for a post (public)
router.get('/:postId/comments', getCommentsByPost);

// Protected routes
router.post('/:postId/comments', authenticateToken, validateComment, createComment);
router.put('/:postId/comments/:commentId', authenticateToken, validateComment, updateComment);
router.delete('/:postId/comments/:commentId', authenticateToken, deleteComment);

export default router;
