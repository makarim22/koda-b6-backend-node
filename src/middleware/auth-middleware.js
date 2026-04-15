import { verifyJWT, JWTError } from "../lib/jwt.js"
import config from '../config/config.js';

/**
 * Middleware to authenticate JWT token from request headers
 * Extracts and verifies the token, adds decoded claims to req.user
 */
export function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Extract token from "Bearer <token>" format
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No authentication token provided',
    });
  }

  try {
    const claims = verifyJWT(token, config);
    req.user = claims;
    next();
  } catch (err) {
    if (err instanceof JWTError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: err.message,
      });
    }
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Token verification failed',
    });
  }
}

/**
 * Middleware to authorize users based on their role
 * Must be used after authenticateToken middleware
 */
export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User information not found',
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}

/**
 * Combined middleware for authenticating and authorizing in one call
 */
export function requireAuth(...allowedRoles) {
  return [authenticateJWT, authorizeRole(...allowedRoles)];
}