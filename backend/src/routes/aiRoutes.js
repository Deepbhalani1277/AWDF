import { Router } from 'express';
import { generateTaskDescription } from '../controllers/aiController.js';

const router = Router();

// POST /api/ai/generate-description
router.post('/generate-description', generateTaskDescription);

export default router;
