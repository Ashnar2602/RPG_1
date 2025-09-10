import { Router } from 'express'
import { AuthController, registerValidation, loginValidation } from '@/controllers/AuthController'
import { validate } from '@/middleware/validation'
import { authenticate } from '@/middleware/auth'
import { authLimiter } from '@/middleware/rateLimiter'

const router = Router()

// Public routes (with rate limiting)
router.post('/register', 
  authLimiter,
  registerValidation,
  validate(registerValidation),
  AuthController.register
)

router.post('/login',
  authLimiter,
  loginValidation,
  validate(loginValidation),
  AuthController.login
)

router.post('/refresh-token',
  authLimiter,
  AuthController.refreshToken
)

// Protected routes
router.use(authenticate)

router.post('/logout', AuthController.logout)
router.get('/profile', AuthController.getProfile)
router.put('/profile', AuthController.updateProfile)
router.put('/change-password', AuthController.changePassword)
router.get('/session', AuthController.getSession)

export default router
