import mongoose from 'mongoose';

/**
 * Route-Specific ID Parameter Validation Middleware (Practical 5)
 * Validates that ':id' matches a valid MongoDB ObjectId format before hitting the controller.
 */
export const validateTaskId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: `Invalid task ID format: '${id}'. Must be a valid 24-character hex MongoDB ObjectId.`
    });
  }

  req.taskId = id;
  next();
};
