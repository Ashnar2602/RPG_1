import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthUtils } from '../utils/auth.js';
import { prisma } from '../utils/prisma.js';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
      };
    }
  }
}

/**
 * Authenticate JWT token from Authorization header
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'NO_TOKEN' 
      });
    }

    try {
      const decoded = AuthUtils.verifyToken(token);
      
      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, email: true, isActive: true }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ 
          error: 'User not found or inactive',
          code: 'USER_INACTIVE' 
        });
      }

      req.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN' 
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      code: 'AUTH_ERROR' 
    });
  }
};

/**
 * Optional authentication - adds user to request if token is valid
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = AuthUtils.verifyToken(token);
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, username: true, email: true, isActive: true }
        });

        if (user && user.isActive) {
          req.user = {
            id: user.id,
            username: user.username,
            email: user.email
          };
        }
      } catch {
        // Invalid token - continue without user
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Continue without auth on error
  }
};

/**
 * Rate limiting middleware for authentication endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Temporarily increased for testing
  message: {
    error: 'Too many authentication attempts, try again later',
    code: 'RATE_LIMIT_AUTH'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for successful requests (status < 400)
    return false;
  }
});

/**
 * Rate limiting for general API endpoints
 */
export const apiRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests, try again later',
    code: 'RATE_LIMIT_API'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Middleware to require admin role
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_AUTH' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Admin access required',
        code: 'INSUFFICIENT_PERMISSIONS' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      code: 'ADMIN_CHECK_ERROR' 
    });
  }
};
