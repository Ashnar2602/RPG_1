import { Router } from 'express'
import { CharacterController, createCharacterValidation, updateCharacterValidation } from '@/controllers/CharacterController'
import { validate } from '@/middleware/validation'
import { authenticate } from '@/middleware/auth'
import { creationLimiter } from '@/middleware/rateLimiter'

const router = Router()

// All character routes require authentication
router.use(authenticate)

// Character CRUD operations
router.post('/',
  creationLimiter,
  createCharacterValidation,
  validate(createCharacterValidation),
  CharacterController.createCharacter
)

router.get('/', CharacterController.getUserCharacters)
router.get('/active', CharacterController.getActiveCharacter)

router.get('/:characterId', CharacterController.getCharacterDetails)
router.get('/:characterId/stats', CharacterController.getCharacterStats)

router.put('/:characterId',
  updateCharacterValidation,
  validate(updateCharacterValidation),
  CharacterController.updateCharacter
)

router.delete('/:characterId', CharacterController.deleteCharacter)

// Character actions
router.post('/:characterId/login', CharacterController.loginCharacter)

export default router
