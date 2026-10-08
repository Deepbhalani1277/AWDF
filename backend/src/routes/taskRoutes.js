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

const router = Router();

// Test endpoint for verifying 500 error handler
router.get('/simulate/error', simulateError);

// Standard CRUD endpoints
router.get('/', getAllTasks);
router.get('/:id', validateTaskId, getTaskById);
router.post('/', validateContentType, createTask);
router.put('/:id', validateTaskId, validateContentType, updateTask);
router.delete('/:id', validateTaskId, deleteTask);

export default router;
