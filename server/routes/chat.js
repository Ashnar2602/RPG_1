/**
 * Chat System Routes
 * Handles chat channels, messages, and real-time communication
 */

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { db } = require('../../database/connection');
const { authMiddleware, requireCharacter } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/error-handler');

const router = express.Router();

/**
 * GET /api/chat/channels
 * Get available chat channels for the user
 */
router.get('/channels', [
  authMiddleware,
  requireCharacter
], asyncHandler(async (req, res) => {
  const characterId = req.character.id;
  const userId = req.user.id;

  // Get character's current location and guild for context
  const contextResult = await db.query(`
    SELECT 
      c.current_location_id,
      l.name as location_name,
      gm.guild_id,
      g.name as guild_name
    FROM characters c
    LEFT JOIN locations l ON c.current_location_id = l.id
    LEFT JOIN guild_members gm ON c.id = gm.character_id
    LEFT JOIN guilds g ON gm.guild_id = g.id
    WHERE c.id = $1
  `, [characterId]);

  const context = contextResult.rows[0] || {};

  // Get available channels based on character context
  const channelsResult = await db.query(`
    SELECT 
      cc.id, cc.channel_type, cc.name, cc.description,
      cc.location_id, cc.party_id, cc.guild_id,
      cc.is_moderated, cc.max_participants,
      COUNT(DISTINCT cm.id) as message_count,
      MAX(cm.created_at) as last_activity
    FROM chat_channels cc
    LEFT JOIN chat_messages cm ON cc.id = cm.channel_id AND cm.created_at > NOW() - INTERVAL '24 hours'
    WHERE 
      (cc.channel_type = 'global') OR
      (cc.channel_type = 'location' AND cc.location_id = $1) OR
      (cc.channel_type = 'guild' AND cc.guild_id = $2)
    GROUP BY cc.id
    ORDER BY 
      CASE cc.channel_type 
        WHEN 'global' THEN 1 
        WHEN 'location' THEN 2 
        WHEN 'guild' THEN 3 
        ELSE 4 
      END,
      cc.name
  `, [context.current_location_id, context.guild_id]);

  // Get private conversations
  const privateConversationsResult = await db.query(`
    SELECT DISTINCT
      CASE 
        WHEN cm1.sender_character_id = $1 THEN cm2.sender_character_id
        ELSE cm1.sender_character_id
      END as other_character_id,
      c.name as other_character_name,
      MAX(GREATEST(cm1.created_at, COALESCE(cm2.created_at, '1970-01-01'))) as last_activity,
      COUNT(*) as message_count
    FROM chat_messages cm1
    LEFT JOIN chat_messages cm2 ON cm1.channel_id = cm2.channel_id AND cm2.sender_character_id = $1
    LEFT JOIN chat_channels cc ON cm1.channel_id = cc.id
    LEFT JOIN characters c ON (
      CASE 
        WHEN cm1.sender_character_id = $1 THEN cm2.sender_character_id
        ELSE cm1.sender_character_id
      END
    ) = c.id
    WHERE 
      cc.channel_type = 'private' AND
      (cm1.sender_character_id = $1 OR cm2.sender_character_id = $1) AND
      cm1.created_at > NOW() - INTERVAL '7 days'
    GROUP BY other_character_id, c.name
    ORDER BY last_activity DESC
    LIMIT 10
  `, [characterId]);

  res.json({
    channels: channelsResult.rows.map(channel => ({
      id: channel.id,
      type: channel.channel_type,
      name: channel.name || getDefaultChannelName(channel.channel_type, context),
      description: channel.description,
      isModerated: channel.is_moderated,
      maxParticipants: channel.max_participants,
      stats: {
        messageCount: parseInt(channel.message_count),
        lastActivity: channel.last_activity
      },
      context: getChannelContext(channel, context)
    })),
    privateConversations: privateConversationsResult.rows.map(conv => ({
      type: 'private',
      characterId: conv.other_character_id,
      characterName: conv.other_character_name,
      stats: {
        messageCount: parseInt(conv.message_count),
        lastActivity: conv.last_activity
      }
    })),
    userContext: {
      characterId: characterId,
      characterName: req.character.name,
      locationId: context.current_location_id,
      locationName: context.location_name,
      guildId: context.guild_id,
      guildName: context.guild_name
    }
  });
}));

/**
 * GET /api/chat/channels/:channelId/messages
 * Get messages from a specific channel
 */
router.get('/channels/:channelId/messages', [
  authMiddleware,
  requireCharacter,
  param('channelId').isUUID().withMessage('Invalid channel ID'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
  query('before').optional().isISO8601().withMessage('Before must be a valid timestamp')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { channelId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;
  const before = req.query.before ? new Date(req.query.before) : new Date();

  // Verify channel access
  const hasAccess = await verifyChannelAccess(channelId, req.character.id, req.user.id);
  if (!hasAccess) {
    return res.status(403).json({
      error: 'Access denied to channel',
      code: 'CHANNEL_ACCESS_DENIED'
    });
  }

  // Get messages
  const messagesResult = await db.query(`
    SELECT 
      cm.id, cm.content, cm.message_type, cm.created_at,
      cm.is_deleted, cm.deletion_reason,
      c.id as sender_id, c.name as sender_name, c.level as sender_level, c.class as sender_class
    FROM chat_messages cm
    LEFT JOIN characters c ON cm.sender_character_id = c.id
    WHERE 
      cm.channel_id = $1 AND 
      cm.created_at < $2 AND
      (cm.is_deleted = false OR cm.sender_character_id = $3)
    ORDER BY cm.created_at DESC
    LIMIT $4 OFFSET $5
  `, [channelId, before, req.character.id, limit, offset]);

  // Get channel info
  const channelResult = await db.query(`
    SELECT channel_type, name, description, is_moderated
    FROM chat_channels
    WHERE id = $1
  `, [channelId]);

  const channel = channelResult.rows[0];

  res.json({
    channel: {
      id: channelId,
      type: channel.channel_type,
      name: channel.name,
      description: channel.description,
      isModerated: channel.is_moderated
    },
    messages: messagesResult.rows.reverse().map(message => ({
      id: message.id,
      content: message.is_deleted ? '[Message deleted]' : message.content,
      type: message.message_type,
      sender: message.sender_id ? {
        id: message.sender_id,
        name: message.sender_name,
        level: message.sender_level,
        class: message.sender_class
      } : null,
      timestamp: message.created_at,
      isDeleted: message.is_deleted,
      deletionReason: message.deletion_reason
    })),
    pagination: {
      limit,
      offset,
      hasMore: messagesResult.rows.length === limit
    }
  });
}));

/**
 * POST /api/chat/channels/:channelId/messages
 * Send a message to a channel
 */
router.post('/channels/:channelId/messages', [
  authMiddleware,
  requireCharacter,
  param('channelId').isUUID().withMessage('Invalid channel ID'),
  body('content').isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters'),
  body('type').optional().isIn(['text', 'action', 'emote']).withMessage('Invalid message type')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { channelId } = req.params;
  const { content, type = 'text' } = req.body;
  const characterId = req.character.id;

  // Verify channel access
  const hasAccess = await verifyChannelAccess(channelId, characterId, req.user.id);
  if (!hasAccess) {
    return res.status(403).json({
      error: 'Access denied to channel',
      code: 'CHANNEL_ACCESS_DENIED'
    });
  }

  // Check rate limiting
  const canSend = await checkChatRateLimit(characterId);
  if (!canSend) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please slow down.',
      code: 'CHAT_RATE_LIMIT'
    });
  }

  // Filter profanity if enabled
  let filteredContent = content;
  if (process.env.CHAT_PROFANITY_FILTER === 'true') {
    filteredContent = filterProfanity(content);
  }

  // Save message
  const messageResult = await db.query(`
    INSERT INTO chat_messages (channel_id, sender_character_id, message_type, content, metadata)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, created_at
  `, [channelId, characterId, type, filteredContent, JSON.stringify({ originalLength: content.length })]);

  const message = messageResult.rows[0];

  res.status(201).json({
    message: {
      id: message.id,
      content: filteredContent,
      type,
      sender: {
        id: characterId,
        name: req.character.name,
        level: req.character.level,
        class: req.character.class
      },
      timestamp: message.created_at
    }
  });

  // Note: Real-time broadcasting is handled by WebSocket manager
  console.log(`💬 Message sent by ${req.character.name} to channel ${channelId}`);
}));

/**
 * POST /api/chat/private
 * Send a private message to another character
 */
router.post('/private', [
  authMiddleware,
  requireCharacter,
  body('targetCharacterId').isUUID().withMessage('Target character ID is required'),
  body('content').isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { targetCharacterId, content } = req.body;
  const senderCharacterId = req.character.id;

  // Verify target character exists
  const targetResult = await db.query(
    'SELECT id, name, user_id FROM characters WHERE id = $1',
    [targetCharacterId]
  );

  if (targetResult.rows.length === 0) {
    return res.status(404).json({
      error: 'Target character not found',
      code: 'CHARACTER_NOT_FOUND'
    });
  }

  const targetCharacter = targetResult.rows[0];

  // Check if sender is blocked by target (implement later)
  // Check rate limiting
  const canSend = await checkChatRateLimit(senderCharacterId);
  if (!canSend) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please slow down.',
      code: 'CHAT_RATE_LIMIT'
    });
  }

  // Get or create private channel
  const channelId = await getOrCreatePrivateChannel(senderCharacterId, targetCharacterId);

  // Filter content
  let filteredContent = content;
  if (process.env.CHAT_PROFANITY_FILTER === 'true') {
    filteredContent = filterProfanity(content);
  }

  // Save message
  const messageResult = await db.query(`
    INSERT INTO chat_messages (channel_id, sender_character_id, message_type, content, metadata)
    VALUES ($1, $2, 'text', $3, $4)
    RETURNING id, created_at
  `, [channelId, senderCharacterId, filteredContent, JSON.stringify({
    privateMessage: true,
    targetCharacterId: targetCharacterId
  })]);

  const message = messageResult.rows[0];

  res.status(201).json({
    message: {
      id: message.id,
      content: filteredContent,
      type: 'text',
      sender: {
        id: senderCharacterId,
        name: req.character.name,
        level: req.character.level,
        class: req.character.class
      },
      target: {
        id: targetCharacterId,
        name: targetCharacter.name
      },
      timestamp: message.created_at,
      channelId: channelId
    }
  });

  console.log(`📨 Private message sent from ${req.character.name} to ${targetCharacter.name}`);
}));

/**
 * DELETE /api/chat/messages/:messageId
 * Delete a message (if user owns it or is moderator)
 */
router.delete('/messages/:messageId', [
  authMiddleware,
  requireCharacter,
  param('messageId').isUUID().withMessage('Invalid message ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { messageId } = req.params;
  const characterId = req.character.id;

  // Get message details
  const messageResult = await db.query(`
    SELECT 
      cm.id, cm.sender_character_id, cm.content, cm.is_deleted,
      cc.channel_type, cc.is_moderated
    FROM chat_messages cm
    JOIN chat_channels cc ON cm.channel_id = cc.id
    WHERE cm.id = $1
  `, [messageId]);

  if (messageResult.rows.length === 0) {
    return res.status(404).json({
      error: 'Message not found',
      code: 'MESSAGE_NOT_FOUND'
    });
  }

  const message = messageResult.rows[0];

  // Check if already deleted
  if (message.is_deleted) {
    return res.status(400).json({
      error: 'Message already deleted',
      code: 'MESSAGE_ALREADY_DELETED'
    });
  }

  // Check permissions
  const canDelete = message.sender_character_id === characterId; // Owner can delete
  // TODO: Add moderator check for moderated channels

  if (!canDelete) {
    return res.status(403).json({
      error: 'Not authorized to delete this message',
      code: 'DELETE_NOT_AUTHORIZED'
    });
  }

  // Mark message as deleted
  await db.query(`
    UPDATE chat_messages 
    SET is_deleted = true, deleted_by = $1, deleted_at = NOW(), deletion_reason = 'user_deleted'
    WHERE id = $2
  `, [characterId, messageId]);

  res.json({
    message: 'Message deleted successfully',
    messageId: messageId
  });

  console.log(`🗑️ Message ${messageId} deleted by ${req.character.name}`);
}));

/**
 * GET /api/chat/settings
 * Get user's chat settings
 */
router.get('/settings', [
  authMiddleware,
  requireCharacter
], asyncHandler(async (req, res) => {
  const characterId = req.character.id;

  const settingsResult = await db.query(
    'SELECT * FROM chat_user_settings WHERE character_id = $1',
    [characterId]
  );

  let settings = {
    ignoredCharacterIds: [],
    channelNotifications: {},
    filterSettings: {},
    customFilters: [],
    uiPreferences: {}
  };

  if (settingsResult.rows.length > 0) {
    const dbSettings = settingsResult.rows[0];
    settings = {
      ignoredCharacterIds: dbSettings.ignored_character_ids || [],
      channelNotifications: dbSettings.channel_notifications || {},
      filterSettings: dbSettings.filter_settings || {},
      customFilters: dbSettings.custom_filters || [],
      uiPreferences: dbSettings.ui_preferences || {}
    };
  }

  res.json({ settings });
}));

/**
 * PUT /api/chat/settings
 * Update user's chat settings
 */
router.put('/settings', [
  authMiddleware,
  requireCharacter,
  body('ignoredCharacterIds').optional().isArray().withMessage('Ignored character IDs must be an array'),
  body('channelNotifications').optional().isObject().withMessage('Channel notifications must be an object'),
  body('filterSettings').optional().isObject().withMessage('Filter settings must be an object'),
  body('customFilters').optional().isArray().withMessage('Custom filters must be an array'),
  body('uiPreferences').optional().isObject().withMessage('UI preferences must be an object')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const characterId = req.character.id;
  const {
    ignoredCharacterIds,
    channelNotifications,
    filterSettings,
    customFilters,
    uiPreferences
  } = req.body;

  // Update or insert settings
  await db.query(`
    INSERT INTO chat_user_settings (
      character_id, ignored_character_ids, channel_notifications,
      filter_settings, custom_filters, ui_preferences, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    ON CONFLICT (character_id) DO UPDATE SET
      ignored_character_ids = COALESCE($2, chat_user_settings.ignored_character_ids),
      channel_notifications = COALESCE($3, chat_user_settings.channel_notifications),
      filter_settings = COALESCE($4, chat_user_settings.filter_settings),
      custom_filters = COALESCE($5, chat_user_settings.custom_filters),
      ui_preferences = COALESCE($6, chat_user_settings.ui_preferences),
      updated_at = NOW()
  `, [
    characterId,
    ignoredCharacterIds ? JSON.stringify(ignoredCharacterIds) : null,
    channelNotifications ? JSON.stringify(channelNotifications) : null,
    filterSettings ? JSON.stringify(filterSettings) : null,
    customFilters ? JSON.stringify(customFilters) : null,
    uiPreferences ? JSON.stringify(uiPreferences) : null
  ]);

  res.json({
    message: 'Chat settings updated successfully'
  });

  console.log(`⚙️ Chat settings updated for ${req.character.name}`);
}));

/**
 * Helper Functions
 */

async function verifyChannelAccess(channelId, characterId, userId) {
  const channelResult = await db.query(`
    SELECT 
      cc.channel_type, cc.location_id, cc.party_id, cc.guild_id,
      c.current_location_id, gm.guild_id as character_guild_id
    FROM chat_channels cc
    LEFT JOIN characters c ON c.id = $2
    LEFT JOIN guild_members gm ON gm.character_id = $2
    WHERE cc.id = $1
  `, [channelId, characterId]);

  if (channelResult.rows.length === 0) {
    return false;
  }

  const channel = channelResult.rows[0];
  const character = channelResult.rows[0];

  switch (channel.channel_type) {
    case 'global':
      return true;
    case 'location':
      return character.current_location_id === channel.location_id;
    case 'guild':
      return character.character_guild_id === channel.guild_id;
    case 'private':
      return true; // Private channels verified differently
    default:
      return false;
  }
}

async function checkChatRateLimit(characterId) {
  // Simple in-memory rate limiting
  // In production, use Redis for proper distributed rate limiting
  const limit = parseInt(process.env.CHAT_RATE_LIMIT_PER_MINUTE) || 10;
  
  // For MVP, just return true
  // TODO: Implement proper rate limiting
  return true;
}

function filterProfanity(content) {
  // Simple profanity filter placeholder
  // In production, use a proper profanity filtering library
  const badWords = ['badword1', 'badword2']; // Very basic example
  
  let filtered = content;
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  
  return filtered;
}

async function getOrCreatePrivateChannel(character1Id, character2Id) {
  // Check if private channel already exists between these characters
  // Implementation would involve creating a consistent channel naming/identification system
  
  // For MVP, create a simple UUID-based channel
  // In production, implement proper private channel management
  const { v4: uuidv4 } = require('uuid');
  return uuidv4(); // Placeholder
}

function getDefaultChannelName(channelType, context) {
  switch (channelType) {
    case 'global':
      return 'Global Chat';
    case 'location':
      return context.location_name || 'Location Chat';
    case 'guild':
      return context.guild_name || 'Guild Chat';
    default:
      return 'Chat';
  }
}

function getChannelContext(channel, context) {
  const result = {};
  
  if (channel.location_id) {
    result.locationId = channel.location_id;
    result.locationName = context.location_name;
  }
  
  if (channel.guild_id) {
    result.guildId = channel.guild_id;
    result.guildName = context.guild_name;
  }
  
  return result;
}

module.exports = router;
