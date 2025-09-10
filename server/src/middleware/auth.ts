import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import config from '@/config'
import logger from '@/utils/logger'
import { redisUtils } from '@/utils/redis'

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        username: string
      }
    }
  }
}

// JWT token payload interface
interface TokenPayload {
  id: string
  email: string
  username: string
  iat: number
  exp: number
}

// Generate JWT token
export const generateToken = (payload: { id: string; email: string; username: string }): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  })
}

// Generate refresh token
export const generateRefreshToken = (payload: { id: string; email: string; username: string }): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  })
}

// Verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload
  } catch (error) {
    logger.warn('Invalid JWT token:', error)
    return null
  }
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header is required'
      })
    }

    const token = authHeader.split(' ')[1] // Bearer <token>
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token is required'
      })
    }

    // Check if token is blacklisted
    const blacklisted = await redisUtils.exists(`blacklist:${token}`)
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        error: 'Token has been revoked'
      })
    }

    const payload = verifyToken(token)
    
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      })
    }

    // Attach user to request
    req.user = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
    }

    next()
  } catch (error) {
    logger.error('Authentication middleware error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      
      if (token) {
        const blacklisted = await redisUtils.exists(`blacklist:${token}`)
        
        if (!blacklisted) {
          const payload = verifyToken(token)
          
          if (payload) {
            req.user = {
              id: payload.id,
              email: payload.email,
              username: payload.username,
            }
          }
        }
      }
    }

    next()
  } catch (error) {
    logger.error('Optional authentication middleware error:', error)
    next() // Continue without authentication
  }
}

// Logout (blacklist token)
export const logout = async (token: string): Promise<void> => {
  try {
    const payload = verifyToken(token)
    if (payload) {
      const ttl = payload.exp - Math.floor(Date.now() / 1000)
      if (ttl > 0) {
        await redisUtils.set(`blacklist:${token}`, '1', ttl)
      }
    }
  } catch (error) {
    logger.error('Error blacklisting token:', error)
  }
}

// Refresh token
export const refreshToken = async (refreshTokenString: string): Promise<{ token: string; refreshToken: string } | null> => {
  try {
    const payload = verifyToken(refreshTokenString)
    
    if (!payload) {
      return null
    }

    // Check if refresh token is blacklisted
    const blacklisted = await redisUtils.exists(`blacklist:${refreshTokenString}`)
    if (blacklisted) {
      return null
    }

    // Generate new tokens
    const newToken = generateToken({
      id: payload.id,
      email: payload.email,
      username: payload.username,
    })
    
    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      email: payload.email,
      username: payload.username,
    })

    // Blacklist old refresh token
    const ttl = payload.exp - Math.floor(Date.now() / 1000)
    if (ttl > 0) {
      await redisUtils.set(`blacklist:${refreshTokenString}`, '1', ttl)
    }

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    }
  } catch (error) {
    logger.error('Error refreshing token:', error)
    return null
  }
}
