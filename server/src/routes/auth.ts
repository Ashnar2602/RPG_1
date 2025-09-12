import { Router } from 'express';
import * as authController from '../controllers/auth/authController.js';
import { authenticateToken, authRateLimit } from '../middleware/auth.js';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authRateLimit);

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', authenticateToken, authController.changePassword);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset user password with temporary password
 * @access Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route POST /api/auth/update-temp-password
 * @desc Update temporary password with new permanent password
 * @access Private
 */
router.post('/update-temp-password', authenticateToken, authController.updateTempPassword);

export default router;
