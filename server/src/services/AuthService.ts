import bcrypt from 'bcryptjs'
import prisma from '@/utils/database'
import { generateToken, generateRefreshToken } from '@/middleware/auth'
import logger from '@/utils/logger'
import config from '@/config'
import { redisUtils } from '@/utils/redis'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  username: string
  password: string
}

interface AuthResult {
  success: boolean
  token?: string
  refreshToken?: string
  user?: any
  message?: string
}

export class AuthService {
  // Register new user
  static async register(data: RegisterData): Promise<AuthResult> {
    try {
      const { email, username, password } = data

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() }
          ]
        }
      })

      if (existingUser) {
        return {
          success: false,
          message: existingUser.email === email.toLowerCase() 
            ? 'Email already registered' 
            : 'Username already taken'
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, config.bcryptRounds)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          username: true,
          isActive: true,
          isPremium: true,
          createdAt: true,
        }
      })

      // Generate tokens
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      })

      const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        username: user.username,
      })

      // Cache user session
      await redisUtils.set(
        `user:session:${user.id}`,
        JSON.stringify({
          id: user.id,
          email: user.email,
          username: user.username,
          loginTime: new Date().toISOString(),
        }),
        config.sessionTimeout / 1000
      )

      logger.info(`New user registered: ${user.username} (${user.email})`)

      return {
        success: true,
        token,
        refreshToken,
        user,
        message: 'Registration successful'
      }

    } catch (error) {
      logger.error('Registration error:', error)
      return {
        success: false,
        message: 'Registration failed'
      }
    }
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { email, password } = credentials

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          isActive: true,
          isPremium: true,
          createdAt: true,
        }
      })

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      if (!user.isActive) {
        return {
          success: false,
          message: 'Account is disabled'
        }
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          lastLogin: new Date(),
          isOnline: true,
        }
      })

      // Generate tokens
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      })

      const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        username: user.username,
      })

      // Cache user session
      await redisUtils.set(
        `user:session:${user.id}`,
        JSON.stringify({
          id: user.id,
          email: user.email,
          username: user.username,
          loginTime: new Date().toISOString(),
        }),
        config.sessionTimeout / 1000
      )

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      logger.info(`User logged in: ${user.username} (${user.email})`)

      return {
        success: true,
        token,
        refreshToken,
        user: userWithoutPassword,
        message: 'Login successful'
      }

    } catch (error) {
      logger.error('Login error:', error)
      return {
        success: false,
        message: 'Login failed'
      }
    }
  }

  // Logout user
  static async logout(userId: string): Promise<boolean> {
    try {
      // Update user online status
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false }
      })

      // Remove user session from cache
      await redisUtils.del(`user:session:${userId}`)

      logger.info(`User logged out: ${userId}`)
      return true

    } catch (error) {
      logger.error('Logout error:', error)
      return false
    }
  }

  // Get user profile
  static async getProfile(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          isActive: true,
          isPremium: true,
          premiumUntil: true,
          createdAt: true,
          lastLogin: true,
          characters: {
            select: {
              id: true,
              name: true,
              race: true,
              characterClass: true,
              level: true,
              experience: true,
              currentHealth: true,
              location: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        }
      })

      return user

    } catch (error) {
      logger.error('Get profile error:', error)
      return null
    }
  }

  // Update user profile
  static async updateProfile(userId: string, data: { username?: string }): Promise<AuthResult> {
    try {
      const { username } = data

      // Check if username is taken
      if (username) {
        const existingUser = await prisma.user.findFirst({
          where: {
            username: username.toLowerCase(),
            NOT: { id: userId }
          }
        })

        if (existingUser) {
          return {
            success: false,
            message: 'Username already taken'
          }
        }
      }

      // Update user
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(username && { username: username.toLowerCase() }),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          username: true,
          isActive: true,
          isPremium: true,
          createdAt: true,
        }
      })

      logger.info(`Profile updated for user: ${user.username}`)

      return {
        success: true,
        user,
        message: 'Profile updated successfully'
      }

    } catch (error) {
      logger.error('Update profile error:', error)
      return {
        success: false,
        message: 'Profile update failed'
      }
    }
  }

  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      // Get user with current password
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          password: true,
        }
      })

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        }
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Current password is incorrect'
        }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, config.bcryptRounds)

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { 
          password: hashedPassword,
          updatedAt: new Date(),
        }
      })

      logger.info(`Password changed for user: ${userId}`)

      return {
        success: true,
        message: 'Password changed successfully'
      }

    } catch (error) {
      logger.error('Change password error:', error)
      return {
        success: false,
        message: 'Password change failed'
      }
    }
  }

  // Get user session info from cache
  static async getSessionInfo(userId: string): Promise<any> {
    try {
      const sessionData = await redisUtils.get(`user:session:${userId}`)
      return sessionData ? JSON.parse(sessionData) : null
    } catch (error) {
      logger.error('Get session info error:', error)
      return null
    }
  }
}
