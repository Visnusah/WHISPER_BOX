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

// Public routes
router.get('/:id', getUserById);

// Admin only routes
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.put('/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);
router.get('/admin/dashboard-stats', authenticateToken, requireAdmin, getDashboardStats);

export default router;
