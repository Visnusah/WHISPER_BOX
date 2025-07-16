import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  votePost,
  getTrendingPosts
} from '../controllers/postController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validatePost } from '../middleware/validation.js';

const router = express.Router();

// Public routes (with optional auth for user-specific data)
router.get('/', optionalAuth, getAllPosts);
router.get('/trending', optionalAuth, getTrendingPosts);
router.get('/:id', optionalAuth, getPostById);

// Protected routes
router.post('/', authenticateToken, validatePost, createPost);
router.put('/:id', authenticateToken, validatePost, updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/:id/vote', authenticateToken, votePost);

export default router;
