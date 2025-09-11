import { Router } from 'express';
import { MapController } from '../controllers/MapController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Apply authentication to all map routes
router.use(authenticateToken);

/**
 * @route GET /api/map/locations
 * @desc Get all locations with hierarchy
 * @access Private
 */
router.get('/locations', MapController.getAllLocations);

/**
 * @route GET /api/map/locations/:locationId
 * @desc Get specific location details
 * @access Private
 */
router.get('/locations/:locationId', MapController.getLocationById);

/**
 * @route GET /api/map/characters/:characterId/accessible
 * @desc Get locations accessible from character's current position
 * @access Private
 */
router.get('/characters/:characterId/accessible', MapController.getAccessibleLocations);

/**
 * @route POST /api/map/characters/:characterId/move
 * @desc Move character to new location
 * @access Private
 */
router.post('/characters/:characterId/move', MapController.moveCharacter);

/**
 * @route GET /api/map/characters/:characterId/location
 * @desc Get character's current location with nearby players and NPCs
 * @access Private
 */
router.get('/characters/:characterId/location', MapController.getCharacterLocation);

/**
 * @route GET /api/map/characters/:characterId/exploration
 * @desc Get quadrant exploration data for character
 * @access Private
 */
router.get('/characters/:characterId/exploration', MapController.getCharacterExploration);

/**
 * @route POST /api/map/travel/calculate
 * @desc Calculate travel time between locations
 * @access Private
 */
router.post('/travel/calculate', MapController.calculateTravelTime);

/**
 * @route GET /api/map/world/overview
 * @desc Get world overview with major regions and current activity
 * @access Private
 */
router.get('/world/overview', MapController.getWorldOverview);

export default router;
