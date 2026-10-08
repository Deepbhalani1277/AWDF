/**
 * Global Error Handling Middleware
 * Must be placed last in the pipeline with 4 parameters (err, req, res, next).
 */
export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Something went wrong',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
