/**
 * Request Input Validation Middleware - Practical 7
 * Enforces server-side validation rules before requests hit database controllers.
 */
export const validateTaskInput = (req, res, next) => {
  const { title, priority } = req.body;
  const errors = [];

  // For POST requests, title is mandatory
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title is required and cannot be empty.');
    }
  }

  // For PUT requests, if title is provided, it cannot be empty
  if (req.method === 'PUT' && title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title cannot be empty.');
    }
  }

  // Priority enum check if supplied
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(String(priority).toLowerCase())) {
      errors.push(`Invalid priority '${priority}'. Allowed values are: low, medium, high.`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Input Validation Error',
      messages: errors
    });
  }

  next();
};
