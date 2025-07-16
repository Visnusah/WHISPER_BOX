import express from 'express';
import { 
  getCommentsByPost, 
  createComment, 
  updateComment, 
  deleteComment 
} from '../controllers/commentController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateComment } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/:postId/comments', optionalAuth, getCommentsByPost);

// Protected routes
router.post('/:postId/comments', authenticateToken, validateComment, createComment);
router.put('/:postId/comments/:commentId', authenticateToken, validateComment, updateComment);
router.delete('/:postId/comments/:commentId', authenticateToken, deleteComment);

export default router;
