import { Router } from 'express';
import { 
  CombatController, 
  combatActionValidation, 
  getCombatHistoryValidation,
  startCombatValidation 
} from '../controllers/CombatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All combat routes require authentication
router.use(authenticateToken);

// Combat actions
router.post('/action',
  ...combatActionValidation,
  CombatController.executeCombatAction
);

router.post('/start',
  ...startCombatValidation,
  CombatController.startCombat
);

// Combat information
router.get('/history/:characterId',
  ...getCombatHistoryValidation,
  CombatController.getCombatHistory
);

router.get('/abilities/:characterId',
  CombatController.getAvailableAbilities
);

export default router;
