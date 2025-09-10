import { Router } from 'express'
import authRoutes from './auth'
import characterRoutes from './characters'

const router = Router()

// API Routes
router.use('/auth', authRoutes)
router.use('/characters', characterRoutes)

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RPG Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RPG Fantasy Multiplayer API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/profile',
        refreshToken: 'POST /api/auth/refresh-token'
      },
      characters: {
        create: 'POST /api/characters',
        list: 'GET /api/characters',
        details: 'GET /api/characters/:id',
        update: 'PUT /api/characters/:id',
        delete: 'DELETE /api/characters/:id',
        login: 'POST /api/characters/:id/login',
        active: 'GET /api/characters/active'
      },
      system: {
        health: 'GET /api/health'
      }
    }
  })
})

export default router
