/**
 * Undefined Route (404) Fallback Middleware
 * Returns structured JSON response for undefined endpoints.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Resource not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    suggestion: "Check API documentation or make sure the endpoint path is correct (e.g. GET /tasks or /api/tasks)."
  });
};
