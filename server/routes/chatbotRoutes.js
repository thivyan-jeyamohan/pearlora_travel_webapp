import express from 'express';
import { handleChatQuery } from '../controllers/chatbotController.js';
// import { authenticateToken } from '../middleware/authMiddleware'; // Optional: Add if needed

const router = express.Router();

// POST /api/chatbot/query (ensure base path is correct in server.js)
router.post('/query', handleChatQuery); // No auth for general queries

export default router;