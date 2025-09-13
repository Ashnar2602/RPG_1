import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { apiRateLimit } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import charactersRoutes from './routes/characters.js';
import combatRoutes from './routes/combat.js';
import mapRoutes from './routes/map.js';
import locationsRoutes from './routes/locations.js';
import aiRoutes from './routes/ai.js';
import { prisma } from './utils/prisma.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Debug middleware to log requests
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path.includes('/auth/')) {
    console.log('🔍 Auth Request Debug:');
    console.log('  Method:', req.method);
    console.log('  Path:', req.path);
    console.log('  Headers:', req.headers);
    console.log('  Body:', req.body);
    console.log('  Raw Body Type:', typeof req.body);
  }
  next();
});

// Rate limiting for API endpoints
app.use('/api', apiRateLimit);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/combat', combatRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND'
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

export default app;
