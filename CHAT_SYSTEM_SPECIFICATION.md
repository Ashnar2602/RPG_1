# CHAT SYSTEM - Specifica Completa
## Sistema di Comunicazione MMO

### 📋 OVERVIEW
Sistema di chat real-time per RPG MMO testuale con supporto per comunicazione globale, locale, party e privata. Integrato con WebSocket per real-time updates e sistema IA per moderazione automatica.

---

## 🎯 REQUISITI FUNZIONALI

### Chat Channels Supportati
- **Global Chat**: Comunicazione server-wide
- **Location Chat**: Chat per location corrente del personaggio
- **Party Chat**: Comunicazione party (2-6 membri standard, fino a 20 per raid)
- **Private Messages**: Messaggi diretti tra giocatori
- **Guild Chat**: Comunicazione guild (post-MVP)
- **System Messages**: Notifiche automatiche del sistema

### Message Types
- **Text Messages**: Messaggi standard
- **Action Messages**: Comandi `/me` per azioni narrative
- **System Notifications**: Eventi automatici (level up, item found, etc.)
- **Combat Log**: Risultati combattimento per party
- **Trade Messages**: Notifiche di trading tra giocatori

---

## 🏗️ ARCHITETTURA TECNICA

### WebSocket Connection
```typescript
interface ChatConnection {
  socket_id: string;
  character_id: string;
  active_channels: string[];
  connection_status: 'connected' | 'disconnected' | 'away';
  last_activity: Date;
  user_permissions: ChatPermissions;
}

interface ChatPermissions {
  can_global_chat: boolean;
  can_private_message: boolean;
  is_muted: boolean;
  mute_expires_at?: Date;
  is_admin: boolean;
}
```

### Message Structure
```typescript
interface ChatMessage {
  id: string;
  channel_id: string;
  channel_type: ChatChannelType;
  sender_id: string;
  sender_name: string;
  sender_guild_tag?: string;
  
  content: string;
  message_type: MessageType;
  metadata?: MessageMetadata;
  
  timestamp: Date;
  edited_at?: Date;
  is_deleted: boolean;
  
  // Moderation
  is_flagged: boolean;
  moderation_status: 'pending' | 'approved' | 'hidden' | 'deleted';
}

enum ChatChannelType {
  GLOBAL = 'global',
  LOCATION = 'location', 
  PARTY = 'party',
  PRIVATE = 'private',
  GUILD = 'guild',
  SYSTEM = 'system'
}

enum MessageType {
  TEXT = 'text',
  ACTION = 'action',        // /me messages
  SYSTEM = 'system',        // automated notifications
  COMBAT = 'combat',        // combat results
  TRADE = 'trade',          // trade notifications
  EMOTE = 'emote'          // predefined emotes
}

interface MessageMetadata {
  action_description?: string;  // for action messages
  system_event?: string;        // for system messages
  combat_result?: CombatResult; // for combat logs
  trade_details?: TradeInfo;    // for trade messages
  mentioned_users?: string[];   // for @username mentions
}
```

---

## 🗄️ DATABASE SCHEMA

```sql
-- Chat channels (dynamic channels for parties, private chats)
CREATE TABLE chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_type VARCHAR(20) NOT NULL,
  channel_name VARCHAR(100),
  
  -- Target specifics
  location_id UUID, -- for location chat
  party_id UUID,    -- for party chat
  guild_id UUID,    -- for guild chat
  participants UUID[], -- for private chats (array of character_ids)
  
  -- Channel settings
  is_active BOOLEAN DEFAULT TRUE,
  max_participants INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES characters(id)
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES chat_channels(id),
  sender_id UUID REFERENCES characters(id),
  
  -- Message content
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  edited_at TIMESTAMP,
  
  -- Moderation
  is_deleted BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  moderation_status VARCHAR(20) DEFAULT 'approved',
  moderated_by UUID REFERENCES users(id),
  moderation_reason TEXT,
  
  -- Indexing
  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'action', 'system', 'combat', 'trade', 'emote'))
);

-- User chat settings and preferences
CREATE TABLE chat_user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  
  -- Chat preferences
  ignored_users UUID[] DEFAULT '{}',
  blocked_channels VARCHAR(20)[] DEFAULT '{}',
  
  -- Notification settings
  enable_sound_notifications BOOLEAN DEFAULT TRUE,
  enable_mention_notifications BOOLEAN DEFAULT TRUE,
  enable_private_message_notifications BOOLEAN DEFAULT TRUE,
  
  -- Display preferences
  max_messages_displayed INTEGER DEFAULT 100,
  timestamp_format VARCHAR(20) DEFAULT 'HH:mm',
  show_system_messages BOOLEAN DEFAULT TRUE,
  show_combat_details BOOLEAN DEFAULT TRUE,
  
  -- Filters
  profanity_filter_enabled BOOLEAN DEFAULT TRUE,
  hide_global_chat BOOLEAN DEFAULT FALSE,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat moderation logs
CREATE TABLE chat_moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES chat_messages(id),
  moderator_id UUID REFERENCES users(id),
  action_taken VARCHAR(50) NOT NULL, -- 'hide', 'delete', 'warn', 'mute_user'
  reason TEXT,
  duration_minutes INTEGER, -- for mute actions
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_chat_messages_channel_time ON chat_messages(channel_id, created_at DESC);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_channels_type ON chat_channels(channel_type);
CREATE INDEX idx_chat_channels_location ON chat_channels(location_id) WHERE location_id IS NOT NULL;
CREATE INDEX idx_chat_channels_party ON chat_channels(party_id) WHERE party_id IS NOT NULL;
```

---

## 🔌 API ENDPOINTS

### WebSocket Events
```typescript
// Client -> Server events
interface ClientChatEvents {
  'chat:join_channel': (channelId: string) => void;
  'chat:leave_channel': (channelId: string) => void;
  'chat:send_message': (message: SendMessageData) => void;
  'chat:typing_start': (channelId: string) => void;
  'chat:typing_stop': (channelId: string) => void;
  'chat:mark_read': (channelId: string, lastMessageId: string) => void;
}

// Server -> Client events  
interface ServerChatEvents {
  'chat:message_received': (message: ChatMessage) => void;
  'chat:user_joined': (channelId: string, user: ChatUser) => void;
  'chat:user_left': (channelId: string, userId: string) => void;
  'chat:typing_indicator': (channelId: string, userId: string, isTyping: boolean) => void;
  'chat:channel_updated': (channel: ChatChannel) => void;
  'chat:user_status_changed': (userId: string, status: UserStatus) => void;
}

interface SendMessageData {
  channel_id: string;
  content: string;
  message_type: MessageType;
  metadata?: MessageMetadata;
}
```

### REST API Endpoints
```typescript
// Channel management
GET    /api/chat/channels                    // List user's accessible channels
POST   /api/chat/channels                    // Create new channel (private/party)
GET    /api/chat/channels/:id                // Get channel details
DELETE /api/chat/channels/:id                // Leave/delete channel

// Message operations
GET    /api/chat/channels/:id/messages       // Get message history (paginated)
POST   /api/chat/channels/:id/messages       // Send message (fallback for non-WS)
PUT    /api/chat/messages/:id                // Edit message
DELETE /api/chat/messages/:id                // Delete message

// User management
POST   /api/chat/ignore/:userId              // Ignore user
DELETE /api/chat/ignore/:userId              // Unignore user
GET    /api/chat/settings                    // Get user chat settings
PUT    /api/chat/settings                    // Update chat settings

// Moderation (admin only)
POST   /api/chat/moderation/flag/:messageId  // Flag message
POST   /api/chat/moderation/mute/:userId     // Mute user
GET    /api/chat/moderation/reports          // Get reported messages
PUT    /api/chat/moderation/resolve/:reportId // Resolve moderation report
```

---

## 🎮 INTEGRAZIONE GAMEPLAY

### Auto-Channel Management
```typescript
// Automatic channel joining based on game state
class ChatChannelManager {
  // When character moves to new location
  async onLocationChange(characterId: string, newLocationId: string) {
    const character = await Character.findById(characterId);
    
    // Leave old location channel
    if (character.previous_location_id) {
      await this.leaveLocationChannel(characterId, character.previous_location_id);
    }
    
    // Join new location channel
    await this.joinLocationChannel(characterId, newLocationId);
  }
  
  // When joining party
  async onPartyJoin(characterId: string, partyId: string) {
    const partyChannel = await this.getOrCreatePartyChannel(partyId);
    await this.joinChannel(characterId, partyChannel.id);
  }
  
  // When leaving party
  async onPartyLeave(characterId: string, partyId: string) {
    const partyChannel = await this.findPartyChannel(partyId);
    if (partyChannel) {
      await this.leaveChannel(characterId, partyChannel.id);
    }
  }
}
```

### Combat Integration
```typescript
// Automatic combat log messages
async function sendCombatLogToParty(combatResult: CombatResult) {
  const partyChannel = await ChatChannel.findPartyChannel(combatResult.party_id);
  
  if (partyChannel) {
    const message = {
      channel_id: partyChannel.id,
      sender_id: 'system',
      content: formatCombatResult(combatResult),
      message_type: MessageType.COMBAT,
      metadata: {
        combat_result: combatResult
      }
    };
    
    await ChatService.sendMessage(message);
  }
}

function formatCombatResult(result: CombatResult): string {
  const { attacker, defender, damage, action_type } = result;
  
  switch (action_type) {
    case 'attack':
      return `${attacker.name} attacks ${defender.name} for ${damage} damage!`;
    case 'spell':
      return `${attacker.name} casts ${result.spell_name} on ${defender.name} for ${damage} damage!`;
    case 'heal':
      return `${attacker.name} heals ${defender.name} for ${damage} HP!`;
    default:
      return `${attacker.name} uses ${action_type} on ${defender.name}!`;
  }
}
```

### IA Integration
```typescript
// IA can send messages when player is offline
interface AIChatCapabilities {
  can_send_party_messages: boolean;
  can_send_private_responses: boolean;
  can_use_global_chat: boolean; // probably false for safety
  
  allowed_message_types: MessageType[];
  max_messages_per_hour: number;
  requires_approval: boolean; // for first AI messages
}

// AI message validation
async function validateAIMessage(message: SendMessageData, characterId: string): Promise<ValidationResult> {
  const character = await Character.findById(characterId);
  const aiSettings = await AISettings.findByCharacter(characterId);
  
  // Check if AI is allowed to send messages
  if (!aiSettings.chat_permissions.can_send_party_messages && message.channel_type === 'party') {
    return { valid: false, reason: 'AI not allowed to send party messages' };
  }
  
  // Rate limiting for AI messages
  const recentMessages = await ChatMessage.findRecentAIMessages(characterId, 1); // last hour
  if (recentMessages.length >= aiSettings.chat_permissions.max_messages_per_hour) {
    return { valid: false, reason: 'AI message rate limit exceeded' };
  }
  
  // Content validation
  if (message.content.length > 200) {
    return { valid: false, reason: 'AI message too long' };
  }
  
  return { valid: true };
}
```

---

## 🛡️ MODERAZIONE E SICUREZZA

### Auto-Moderation
```typescript
interface ModerationSystem {
  profanity_filter: {
    enabled: boolean;
    word_list: string[];
    action_on_violation: 'warn' | 'hide' | 'mute';
    severity_levels: ModerationSeverity[];
  };
  
  spam_detection: {
    max_messages_per_minute: number;
    duplicate_message_threshold: number;
    caps_lock_percentage_limit: number;
  };
  
  auto_actions: {
    temp_mute_duration: number; // minutes
    escalation_thresholds: number[];
    admin_notification_threshold: number;
  };
}

// Automatic content filtering
async function moderateMessage(message: ChatMessage): Promise<ModerationResult> {
  const result: ModerationResult = {
    approved: true,
    actions_taken: [],
    severity_score: 0
  };
  
  // Profanity check
  const profanityCheck = await checkProfanity(message.content);
  if (profanityCheck.detected) {
    result.severity_score += profanityCheck.severity;
    result.actions_taken.push('content_filtered');
  }
  
  // Spam detection
  const spamCheck = await checkSpam(message.sender_id, message.content);
  if (spamCheck.is_spam) {
    result.severity_score += 2;
    result.actions_taken.push('spam_detected');
  }
  
  // Auto-actions based on severity
  if (result.severity_score >= 3) {
    result.approved = false;
    result.actions_taken.push('message_hidden');
    
    if (result.severity_score >= 5) {
      result.actions_taken.push('user_temp_muted');
      await tempMuteUser(message.sender_id, 10); // 10 minutes
    }
  }
  
  return result;
}
```

### Rate Limiting
```typescript
// Rate limiting per user
const RATE_LIMITS = {
  global_chat: { messages: 10, per_minutes: 1 },
  location_chat: { messages: 15, per_minutes: 1 },
  party_chat: { messages: 30, per_minutes: 1 },
  private_messages: { messages: 20, per_minutes: 1 }
};

async function checkRateLimit(userId: string, channelType: ChatChannelType): Promise<boolean> {
  const limit = RATE_LIMITS[channelType];
  const key = `rate_limit:${userId}:${channelType}`;
  
  const messageCount = await Redis.get(key) || 0;
  
  if (messageCount >= limit.messages) {
    return false; // Rate limit exceeded
  }
  
  // Increment counter
  await Redis.setex(key, limit.per_minutes * 60, parseInt(messageCount) + 1);
  return true;
}
```

---

## 📱 CLIENT INTEGRATION

### React Chat Component Structure
```typescript
// Main chat interface
interface ChatInterface {
  active_channels: ChatChannel[];
  current_channel: string;
  message_history: Map<string, ChatMessage[]>;
  typing_indicators: Map<string, string[]>;
  unread_counts: Map<string, number>;
  user_settings: ChatUserSettings;
}

// Chat message component
interface ChatMessageProps {
  message: ChatMessage;
  show_timestamp: boolean;
  show_sender_info: boolean;
  enable_actions: boolean; // edit, delete, report
  highlight_mentions: boolean;
}

// Channel list component
interface ChannelListProps {
  channels: ChatChannel[];
  active_channel: string;
  unread_counts: Map<string, number>;
  on_channel_select: (channelId: string) => void;
  on_channel_leave: (channelId: string) => void;
}
```

### WebSocket Client Manager
```typescript
class ChatSocketManager {
  private socket: Socket;
  private reconnect_attempts: number = 0;
  private max_reconnect_attempts: number = 5;
  
  constructor(characterId: string) {
    this.socket = io('/chat', {
      auth: { character_id: characterId },
      transports: ['websocket']
    });
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('Chat connected');
      this.reconnect_attempts = 0;
      this.joinDefaultChannels();
    });
    
    this.socket.on('disconnect', () => {
      console.log('Chat disconnected');
      this.handleReconnection();
    });
    
    this.socket.on('chat:message_received', (message: ChatMessage) => {
      this.handleNewMessage(message);
    });
    
    this.socket.on('chat:user_joined', (channelId: string, user: ChatUser) => {
      this.handleUserJoined(channelId, user);
    });
  }
  
  async sendMessage(channelId: string, content: string, messageType: MessageType = MessageType.TEXT) {
    if (!this.socket.connected) {
      throw new Error('Chat not connected');
    }
    
    return new Promise((resolve, reject) => {
      this.socket.emit('chat:send_message', {
        channel_id: channelId,
        content: content,
        message_type: messageType
      }, (response: any) => {
        if (response.success) {
          resolve(response.message);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }
}
```

---

## 🚀 DEPLOYMENT CONSIDERATIONS

### Redis Configuration
```typescript
// Redis channels for chat scaling
const REDIS_CHANNELS = {
  CHAT_MESSAGES: 'chat:messages',
  USER_STATUS: 'chat:user_status', 
  TYPING_INDICATORS: 'chat:typing',
  MODERATION_ALERTS: 'chat:moderation'
};

// Redis pub/sub for multiple server instances
class ChatRedisManager {
  async publishMessage(message: ChatMessage) {
    await Redis.publish(REDIS_CHANNELS.CHAT_MESSAGES, JSON.stringify(message));
  }
  
  async subscribeToMessages() {
    Redis.subscribe(REDIS_CHANNELS.CHAT_MESSAGES, (channel, messageData) => {
      const message = JSON.parse(messageData);
      this.broadcastToConnectedClients(message);
    });
  }
}
```

### Performance Optimizations
- Message history pagination (50 messages per page)
- Redis caching for active channels
- Database connection pooling for high concurrent users
- WebSocket connection heartbeat every 30 seconds
- Automatic cleanup of old messages (90 days retention)

---

## 🧪 TESTING STRATEGY

### Unit Tests
- Message validation logic
- Rate limiting functionality
- Auto-moderation filters
- Channel management operations

### Integration Tests
- WebSocket connection handling
- Message delivery across multiple clients
- Database operations under load
- Redis pub/sub reliability

### Load Tests
- 100+ concurrent users in same channel
- Message throughput under high load
- Memory usage with long-running connections
- Database performance with large message history

---

## 📈 METRICS E MONITORING

### Chat Analytics
- Messages sent per channel type
- Active users per time period
- Average response times
- Most active channels and times

### Performance Metrics
- WebSocket connection count
- Message delivery latency
- Database query performance
- Redis memory usage

### Moderation Metrics
- Auto-moderation actions taken
- User reports processed
- False positive rates
- Admin intervention frequency

---

**Priorità Implementazione**: CRITICA per Week 1  
**Dipendenze**: WebSocket infrastructure, Redis setup  
**Ready for Development**: ✅ Completamente specificato
