import { Router } from 'express'
import { CharacterController, createCharacterValidation, updateCharacterValidation } from '../controllers/CharacterController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Character CRUD operations
router.post('/',
  authenticateToken,
  ...createCharacterValidation,
  CharacterController.createCharacter
)

router.get('/', authenticateToken, CharacterController.getUserCharacters)
router.get('/active', authenticateToken, CharacterController.getActiveCharacter)

router.get('/:characterId', authenticateToken, CharacterController.getCharacterDetails)
router.get('/:characterId/stats', authenticateToken, CharacterController.getCharacterStats)

router.put('/:characterId',
  authenticateToken,
  ...updateCharacterValidation,
  CharacterController.updateCharacter
)

router.delete('/:characterId', authenticateToken, CharacterController.deleteCharacter)

// Character actions
router.post('/:characterId/login', authenticateToken, CharacterController.loginCharacter)

export default router
