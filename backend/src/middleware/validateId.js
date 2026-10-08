/**
 * Route-Specific ID Parameter Validation Middleware
 * Validates that ':id' is a positive integer before hitting in-memory controller (Prac 4).
 */
export const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({
      success: false,
      error: `Invalid task ID format: '${id}'. Task ID must be a positive integer.`
    });
  }

  // Store sanitized numeric ID on request object
  req.taskId = parsedId;
  next();
};
