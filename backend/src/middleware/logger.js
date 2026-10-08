/**
 * Request Logging Middleware
 * Logs HTTP Method, Request URL, and Timestamp for every incoming request.
 */
export const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl || req.url} - ${new Date().toISOString()}`);
  next();
};
