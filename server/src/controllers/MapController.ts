import { Request, Response } from 'express';
import { MapService } from '../services/MapService.js';
import logger from '../utils/logger.js';

export class MapController {
  /**
   * GET /api/map/locations
   * Get all locations with hierarchy
   */
  static async getAllLocations(req: Request, res: Response) {
    try {
      const locations = await MapService.getAllLocations();
      
      res.json({
        success: true,
        data: {
          locations,
          total: locations.length
        },
        message: 'Locations retrieved successfully'
      });

    } catch (error) {
      logger.error('Get all locations controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve locations',
        code: 'LOCATIONS_FETCH_ERROR'
      });
    }
  }

  /**
   * GET /api/map/locations/:locationId
   * Get specific location details
   */
  static async getLocationById(req: Request, res: Response) {
    try {
      const { locationId } = req.params;
      
      if (!locationId) {
        return res.status(400).json({
          success: false,
          error: 'Location ID is required',
          code: 'MISSING_LOCATION_ID'
        });
      }

      const location = await MapService.getLocationById(locationId);
      
      if (!location) {
        return res.status(404).json({
          success: false,
          error: 'Location not found',
          code: 'LOCATION_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: { location },
        message: 'Location retrieved successfully'
      });

    } catch (error) {
      logger.error('Get location by ID controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve location',
        code: 'LOCATION_FETCH_ERROR'
      });
    }
  }

  /**
   * GET /api/map/characters/:characterId/accessible
   * Get locations accessible from character's current position
   */
  static async getAccessibleLocations(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      
      if (!characterId) {
        return res.status(400).json({
          success: false,
          error: 'Character ID is required',
          code: 'MISSING_CHARACTER_ID'
        });
      }

      // Verify character belongs to authenticated user
      if (req.user && req.user.id) {
        // This verification would be implemented based on your auth system
        // For now, we'll proceed with the request
      }

      const accessibleLocations = await MapService.getAccessibleLocations(characterId);
      
      res.json({
        success: true,
        data: {
          locations: accessibleLocations,
          characterId,
          total: accessibleLocations.length
        },
        message: 'Accessible locations retrieved successfully'
      });

    } catch (error) {
      logger.error('Get accessible locations controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve accessible locations',
        code: 'ACCESSIBLE_LOCATIONS_ERROR'
      });
    }
  }

  /**
   * POST /api/map/characters/:characterId/move
   * Move character to new location
   */
  static async moveCharacter(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      const { targetLocationId, x, y, z } = req.body;
      
      if (!characterId || !targetLocationId) {
        return res.status(400).json({
          success: false,
          error: 'Character ID and target location ID are required',
          code: 'MISSING_REQUIRED_FIELDS'
        });
      }

      // Verify character belongs to authenticated user
      if (req.user && req.user.id) {
        // This verification would be implemented based on your auth system
      }

      const movementResult = await MapService.moveCharacter(
        characterId,
        targetLocationId,
        x,
        y,
        z
      );
      
      if (!movementResult.success) {
        return res.status(400).json({
          success: false,
          error: movementResult.message,
          code: movementResult.error || 'MOVEMENT_FAILED',
          data: {
            characterId: movementResult.characterId,
            targetLocationId: movementResult.toLocationId
          }
        });
      }

      res.json({
        success: true,
        data: {
          movement: movementResult
        },
        message: movementResult.message
      });

    } catch (error) {
      logger.error('Move character controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to move character',
        code: 'MOVEMENT_ERROR'
      });
    }
  }

  /**
   * GET /api/map/characters/:characterId/location
   * Get character's current location with nearby players and NPCs
   */
  static async getCharacterLocation(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      
      if (!characterId) {
        return res.status(400).json({
          success: false,
          error: 'Character ID is required',
          code: 'MISSING_CHARACTER_ID'
        });
      }

      const locationData = await MapService.getCharacterLocation(characterId);
      
      if (!locationData) {
        return res.status(404).json({
          success: false,
          error: 'Character or location not found',
          code: 'CHARACTER_LOCATION_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: locationData,
        message: 'Character location retrieved successfully'
      });

    } catch (error) {
      logger.error('Get character location controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve character location',
        code: 'CHARACTER_LOCATION_ERROR'
      });
    }
  }

  /**
   * GET /api/map/characters/:characterId/exploration
   * Get quadrant exploration data for character
   */
  static async getCharacterExploration(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      
      if (!characterId) {
        return res.status(400).json({
          success: false,
          error: 'Character ID is required',
          code: 'MISSING_CHARACTER_ID'
        });
      }

      const explorationData = await MapService.getCharacterExploration(characterId);
      
      res.json({
        success: true,
        data: {
          characterId,
          quadrants: explorationData,
          totalQuadrants: explorationData.length,
          exploredCount: explorationData.filter(q => q.explored).length
        },
        message: 'Exploration data retrieved successfully'
      });

    } catch (error) {
      logger.error('Get character exploration controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve exploration data',
        code: 'EXPLORATION_DATA_ERROR'
      });
    }
  }

  /**
   * POST /api/map/travel/calculate
   * Calculate travel time between locations
   */
  static async calculateTravelTime(req: Request, res: Response) {
    try {
      const { fromLocation, toLocation, characterAgility } = req.body;
      
      if (!fromLocation || !toLocation) {
        return res.status(400).json({
          success: false,
          error: 'From and to locations are required',
          code: 'MISSING_LOCATION_DATA'
        });
      }

      const travelTime = MapService.calculateTravelTime(
        fromLocation,
        toLocation,
        characterAgility || 10
      );
      
      res.json({
        success: true,
        data: {
          fromLocation,
          toLocation,
          travelTime,
          characterAgility: characterAgility || 10
        },
        message: 'Travel time calculated successfully'
      });

    } catch (error) {
      logger.error('Calculate travel time controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate travel time',
        code: 'TRAVEL_CALCULATION_ERROR'
      });
    }
  }

  /**
   * GET /api/map/world/overview
   * Get world overview with major regions and current activity
   */
  static async getWorldOverview(req: Request, res: Response) {
    try {
      const locations = await MapService.getAllLocations();
      
      // Group locations by type and calculate statistics
      const locationsByType = locations.reduce((acc, location) => {
        if (!acc[location.type]) {
          acc[location.type] = [];
        }
        acc[location.type].push(location);
        return acc;
      }, {} as Record<string, typeof locations>);

      const totalPlayers = locations.reduce((total, location) => {
        return total + (location.currentPlayers || 0);
      }, 0);

      const safeZones = locations.filter(loc => loc.isSafeZone).length;
      const pvpZones = locations.filter(loc => loc.isPvpEnabled).length;
      const startAreas = locations.filter(loc => loc.isStartArea).length;

      res.json({
        success: true,
        data: {
          worldStats: {
            totalLocations: locations.length,
            totalPlayers,
            safeZones,
            pvpZones,
            startAreas,
            locationTypes: Object.keys(locationsByType).length
          },
          locationsByType,
          majorRegions: locations.filter(loc => !loc.parentId), // Root locations
          activeAreas: locations
            .filter(loc => (loc.currentPlayers || 0) > 0)
            .sort((a, b) => (b.currentPlayers || 0) - (a.currentPlayers || 0))
            .slice(0, 10)
        },
        message: 'World overview retrieved successfully'
      });

    } catch (error) {
      logger.error('Get world overview controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve world overview',
        code: 'WORLD_OVERVIEW_ERROR'
      });
    }
  }
}
