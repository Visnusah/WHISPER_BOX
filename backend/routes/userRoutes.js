import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  toggleUserStatus, 
  deleteUser, 
  getDashboardStats 
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/stats', authenticateToken, requireAdmin, getDashboardStats);
router.get('/:id', authenticateToken, requireAdmin, getUserById);
router.put('/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;
