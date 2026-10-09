import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  simulateError
} from '../controllers/taskController.js';
import { validateTaskId } from '../middleware/validateId.js';
import { validateContentType } from '../middleware/contentTypeValidator.js';
import { authenticate } from '../middleware/auth.js';
import { validateTaskInput } from '../middleware/validateTaskInput.js';

const router = Router();

// Test endpoint for verifying 500 error handler
router.get('/simulate/error', simulateError);

// Standard Protected CRUD endpoints (Practical 7 Middleware Pipeline)
router.get('/', authenticate, getAllTasks);
router.get('/:id', authenticate, validateTaskId, getTaskById);
router.post('/', authenticate, validateContentType, validateTaskInput, createTask);
router.put('/:id', authenticate, validateTaskId, validateContentType, validateTaskInput, updateTask);
router.delete('/:id', authenticate, validateTaskId, deleteTask);

export default router;
