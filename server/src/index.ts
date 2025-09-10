import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

import config from '@/config'
import logger, { requestLogger } from '@/utils/logger'
import { connectRedis } from '@/utils/redis'
import prisma from '@/utils/database'

import { generalLimiter } from '@/middleware/rateLimiter'
import { errorHandler, notFound, corsOptions, securityHeaders } from '@/middleware/validation'

import apiRoutes from '@/routes'

// Create Express app
const app = express()
const server = createServer(app)

// Create Socket.IO server
const io = new SocketIOServer(server, {
  cors: corsOptions,
  pingTimeout: config.wsHeartbeatTimeout,
  pingInterval: config.wsHeartbeatInterval,
})

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

app.use(securityHeaders)
app.use(cors(corsOptions))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
app.use(requestLogger)

// Rate limiting
app.use(generalLimiter)

// API routes
app.use('/api', apiRoutes)

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RPG Fantasy Multiplayer Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use(notFound)

// Error handling middleware (must be last)
app.use(errorHandler)

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`New WebSocket connection: ${socket.id}`)
  
  // Handle authentication
  socket.on('authenticate', async (data) => {
    try {
      // TODO: Implement socket authentication
      logger.info(`Socket authentication attempt: ${socket.id}`)
    } catch (error) {
      logger.error(`Socket authentication error: ${error}`)
      socket.emit('auth_error', { message: 'Authentication failed' })
    }
  })
  
  // Handle player updates
  socket.on('player_update', async (data) => {
    try {
      // TODO: Implement player update handling
      logger.debug(`Player update from ${socket.id}:`, data)
    } catch (error) {
      logger.error(`Player update error: ${error}`)
    }
  })
  
  // Handle chat messages
  socket.on('chat_message', async (data) => {
    try {
      // TODO: Implement chat message handling
      logger.debug(`Chat message from ${socket.id}:`, data)
    } catch (error) {
      logger.error(`Chat message error: ${error}`)
    }
  })
  
  // Handle disconnection
  socket.on('disconnect', (reason) => {
    logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`)
  })
})

// Initialize database connections and start server
async function startServer() {
  try {
    // Connect to Redis
    await connectRedis()
    logger.info('Connected to Redis')
    
    // Test database connection
    await prisma.$connect()
    logger.info('Connected to PostgreSQL')
    
    // Start server
    server.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`)
      logger.info(`📊 Environment: ${config.nodeEnv}`)
      logger.info(`🌐 CORS Origin: ${config.corsOrigin}`)
      logger.info(`🔧 WebSocket Server ready`)
      
      if (config.nodeEnv === 'development') {
        logger.info(`📝 API Documentation: http://localhost:${config.port}/api`)
        logger.info(`❤️  Health Check: http://localhost:${config.port}/api/health`)
      }
    })
    
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  
  server.close(() => {
    logger.info('HTTP server closed')
  })
  
  await prisma.$disconnect()
  logger.info('Database connection closed')
  
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully')
  
  server.close(() => {
    logger.info('HTTP server closed')
  })
  
  await prisma.$disconnect()
  logger.info('Database connection closed')
  
  process.exit(0)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Start the server
startServer()

export { app, server, io }
