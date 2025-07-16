import express from 'express';
import { 
  votePost, 
  getPostVotes,
  removeVote 
} from '../controllers/voteController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateVote } from '../middleware/validation.js';

const router = express.Router();

// Get post votes (public)
router.get('/:postId/votes', optionalAuth, getPostVotes);

// Vote on a post (protected)
router.post('/:postId/vote', authenticateToken, validateVote, votePost);

// Remove vote from a post (protected)
router.delete('/:postId/vote', authenticateToken, removeVote);

export default router;
