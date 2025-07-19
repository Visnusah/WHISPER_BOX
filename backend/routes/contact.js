import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

// Contact form submission
router.post('/send', sendContactMessage);

export default router;
