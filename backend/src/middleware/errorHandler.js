/**
 * Centralized Global Error Handling Middleware - Practical 5
 * Intercepts Mongoose ValidationErrors and CastErrors to return structured JSON
 * instead of raw internal database error objects.
 */
export const globalErrorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err.name, err.message);

  // 1. Mongoose Validation Error (e.g. required field missing, enum mismatch)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages: messages
    });
  }

  // 2. Mongoose Cast Error (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Resource not found with id of ${err.value} (Invalid ID format)`
    });
  }

  // 3. Fallback General Server Error
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
