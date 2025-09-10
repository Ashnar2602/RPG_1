import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'
import config from '@/config'
import logger from '@/utils/logger'

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // 15 minutes
  max: config.rateLimitMaxRequests, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
    })
    
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    })
  },
})

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
    })
    
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.',
    })
  },
})

// Chat message rate limiter
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 messages per minute
  message: {
    success: false,
    error: 'Too many messages sent, please slow down.',
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Chat rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
    })
    
    res.status(429).json({
      success: false,
      error: 'Too many messages sent, please slow down.',
    })
  },
})

// API creation rate limiter (for character/guild creation)
export const creationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 creations per hour
  message: {
    success: false,
    error: 'Too many creation attempts, please try again later.',
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Creation rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
    })
    
    res.status(429).json({
      success: false,
      error: 'Too many creation attempts, please try again later.',
    })
  },
})
