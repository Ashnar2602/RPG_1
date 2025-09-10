import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import logger from '@/utils/logger'

// Generic validation middleware
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    
    if (errors.isEmpty()) {
      return next()
    }

    // Format errors
    const formattedErrors: Record<string, string[]> = {}
    errors.array().forEach(error => {
      if (error.type === 'field') {
        const field = error.path
        if (!formattedErrors[field]) {
          formattedErrors[field] = []
        }
        formattedErrors[field].push(error.msg)
      }
    })

    logger.warn('Validation failed:', {
      ip: req.ip,
      endpoint: req.originalUrl,
      errors: formattedErrors,
    })

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: formattedErrors,
    })
  }
}

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    ip: req.ip,
    endpoint: req.originalUrl,
    method: req.method,
  })

  // Default error
  let error = {
    success: false,
    error: 'Internal server error',
  }

  // Prisma errors
  if (err.code === 'P2002') {
    error.error = 'A record with this data already exists'
  } else if (err.code === 'P2025') {
    error.error = 'Record not found'
  } else if (err.code === 'P2003') {
    error.error = 'Foreign key constraint failed'
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.error = 'Invalid token'
  } else if (err.name === 'TokenExpiredError') {
    error.error = 'Token expired'
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.error = 'Validation failed'
  }

  res.status(500).json(error)
}

// 404 handler
export const notFound = (req: Request, res: Response) => {
  logger.warn('404 Not Found:', {
    ip: req.ip,
    endpoint: req.originalUrl,
    method: req.method,
  })

  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  })
}

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://rpg-fantasy.vercel.app', // Production client
    ]
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove powered by header
  res.removeHeader('X-Powered-By')
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  next()
}
