import express from 'express';
const router = express.Router();
import { getReport } from '../controllers/reportController.js';

router.get('/', getReport);

export default router;