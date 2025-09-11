import { prisma } from '../utils/prisma.js';
import logger from '../utils/logger.js';

export interface LocationData {
  id: string;
  name: string;
  description?: string;
  type: string;
  x: number;
  y: number;
  z: number;
  isStartArea: boolean;
  isSafeZone: boolean;
  isPvpEnabled: boolean;
  maxPlayers: number;
  parentId?: string;
  currentPlayers?: number;
  children?: LocationData[];
  spawns?: SpawnPointData[];
  npcs?: NPCData[];
}

export interface SpawnPointData {
  id: string;
  entityType: string;
  entityId?: string;
  x: number;
  y: number;
  z: number;
  respawnTime: number;
  lastSpawn?: Date;
  isActive: boolean;
}

export interface NPCData {
  id: string;
  name: string;
  type: string;
  race: string;
  level: number;
  x: number;
  y: number;
  z: number;
  isAggressive: boolean;
}

export interface MovementResult {
  success: boolean;
  characterId: string;
  fromLocationId?: string;
  toLocationId: string;
  newPosition: {
    x: number;
    y: number;
    z: number;
  };
  travelTime: number;
  message: string;
  error?: string;
}

export interface QuadrantInfo {
  coordinates: string;
  explored: boolean;
  discoveredAt?: Date;
  dangerLevel: 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  pointsOfInterest: number;
  hasQuests: boolean;
  hasNPCs: boolean;
  hasResources: boolean;
}

export class MapService {
  /**
   * Get all locations with hierarchy
   */
  static async getAllLocations(): Promise<LocationData[]> {
    try {
      const locations = await prisma.location.findMany({
        include: {
          children: true,
          spawns: true,
          npcs: {
            select: {
              id: true,
              name: true,
              type: true,
              race: true,
              level: true,
              x: true,
              y: true,
              z: true,
              isAggressive: true
            }
          },
          characters: {
            select: {
              id: true,
              name: true,
              x: true,
              y: true,
              z: true
            }
          }
        },
        orderBy: [
          { type: 'asc' },
          { name: 'asc' }
        ]
      });

      return locations.map(location => ({
        id: location.id,
        name: location.name,
        description: location.description || undefined,
        type: location.type,
        x: location.x,
        y: location.y,
        z: location.z,
        isStartArea: location.isStartArea,
        isSafeZone: location.isSafeZone,
        isPvpEnabled: location.isPvpEnabled,
        maxPlayers: location.maxPlayers,
        parentId: location.parentId || undefined,
        currentPlayers: location.characters.length,
        children: location.children.map(child => ({
          id: child.id,
          name: child.name,
          type: child.type,
          x: child.x,
          y: child.y,
          z: child.z,
          isStartArea: child.isStartArea,
          isSafeZone: child.isSafeZone,
          isPvpEnabled: child.isPvpEnabled,
          maxPlayers: child.maxPlayers,
          parentId: child.parentId || undefined
        })),
        spawns: location.spawns.map(spawn => ({
          id: spawn.id,
          entityType: spawn.entityType,
          entityId: spawn.entityId || undefined,
          x: spawn.x,
          y: spawn.y,
          z: spawn.z,
          respawnTime: spawn.respawnTime,
          lastSpawn: spawn.lastSpawn || undefined,
          isActive: spawn.isActive
        })),
        npcs: location.npcs.map(npc => ({
          id: npc.id,
          name: npc.name,
          type: npc.type,
          race: npc.race,
          level: npc.level,
          x: npc.x,
          y: npc.y,
          z: npc.z,
          isAggressive: npc.isAggressive
        }))
      }));

    } catch (error) {
      logger.error('Failed to get all locations:', error);
      throw new Error('Failed to retrieve locations');
    }
  }

  /**
   * Get specific location by ID with full details
   */
  static async getLocationById(locationId: string): Promise<LocationData | null> {
    try {
      const location = await prisma.location.findUnique({
        where: { id: locationId },
        include: {
          parent: true,
          children: true,
          spawns: true,
          npcs: true,
          characters: {
            select: {
              id: true,
              name: true,
              race: true,
              characterClass: true,
              level: true,
              x: true,
              y: true,
              z: true
            }
          }
        }
      });

      if (!location) {
        return null;
      }

      return {
        id: location.id,
        name: location.name,
        description: location.description || undefined,
        type: location.type,
        x: location.x,
        y: location.y,
        z: location.z,
        isStartArea: location.isStartArea,
        isSafeZone: location.isSafeZone,
        isPvpEnabled: location.isPvpEnabled,
        maxPlayers: location.maxPlayers,
        parentId: location.parentId || undefined,
        currentPlayers: location.characters.length,
        children: location.children.map(child => ({
          id: child.id,
          name: child.name,
          type: child.type,
          x: child.x,
          y: child.y,
          z: child.z,
          isStartArea: child.isStartArea,
          isSafeZone: child.isSafeZone,
          isPvpEnabled: child.isPvpEnabled,
          maxPlayers: child.maxPlayers,
          parentId: child.parentId || undefined
        })),
        spawns: location.spawns.map(spawn => ({
          id: spawn.id,
          entityType: spawn.entityType,
          entityId: spawn.entityId || undefined,
          x: spawn.x,
          y: spawn.y,
          z: spawn.z,
          respawnTime: spawn.respawnTime,
          lastSpawn: spawn.lastSpawn || undefined,
          isActive: spawn.isActive
        })),
        npcs: location.npcs.map(npc => ({
          id: npc.id,
          name: npc.name,
          type: npc.type,
          race: npc.race,
          level: npc.level,
          x: npc.x,
          y: npc.y,
          z: npc.z,
          isAggressive: npc.isAggressive
        }))
      };

    } catch (error) {
      logger.error('Failed to get location by ID:', error);
      throw new Error('Failed to retrieve location');
    }
  }

  /**
   * Get locations accessible from current character position
   */
  static async getAccessibleLocations(characterId: string): Promise<LocationData[]> {
    try {
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        select: {
          locationId: true,
          x: true,
          y: true,
          z: true,
          level: true
        }
      });

      if (!character || !character.locationId) {
        return [];
      }

      // Get current location and nearby locations
      const currentLocation = await prisma.location.findUnique({
        where: { id: character.locationId },
        include: {
          parent: true,
          children: true
        }
      });

      if (!currentLocation) {
        return [];
      }

      // Build list of accessible locations
      const accessibleIds = new Set<string>();
      
      // Current location
      accessibleIds.add(currentLocation.id);
      
      // Child locations
      currentLocation.children.forEach(child => {
        accessibleIds.add(child.id);
      });
      
      // Parent location (if exists)
      if (currentLocation.parent) {
        accessibleIds.add(currentLocation.parent.id);
        
        // Sibling locations (same parent)
        const siblings = await prisma.location.findMany({
          where: {
            parentId: currentLocation.parent.id,
            id: { not: currentLocation.id }
          }
        });
        
        siblings.forEach(sibling => {
          accessibleIds.add(sibling.id);
        });
      }

      // Get full location data for accessible locations
      const accessibleLocations = await prisma.location.findMany({
        where: {
          id: { in: Array.from(accessibleIds) }
        },
        include: {
          characters: {
            select: {
              id: true,
              name: true
            }
          },
          npcs: {
            select: {
              id: true,
              name: true,
              type: true,
              level: true,
              isAggressive: true
            }
          }
        }
      });

      return accessibleLocations.map(location => ({
        id: location.id,
        name: location.name,
        description: location.description || undefined,
        type: location.type,
        x: location.x,
        y: location.y,
        z: location.z,
        isStartArea: location.isStartArea,
        isSafeZone: location.isSafeZone,
        isPvpEnabled: location.isPvpEnabled,
        maxPlayers: location.maxPlayers,
        parentId: location.parentId || undefined,
        currentPlayers: location.characters.length
      }));

    } catch (error) {
      logger.error('Failed to get accessible locations:', error);
      throw new Error('Failed to retrieve accessible locations');
    }
  }

  /**
   * Move character to new location
   */
  static async moveCharacter(
    characterId: string, 
    targetLocationId: string, 
    newX?: number, 
    newY?: number, 
    newZ?: number
  ): Promise<MovementResult> {
    try {
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: {
          location: true
        }
      });

      if (!character) {
        return {
          success: false,
          characterId,
          toLocationId: targetLocationId,
          newPosition: { x: 0, y: 0, z: 0 },
          travelTime: 0,
          message: 'Character not found',
          error: 'CHARACTER_NOT_FOUND'
        };
      }

      const targetLocation = await prisma.location.findUnique({
        where: { id: targetLocationId }
      });

      if (!targetLocation) {
        return {
          success: false,
          characterId,
          toLocationId: targetLocationId,
          newPosition: { x: character.x, y: character.y, z: character.z },
          travelTime: 0,
          message: 'Target location not found',
          error: 'LOCATION_NOT_FOUND'
        };
      }

      // Check if location is at capacity
      const currentPlayers = await prisma.character.count({
        where: { locationId: targetLocationId }
      });

      if (currentPlayers >= targetLocation.maxPlayers) {
        return {
          success: false,
          characterId,
          toLocationId: targetLocationId,
          newPosition: { x: character.x, y: character.y, z: character.z },
          travelTime: 0,
          message: `${targetLocation.name} is at capacity (${targetLocation.maxPlayers} players)`,
          error: 'LOCATION_FULL'
        };
      }

      // Calculate travel time based on distance and character agility
      const distance = Math.sqrt(
        Math.pow(targetLocation.x - character.x, 2) +
        Math.pow(targetLocation.y - character.y, 2) +
        Math.pow(targetLocation.z - character.z, 2)
      );

      const baseTravelTime = Math.max(1, Math.floor(distance / 10)); // Base time in seconds
      const agilityModifier = Math.max(0.5, 1 - (character.agility / 100)); // Agility reduces travel time
      const travelTime = Math.floor(baseTravelTime * agilityModifier);

      // Set default position if not provided
      const finalX = newX !== undefined ? newX : targetLocation.x;
      const finalY = newY !== undefined ? newY : targetLocation.y;  
      const finalZ = newZ !== undefined ? newZ : targetLocation.z;

      // Update character position
      await prisma.character.update({
        where: { id: characterId },
        data: {
          locationId: targetLocationId,
          x: finalX,
          y: finalY,
          z: finalZ
        }
      });

      logger.info(`Character ${character.name} moved from ${character.location?.name || 'unknown'} to ${targetLocation.name}`);

      return {
        success: true,
        characterId,
        fromLocationId: character.locationId || undefined,
        toLocationId: targetLocationId,
        newPosition: {
          x: finalX,
          y: finalY,
          z: finalZ
        },
        travelTime,
        message: `Successfully traveled to ${targetLocation.name} in ${travelTime} seconds`
      };

    } catch (error) {
      logger.error('Failed to move character:', error);
      return {
        success: false,
        characterId,
        toLocationId: targetLocationId,
        newPosition: { x: 0, y: 0, z: 0 },
        travelTime: 0,
        message: 'Failed to move character',
        error: 'MOVEMENT_FAILED'
      };
    }
  }

  /**
   * Get character's current location with nearby players
   */
  static async getCharacterLocation(characterId: string) {
    try {
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: {
          location: {
            include: {
              characters: {
                where: {
                  id: { not: characterId }
                },
                select: {
                  id: true,
                  name: true,
                  race: true,
                  characterClass: true,
                  level: true,
                  x: true,
                  y: true,
                  z: true
                }
              },
              npcs: true,
              spawns: true
            }
          }
        }
      });

      if (!character || !character.location) {
        return null;
      }

      return {
        character: {
          id: character.id,
          name: character.name,
          position: {
            x: character.x,
            y: character.y,
            z: character.z
          }
        },
        location: {
          id: character.location.id,
          name: character.location.name,
          description: character.location.description,
          type: character.location.type,
          isSafeZone: character.location.isSafeZone,
          isPvpEnabled: character.location.isPvpEnabled,
          nearbyPlayers: character.location.characters,
          npcs: character.location.npcs,
          spawns: character.location.spawns.filter(spawn => spawn.isActive)
        }
      };

    } catch (error) {
      logger.error('Failed to get character location:', error);
      throw new Error('Failed to retrieve character location');
    }
  }

  /**
   * Calculate travel time between two locations
   */
  static calculateTravelTime(from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }, agility: number = 10): number {
    const distance = Math.sqrt(
      Math.pow(to.x - from.x, 2) +
      Math.pow(to.y - from.y, 2) +
      Math.pow(to.z - from.z, 2)
    );

    const baseTravelTime = Math.max(1, Math.floor(distance / 10));
    const agilityModifier = Math.max(0.5, 1 - (agility / 100));
    
    return Math.floor(baseTravelTime * agilityModifier);
  }

  /**
   * Get quadrant exploration data for a character
   */
  static async getCharacterExploration(characterId: string): Promise<QuadrantInfo[]> {
    try {
      // This would integrate with a future exploration tracking system
      // For now, return mock data based on character location
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: { location: true }
      });

      if (!character?.location) {
        return [];
      }

      // Generate exploration data for surrounding quadrants
      const quadrants: QuadrantInfo[] = [];
      const baseX = Math.floor(character.location.x / 100) * 100;
      const baseY = Math.floor(character.location.y / 100) * 100;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          const quadX = baseX + (x * 100);
          const quadY = baseY + (y * 100);
          const coordinates = `${String.fromCharCode(65 + Math.floor(quadX / 100))}${Math.floor(quadY / 100) + 1}`;
          
          quadrants.push({
            coordinates,
            explored: x === 0 && y === 0, // Current quadrant is explored
            discoveredAt: x === 0 && y === 0 ? new Date() : undefined,
            dangerLevel: character.location.isSafeZone ? 'SAFE' : 'LOW',
            pointsOfInterest: Math.floor(Math.random() * 5),
            hasQuests: Math.random() > 0.7,
            hasNPCs: Math.random() > 0.5,
            hasResources: Math.random() > 0.6
          });
        }
      }

      return quadrants;

    } catch (error) {
      logger.error('Failed to get character exploration:', error);
      throw new Error('Failed to retrieve exploration data');
    }
  }
}
