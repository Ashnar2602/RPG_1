/**
 * Authentication Middleware
 * JWT-based authentication system for protected routes
 */

const jwt = require('jsonwebtoken');
const { db } = require('../../database/connection');

/**
 * Middleware to verify JWT token and load user data
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({
        error: 'Authentication token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
          code: 'TOKEN_INVALID'
        });
      } else {
        throw jwtError;
      }
    }

    // Check if session exists and is valid
    const sessionResult = await db.query(`
      SELECT s.*, u.username, u.account_status
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = $1 AND s.expires_at > NOW()
    `, [token]);

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Session expired or invalid',
        code: 'SESSION_INVALID'
      });
    }

    const session = sessionResult.rows[0];

    // Check account status
    if (session.account_status !== 'active') {
      return res.status(403).json({
        error: 'Account suspended',
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    // Update session activity
    await db.query(
      'UPDATE user_sessions SET last_activity = NOW() WHERE id = $1',
      [session.id]
    );

    // Attach user data to request
    req.user = {
      id: session.user_id,
      username: session.username,
      sessionId: session.id,
      accountStatus: session.account_status
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication system error',
      code: 'AUTH_SYSTEM_ERROR'
    });
  }
};

/**
 * Middleware to check if user has an active character
 */
const requireCharacter = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Get user's active character
    const characterResult = await db.query(`
      SELECT id, name, level, class, current_location_id
      FROM characters 
      WHERE user_id = $1 
      ORDER BY last_played DESC 
      LIMIT 1
    `, [req.user.id]);

    if (characterResult.rows.length === 0) {
      return res.status(404).json({
        error: 'No character found. Please create a character first.',
        code: 'CHARACTER_REQUIRED'
      });
    }

    // Attach character data to request
    req.character = characterResult.rows[0];
    next();
  } catch (error) {
    console.error('Character middleware error:', error);
    res.status(500).json({
      error: 'Character system error',
      code: 'CHARACTER_SYSTEM_ERROR'
    });
  }
};

/**
 * Middleware to check admin privileges
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Check if user has admin privileges
    const adminResult = await db.query(
      'SELECT admin_level FROM users WHERE id = $1 AND admin_level > 0',
      [req.user.id]
    );

    if (adminResult.rows.length === 0) {
      return res.status(403).json({
        error: 'Administrator privileges required',
        code: 'ADMIN_REQUIRED'
      });
    }

    req.user.adminLevel = adminResult.rows[0].admin_level;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      error: 'Authorization system error',
      code: 'AUTH_SYSTEM_ERROR'
    });
  }
};

/**
 * Rate limiting middleware for sensitive operations
 */
const rateLimitSensitive = (windowMs = 15 * 60 * 1000, maxAttempts = 5) => {
  const attempts = new Map(); // In production, use Redis

  return (req, res, next) => {
    const key = req.ip + (req.user ? `:${req.user.id}` : '');
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    const userAttempts = attempts.get(key) || [];
    const recentAttempts = userAttempts.filter(time => time > windowStart);

    if (recentAttempts.length >= maxAttempts) {
      return res.status(429).json({
        error: 'Too many attempts. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
      });
    }

    // Record this attempt
    recentAttempts.push(now);
    attempts.set(key, recentAttempts);

    next();
  };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return next(); // Continue without authentication
    }

    // Try to verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const sessionResult = await db.query(`
        SELECT s.*, u.username, u.account_status
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = $1 AND s.expires_at > NOW()
      `, [token]);

      if (sessionResult.rows.length > 0) {
        const session = sessionResult.rows[0];
        
        if (session.account_status === 'active') {
          req.user = {
            id: session.user_id,
            username: session.username,
            sessionId: session.id,
            accountStatus: session.account_status
          };
        }
      }
    } catch (jwtError) {
      // Ignore JWT errors in optional auth
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without authentication
  }
};

module.exports = {
  authMiddleware,
  requireCharacter,
  requireAdmin,
  rateLimitSensitive,
  optionalAuth
};
