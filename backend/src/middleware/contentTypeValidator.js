/**
 * Content-Type Header Validation Middleware
 * Rejects POST/PUT requests missing 'Content-Type: application/json' header.
 */
export const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: "Invalid or missing Content-Type header. Expected 'application/json' for request bodies.",
        receivedHeader: contentType || 'None'
      });
    }
  }
  next();
};
