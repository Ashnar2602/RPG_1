import { Request, Response } from 'express'
import { body } from 'express-validator'
import { AuthService } from '@/services/AuthService'
import { logout as logoutToken, refreshToken } from '@/middleware/auth'
import logger from '@/utils/logger'

// Validation rules
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters long and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true
    })
]

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body

      const result = await AuthService.register({
        email,
        username,
        password,
      })

      if (result.success) {
        res.status(201).json(result)
      } else {
        res.status(400).json(result)
      }

    } catch (error) {
      logger.error('Register controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      const result = await AuthService.login({
        email,
        password,
      })

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(401).json(result)
      }

    } catch (error) {
      logger.error('Login controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Logout user
  static async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization
      const token = authHeader?.split(' ')[1]

      if (token) {
        await logoutToken(token)
      }

      if (req.user) {
        await AuthService.logout(req.user.id)
      }

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      })

    } catch (error) {
      logger.error('Logout controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Get user profile
  static async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const profile = await AuthService.getProfile(req.user.id)

      if (profile) {
        res.status(200).json({
          success: true,
          data: profile
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'Profile not found'
        })
      }

    } catch (error) {
      logger.error('Get profile controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { username } = req.body

      const result = await AuthService.updateProfile(req.user.id, {
        username,
      })

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }

    } catch (error) {
      logger.error('Update profile controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Change password
  static async changePassword(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { currentPassword, newPassword } = req.body

      const result = await AuthService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      )

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }

    } catch (error) {
      logger.error('Change password controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken: refreshTokenString } = req.body

      if (!refreshTokenString) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        })
      }

      const result = await refreshToken(refreshTokenString)

      if (result) {
        res.status(200).json({
          success: true,
          token: result.token,
          refreshToken: result.refreshToken,
          message: 'Token refreshed successfully'
        })
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        })
      }

    } catch (error) {
      logger.error('Refresh token controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }

  // Get session info
  static async getSession(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const sessionInfo = await AuthService.getSessionInfo(req.user.id)

      res.status(200).json({
        success: true,
        data: sessionInfo
      })

    } catch (error) {
      logger.error('Get session controller error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}
