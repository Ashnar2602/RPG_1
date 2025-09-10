/**
 * Authentication Routes
 * Handles user registration, login, logout, and profile management
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { db } = require('../../database/connection');
const { authMiddleware, rateLimitSensitive } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', [
  rateLimitSensitive(15 * 60 * 1000, 3), // 3 attempts per 15 minutes
  body('username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters, alphanumeric and underscores only'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username.toLowerCase(), email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Username or email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user account
    const userResult = await db.query(`
      INSERT INTO users (username, email, password_hash, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, username, email, created_at
    `, [username.toLowerCase(), email.toLowerCase(), passwordHash]);

    const user = userResult.rows[0];

    // Create session token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Save session
    await db.query(`
      INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
      VALUES ($1, $2, NOW() + INTERVAL '7 days', $3, $4)
    `, [user.id, token, req.ip, req.get('User-Agent')]);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    console.log(`✅ New user registered: ${username} (${user.id})`);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', [
  rateLimitSensitive(15 * 60 * 1000, 5), // 5 attempts per 15 minutes
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, password } = req.body;

    // Get user by username or email
    const userResult = await db.query(`
      SELECT id, username, email, password_hash, account_status, last_login
      FROM users 
      WHERE username = $1 OR email = $1
    `, [username.toLowerCase()]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = userResult.rows[0];

    // Check account status
    if (user.account_status !== 'active') {
      return res.status(403).json({
        error: 'Account suspended or banned',
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Create session token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Save session and update last login
    await db.transaction(async (client) => {
      await client.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );

      await client.query(`
        INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
        VALUES ($1, $2, NOW() + INTERVAL '7 days', $3, $4)
      `, [user.id, token, req.ip, req.get('User-Agent')]);
    });

    // Get user's characters
    const charactersResult = await db.query(`
      SELECT id, name, level, class, last_played
      FROM characters 
      WHERE user_id = $1 
      ORDER BY last_played DESC
    `, [user.id]);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        lastLogin: user.last_login
      },
      characters: charactersResult.rows,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    console.log(`✅ User logged in: ${user.username} (${user.id})`);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout
 * User logout (invalidate current session)
 */
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Remove current session
    await db.query(
      'DELETE FROM user_sessions WHERE id = $1',
      [req.user.sessionId]
    );

    res.json({
      message: 'Logged out successfully'
    });

    console.log(`✅ User logged out: ${req.user.username} (${req.user.id})`);

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout-all
 * Logout from all devices (invalidate all sessions)
 */
router.post('/logout-all', authMiddleware, async (req, res) => {
  try {
    // Remove all sessions for this user
    const result = await db.query(
      'DELETE FROM user_sessions WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      message: 'Logged out from all devices successfully',
      sessionsRemoved: result.rowCount
    });

    console.log(`✅ User logged out from all devices: ${req.user.username} (${req.user.id})`);

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Get detailed user information
    const userResult = await db.query(`
      SELECT 
        u.id, u.username, u.email, u.created_at, u.last_login,
        u.account_status, u.subscription_type,
        COUNT(c.id) as character_count
      FROM users u
      LEFT JOIN characters c ON u.id = c.user_id
      WHERE u.id = $1
      GROUP BY u.id
    `, [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    // Get active sessions
    const sessionsResult = await db.query(`
      SELECT id, created_at, last_activity, ip_address, user_agent
      FROM user_sessions 
      WHERE user_id = $1 AND expires_at > NOW()
      ORDER BY last_activity DESC
    `, [req.user.id]);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        accountStatus: user.account_status,
        subscriptionType: user.subscription_type,
        characterCount: parseInt(user.character_count)
      },
      sessions: sessionsResult.rows.map(session => ({
        id: session.id,
        createdAt: session.created_at,
        lastActivity: session.last_activity,
        ipAddress: session.ip_address,
        userAgent: session.user_agent,
        isCurrent: session.id === req.user.sessionId
      }))
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      code: 'PROFILE_ERROR'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', [
  authMiddleware,
  body('email').optional().isEmail().normalizeEmail(),
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').optional().isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, currentPassword, newPassword } = req.body;

    // Get current user data
    const userResult = await db.query(
      'SELECT email, password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = userResult.rows[0];

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Current password is incorrect',
        code: 'INVALID_PASSWORD'
      });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    // Update email if provided
    if (email && email !== user.email) {
      // Check if email is already taken
      const emailExists = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );

      if (emailExists.rows.length > 0) {
        return res.status(409).json({
          error: 'Email already in use',
          code: 'EMAIL_EXISTS'
        });
      }

      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    // Update password if provided
    if (newPassword) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);
      
      updates.push(`password_hash = $${paramCount++}`);
      values.push(passwordHash);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No changes provided',
        code: 'NO_CHANGES'
      });
    }

    // Update user
    updates.push(`updated_at = NOW()`);
    values.push(req.user.id);

    await db.query(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
    `, values);

    res.json({
      message: 'Profile updated successfully'
    });

    console.log(`✅ Profile updated: ${req.user.username} (${req.user.id})`);

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      code: 'PROFILE_UPDATE_ERROR'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    // Create new token
    const token = jwt.sign(
      { userId: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Update session token
    await db.query(`
      UPDATE user_sessions 
      SET session_token = $1, expires_at = NOW() + INTERVAL '7 days', last_activity = NOW()
      WHERE id = $2
    `, [token, req.user.sessionId]);

    res.json({
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      code: 'TOKEN_REFRESH_ERROR'
    });
  }
});

module.exports = router;
