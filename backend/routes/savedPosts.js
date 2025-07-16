import express from 'express';
import {
  getSavedPosts,
  savePost,
  unsavePost
} from '../controllers/savedPostController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/', authenticateToken, getSavedPosts);
router.post('/:postId', authenticateToken, savePost);
router.delete('/:postId', authenticateToken, unsavePost);

export default router;
