import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware - Practical 7
 * Verifies JWT token from 'Authorization: Bearer <token>' header.
 * Attaches decoded payload to req.user or returns 401 Unauthorized.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided. Expected format: Bearer <token>.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.'
    });
  }
};
