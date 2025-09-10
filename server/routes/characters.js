/**
 * Character Management Routes
 * Handles character creation, selection, and management
 */

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { db } = require('../../database/connection');
const { authMiddleware, requireCharacter } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/error-handler');

const router = express.Router();

/**
 * GET /api/characters
 * Get all characters for the authenticated user
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const charactersResult = await db.query(`
    SELECT 
      c.id, c.name, c.level, c.class, c.sub_class, c.advanced_class,
      c.str, c.int, c.dex, c.wil, c.cha, c.lck, c.sta, c.power,
      c.hp_current, c.hp_max, c.mp_current, c.mp_max,
      c.experience, c.currency_bronze, c.currency_silver, 
      c.currency_gold, c.currency_platinum,
      c.created_at, c.last_played,
      l.name as location_name,
      l.type as location_type,
      g.name as guild_name
    FROM characters c
    LEFT JOIN locations l ON c.current_location_id = l.id
    LEFT JOIN guild_members gm ON c.id = gm.character_id
    LEFT JOIN guilds g ON gm.guild_id = g.id
    WHERE c.user_id = $1
    ORDER BY c.last_played DESC
  `, [req.user.id]);

  res.json({
    characters: charactersResult.rows.map(char => ({
      id: char.id,
      name: char.name,
      level: char.level,
      class: char.class,
      subClass: char.sub_class,
      advancedClass: char.advanced_class,
      stats: {
        str: char.str,
        int: char.int,
        dex: char.dex,
        wil: char.wil,
        cha: char.cha,
        lck: char.lck,
        sta: char.sta,
        power: char.power
      },
      health: {
        current: char.hp_current,
        max: char.hp_max
      },
      mana: {
        current: char.mp_current,
        max: char.mp_max
      },
      progression: {
        experience: char.experience,
        level: char.level
      },
      currency: {
        bronze: char.currency_bronze,
        silver: char.currency_silver,
        gold: char.currency_gold,
        platinum: char.currency_platinum
      },
      location: {
        name: char.location_name,
        type: char.location_type
      },
      guild: char.guild_name,
      timestamps: {
        createdAt: char.created_at,
        lastPlayed: char.last_played
      }
    }))
  });
}));

/**
 * POST /api/characters
 * Create a new character
 */
router.post('/', [
  authMiddleware,
  body('name')
    .isLength({ min: 2, max: 30 })
    .matches(/^[a-zA-Z][a-zA-Z0-9_\-\s]*$/)
    .withMessage('Character name must be 2-30 characters, start with letter, alphanumeric plus spaces, hyphens, underscores'),
  body('class')
    .isIn(['warrior', 'rogue', 'mage', 'mercenary'])
    .withMessage('Invalid character class'),
  body('background')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Background must be under 500 characters'),
  body('alignment')
    .isIn(['LG', 'LN', 'LE', 'NG', 'NN', 'NE', 'CG', 'CN', 'CE'])
    .withMessage('Invalid alignment'),
  body('stats')
    .isObject()
    .withMessage('Stats must be an object'),
  body('stats.str')
    .isInt({ min: 10, max: 25 })
    .withMessage('STR must be between 10-25'),
  body('stats.int')
    .isInt({ min: 10, max: 25 })
    .withMessage('INT must be between 10-25'),
  body('stats.dex')
    .isInt({ min: 10, max: 25 })
    .withMessage('DEX must be between 10-25'),
  body('stats.wil')
    .isInt({ min: 10, max: 25 })
    .withMessage('WIL must be between 10-25'),
  body('stats.cha')
    .isInt({ min: 10, max: 25 })
    .withMessage('CHA must be between 10-25'),
  body('stats.lck')
    .isInt({ min: 10, max: 25 })
    .withMessage('LCK must be between 10-25'),
  body('stats.sta')
    .isInt({ min: 10, max: 25 })
    .withMessage('STA must be between 10-25')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { name, class: characterClass, background, alignment, stats } = req.body;

  // Check maximum characters per user
  const maxCharacters = parseInt(process.env.MAX_CHARACTERS_PER_USER) || 3;
  const existingCount = await db.query(
    'SELECT COUNT(*) FROM characters WHERE user_id = $1',
    [req.user.id]
  );

  if (parseInt(existingCount.rows[0].count) >= maxCharacters) {
    return res.status(400).json({
      error: `Maximum ${maxCharacters} characters per account`,
      code: 'MAX_CHARACTERS_REACHED'
    });
  }

  // Check if character name is already taken
  const nameExists = await db.query(
    'SELECT id FROM characters WHERE LOWER(name) = LOWER($1)',
    [name.trim()]
  );

  if (nameExists.rows.length > 0) {
    return res.status(409).json({
      error: 'Character name already exists',
      code: 'NAME_TAKEN'
    });
  }

  // Validate stat point allocation (should total around 98-105 for balanced creation)
  const totalStats = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
  if (totalStats < 70 || totalStats > 175) { // Reasonable limits
    return res.status(400).json({
      error: 'Invalid stat allocation',
      code: 'INVALID_STATS'
    });
  }

  // Get starting location (Newbie Village)
  const startLocationResult = await db.query(
    "SELECT id FROM locations WHERE name = 'Newbie Village' LIMIT 1"
  );

  if (startLocationResult.rows.length === 0) {
    throw new AppError('Starting location not found', 500, 'LOCATION_ERROR');
  }

  const startingLocationId = startLocationResult.rows[0].id;

  // Create character in transaction
  const character = await db.transaction(async (client) => {
    const characterResult = await client.query(`
      INSERT INTO characters (
        user_id, name, background, alignment, class,
        str, int, dex, wil, cha, lck, sta,
        current_location_id, last_save_location_id,
        created_at, updated_at, last_played
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12,
        $13, $13,
        NOW(), NOW(), NOW()
      ) RETURNING *
    `, [
      req.user.id,
      name.trim(),
      background || '',
      alignment,
      characterClass,
      stats.str, stats.int, stats.dex, stats.wil, stats.cha, stats.lck, stats.sta,
      startingLocationId
    ]);

    return characterResult.rows[0];
  });

  res.status(201).json({
    message: 'Character created successfully',
    character: {
      id: character.id,
      name: character.name,
      level: character.level,
      class: character.class,
      stats: {
        str: character.str,
        int: character.int,
        dex: character.dex,
        wil: character.wil,
        cha: character.cha,
        lck: character.lck,
        sta: character.sta,
        power: character.power
      },
      health: {
        current: character.hp_current,
        max: character.hp_max
      },
      mana: {
        current: character.mp_current,
        max: character.mp_max
      },
      currency: {
        bronze: character.currency_bronze,
        silver: character.currency_silver,
        gold: character.currency_gold,
        platinum: character.currency_platinum
      },
      createdAt: character.created_at
    }
  });

  console.log(`✅ Character created: ${character.name} (${character.id}) by ${req.user.username}`);
}));

/**
 * GET /api/characters/:characterId
 * Get detailed information about a specific character
 */
router.get('/:characterId', [
  authMiddleware,
  param('characterId').isUUID().withMessage('Invalid character ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { characterId } = req.params;

  // Get character with detailed information
  const characterResult = await db.query(`
    SELECT 
      c.*,
      l.name as location_name,
      l.description as location_description,
      l.type as location_type,
      r.name as region_name,
      g.name as guild_name,
      gm.role as guild_role
    FROM characters c
    LEFT JOIN locations l ON c.current_location_id = l.id
    LEFT JOIN regions r ON l.region_id = r.id
    LEFT JOIN guild_members gm ON c.id = gm.character_id
    LEFT JOIN guilds g ON gm.guild_id = g.id
    WHERE c.id = $1 AND c.user_id = $2
  `, [characterId, req.user.id]);

  if (characterResult.rows.length === 0) {
    return res.status(404).json({
      error: 'Character not found',
      code: 'CHARACTER_NOT_FOUND'
    });
  }

  const character = characterResult.rows[0];

  res.json({
    character: {
      id: character.id,
      name: character.name,
      background: character.background,
      alignment: character.alignment,
      level: character.level,
      experience: character.experience,
      class: character.class,
      subClass: character.sub_class,
      advancedClass: character.advanced_class,
      stats: {
        str: character.str,
        int: character.int,
        dex: character.dex,
        wil: character.wil,
        cha: character.cha,
        lck: character.lck,
        sta: character.sta,
        power: character.power
      },
      health: {
        current: character.hp_current,
        max: character.hp_max
      },
      mana: {
        current: character.mp_current,
        max: character.mp_max
      },
      currency: {
        bronze: character.currency_bronze,
        silver: character.currency_silver,
        gold: character.currency_gold,
        platinum: character.currency_platinum
      },
      location: {
        id: character.current_location_id,
        name: character.location_name,
        description: character.location_description,
        type: character.location_type,
        region: character.region_name
      },
      guild: character.guild_name ? {
        name: character.guild_name,
        role: character.guild_role
      } : null,
      timestamps: {
        createdAt: character.created_at,
        updatedAt: character.updated_at,
        lastPlayed: character.last_played
      }
    }
  });
}));

/**
 * PUT /api/characters/:characterId/select
 * Select a character as active (updates last_played)
 */
router.put('/:characterId/select', [
  authMiddleware,
  param('characterId').isUUID().withMessage('Invalid character ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { characterId } = req.params;

  // Verify character belongs to user and update last_played
  const updateResult = await db.query(`
    UPDATE characters 
    SET last_played = NOW(), updated_at = NOW()
    WHERE id = $1 AND user_id = $2
    RETURNING name, level, class
  `, [characterId, req.user.id]);

  if (updateResult.rows.length === 0) {
    return res.status(404).json({
      error: 'Character not found',
      code: 'CHARACTER_NOT_FOUND'
    });
  }

  const character = updateResult.rows[0];

  res.json({
    message: 'Character selected successfully',
    character: {
      id: characterId,
      name: character.name,
      level: character.level,
      class: character.class
    }
  });

  console.log(`✅ Character selected: ${character.name} (${characterId}) by ${req.user.username}`);
}));

/**
 * DELETE /api/characters/:characterId
 * Delete a character (soft delete with confirmation)
 */
router.delete('/:characterId', [
  authMiddleware,
  param('characterId').isUUID().withMessage('Invalid character ID'),
  body('confirmationName').notEmpty().withMessage('Character name confirmation required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { characterId } = req.params;
  const { confirmationName } = req.body;

  // Get character to verify name
  const characterResult = await db.query(
    'SELECT name FROM characters WHERE id = $1 AND user_id = $2',
    [characterId, req.user.id]
  );

  if (characterResult.rows.length === 0) {
    return res.status(404).json({
      error: 'Character not found',
      code: 'CHARACTER_NOT_FOUND'
    });
  }

  const character = characterResult.rows[0];

  // Verify confirmation name matches
  if (character.name.toLowerCase() !== confirmationName.toLowerCase()) {
    return res.status(400).json({
      error: 'Character name confirmation does not match',
      code: 'NAME_MISMATCH'
    });
  }

  // Delete character and related data
  await db.transaction(async (client) => {
    // Remove from guild if member
    await client.query('DELETE FROM guild_members WHERE character_id = $1', [characterId]);
    
    // Delete chat messages
    await client.query('DELETE FROM chat_messages WHERE sender_character_id = $1', [characterId]);
    
    // Delete quest progress
    await client.query('DELETE FROM player_quests WHERE character_id = $1', [characterId]);
    
    // Finally delete character
    await client.query('DELETE FROM characters WHERE id = $1', [characterId]);
  });

  res.json({
    message: 'Character deleted successfully',
    deletedCharacter: {
      id: characterId,
      name: character.name
    }
  });

  console.log(`🗑️ Character deleted: ${character.name} (${characterId}) by ${req.user.username}`);
}));

/**
 * GET /api/characters/:characterId/stats
 * Get character's current statistics and derived values
 */
router.get('/:characterId/stats', [
  authMiddleware,
  param('characterId').isUUID().withMessage('Invalid character ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { characterId } = req.params;

  const statsResult = await db.query(`
    SELECT 
      str, int, dex, wil, cha, lck, sta, power,
      hp_current, hp_max, mp_current, mp_max,
      level, experience, class
    FROM characters
    WHERE id = $1 AND user_id = $2
  `, [characterId, req.user.id]);

  if (statsResult.rows.length === 0) {
    return res.status(404).json({
      error: 'Character not found',
      code: 'CHARACTER_NOT_FOUND'
    });
  }

  const stats = statsResult.rows[0];

  // Calculate derived statistics (based on COMBAT_SYSTEM.md)
  const derivedStats = {
    // Damage calculations (example formulas)
    meleeDamage: Math.round(stats.str * 1.5 + stats.dex * 0.5),
    rangedDamage: Math.round(stats.dex * 1.5 + stats.str * 0.5),
    magicDamage: Math.round(stats.int * 1.5 + stats.wil * 0.5),
    
    // Defense calculations
    physicalDefense: Math.round(stats.sta * 1.2 + stats.str * 0.3),
    magicalDefense: Math.round(stats.wil * 1.2 + stats.int * 0.3),
    
    // Movement and utility
    movementSpeed: Math.round(stats.dex * 0.8 + stats.sta * 0.2),
    carryCapacity: Math.round(stats.str * 10 + stats.sta * 5),
    
    // Social and luck
    socialSkill: Math.round(stats.cha * 1.5),
    criticalChance: Math.round(stats.lck * 0.5) + '%',
    
    // Experience to next level
    expToNextLevel: Math.round(1000 * Math.pow(1.15, stats.level - 1)),
    expProgress: Math.round((stats.experience / (1000 * Math.pow(1.15, stats.level - 1))) * 100)
  };

  res.json({
    baseStats: {
      str: stats.str,
      int: stats.int,
      dex: stats.dex,
      wil: stats.wil,
      cha: stats.cha,
      lck: stats.lck,
      sta: stats.sta,
      power: stats.power
    },
    health: {
      current: stats.hp_current,
      max: stats.hp_max,
      percentage: Math.round((stats.hp_current / stats.hp_max) * 100)
    },
    mana: {
      current: stats.mp_current,
      max: stats.mp_max,
      percentage: Math.round((stats.mp_current / stats.mp_max) * 100)
    },
    progression: {
      level: stats.level,
      experience: stats.experience,
      expToNextLevel: derivedStats.expToNextLevel,
      expProgress: derivedStats.expProgress
    },
    combat: {
      meleeDamage: derivedStats.meleeDamage,
      rangedDamage: derivedStats.rangedDamage,
      magicDamage: derivedStats.magicDamage,
      physicalDefense: derivedStats.physicalDefense,
      magicalDefense: derivedStats.magicalDefense,
      criticalChance: derivedStats.criticalChance
    },
    utility: {
      movementSpeed: derivedStats.movementSpeed,
      carryCapacity: derivedStats.carryCapacity,
      socialSkill: derivedStats.socialSkill
    },
    class: stats.class
  });
}));

module.exports = router;
