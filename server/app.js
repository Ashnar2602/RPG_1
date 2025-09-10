/**
 * Main Express Server Application
 * Implements the unified server architecture with WebSocket integration
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import custom modules
const { db } = require('../database/connection');
const WebSocketManager = require('./websocket/websocket-manager');
const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');
const worldRoutes = require('./routes/world');
const chatRoutes = require('./routes/chat');
const questRoutes = require('./routes/quests');
const guildRoutes = require('./routes/guilds');
const { authMiddleware } = require('./middleware/auth');
const { errorHandler } = require('./middleware/error-handler');
const { maintenanceMiddleware } = require('./middleware/maintenance');

class RPGServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = process.env.PORT || 3000;
    this.host = process.env.HOST || '0.0.0.0';
    
    // Initialize WebSocket manager
    this.wsManager = new WebSocketManager(this.server);
    
    this.isShuttingDown = false;
  }

  /**
   * Initialize server with all middleware and routes
   */
  async initialize() {
    try {
      console.log('🚀 Initializing RPG Server...');
      
      // Initialize database first
      await db.initialize();
      
      // Setup middleware
      this.setupMiddleware();
      
      // Setup routes
      this.setupRoutes();
      
      // Setup error handling
      this.setupErrorHandling();
      
      // Initialize WebSocket
      await this.wsManager.initialize();
      
      console.log('✅ Server initialization completed');
      return true;
    } catch (error) {
      console.error('❌ Server initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup Express middleware stack
   */
  setupMiddleware() {
    console.log('🔧 Setting up middleware...');

    // Security headers
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false, // Allow WebSocket connections
      contentSecurityPolicy: false // Disable CSP for development
    }));

    // Enable trust proxy if behind reverse proxy
    this.app.set('trust proxy', 1);

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Compression for better performance
    this.app.use(compression());

    // Request logging (development only)
    if (process.env.ENABLE_MORGAN_LOGGING === 'true') {
      this.app.use(morgan('combined'));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      message: { error: 'Too many requests, please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Body parsing
    this.app.use(express.json({ 
      limit: '10mb',
      type: ['application/json', 'text/plain']
    }));
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));

    // Static file serving
    this.app.use('/static', express.static(path.join(__dirname, '../client/build/static')));
    this.app.use('/assets', express.static(path.join(__dirname, '../assets')));

    // Maintenance mode check
    this.app.use(maintenanceMiddleware);

    console.log('✅ Middleware setup completed');
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    console.log('🛣️ Setting up routes...');

    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const dbHealth = await db.healthCheck();
        const wsHealth = this.wsManager.getHealthStatus();
        
        const health = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          database: dbHealth,
          websocket: wsHealth,
          environment: process.env.NODE_ENV || 'development'
        };

        // If any service is unhealthy, return 503
        if (dbHealth.status !== 'healthy' || wsHealth.status !== 'healthy') {
          health.status = 'unhealthy';
          return res.status(503).json(health);
        }

        res.json(health);
      } catch (error) {
        res.status(503).json({
          status: 'error',
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // API info endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'RPG Game Server',
        version: '1.0.0-mvp',
        description: 'Fantasy MMO RPG Server with real-time features',
        endpoints: {
          auth: '/api/auth',
          characters: '/api/characters',
          world: '/api/world',
          chat: '/api/chat',
          quests: '/api/quests',
          guilds: '/api/guilds'
        },
        websocket: '/socket.io',
        documentation: '/api/docs'
      });
    });

    // Authentication routes (public)
    this.app.use('/api/auth', authRoutes);

    // Protected API routes
    this.app.use('/api/characters', authMiddleware, characterRoutes);
    this.app.use('/api/world', authMiddleware, worldRoutes);
    this.app.use('/api/chat', authMiddleware, chatRoutes);
    this.app.use('/api/quests', authMiddleware, questRoutes);
    this.app.use('/api/guilds', authMiddleware, guildRoutes);

    // Serve React app for all other routes (SPA fallback)
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname, '../client/build/index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(404).send('Application not found');
        }
      });
    });

    console.log('✅ Routes setup completed');
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    // 404 handler for API routes
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found',
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString()
      });
    });

    // Global error handler
    this.app.use(errorHandler);

    // Unhandled promise rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit the process in production
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    console.log('✅ Error handling setup completed');
  }

  /**
   * Start the server
   */
  async start() {
    try {
      await this.initialize();
      
      return new Promise((resolve, reject) => {
        this.server.listen(this.port, this.host, (error) => {
          if (error) {
            console.error('❌ Failed to start server:', error);
            reject(error);
          } else {
            console.log(`🎮 RPG Server running on http://${this.host}:${this.port}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔌 WebSocket endpoint: ws://${this.host}:${this.port}/socket.io`);
            console.log(`📊 Health check: http://${this.host}:${this.port}/health`);
            resolve(this.server);
          }
        });
      });
    } catch (error) {
      console.error('❌ Server startup failed:', error);
      throw error;
    }
  }

  /**
   * Graceful shutdown handler
   */
  async gracefulShutdown(signal = 'SIGTERM') {
    if (this.isShuttingDown) {
      console.log('⚠️ Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;
    console.log(`🛑 Received ${signal}. Starting graceful shutdown...`);

    // Set a timeout for forceful shutdown
    const forceTimeout = setTimeout(() => {
      console.error('❌ Forceful shutdown after timeout');
      process.exit(1);
    }, 30000); // 30 seconds

    try {
      // Stop accepting new connections
      this.server.close(() => {
        console.log('🔌 HTTP server closed');
      });

      // Close WebSocket connections
      if (this.wsManager) {
        await this.wsManager.shutdown();
        console.log('🔌 WebSocket connections closed');
      }

      // Close database connections
      if (db) {
        await db.close();
        console.log('🗄️ Database connections closed');
      }

      clearTimeout(forceTimeout);
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      clearTimeout(forceTimeout);
      process.exit(1);
    }
  }

  /**
   * Get server statistics
   */
  async getStats() {
    try {
      const dbStats = await db.getStats();
      const wsStats = this.wsManager.getStats();
      
      return {
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          pid: process.pid,
          version: process.version,
          environment: process.env.NODE_ENV || 'development'
        },
        database: dbStats,
        websocket: wsStats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting server stats:', error);
      throw error;
    }
  }
}

// Create server instance
const server = new RPGServer();

// Handle process signals for graceful shutdown
process.on('SIGTERM', () => server.gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => server.gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => server.gracefulShutdown('SIGUSR2')); // Nodemon restart

module.exports = server;

// Start server if this file is run directly
if (require.main === module) {
  server.start().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
}
