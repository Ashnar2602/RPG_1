# 🔌 WEBSOCKET CHAT UNIFIED INFRASTRUCTURE - RPG_1 Project
## Real-Time Communication System Unificato

**Data**: 5 settembre 2025  
**Versione**: 1.0 MVP  
**Risolve**: Problema Critico #2 - Overlap WebSocket Infrastructure vs Chat System

---

## 📋 **OVERVIEW**

Questo documento **unifica** le specifiche precedentemente separate:
- ❌ `WEBSOCKET_INFRASTRUCTURE_SPECIFICATION.md` (sostituito)
- ❌ `CHAT_SYSTEM_SPECIFICATION.md` (sostituito)

**Risultato**: Sistema unico, coerente, senza duplicazioni.

---

## 🎯 **UNIFIED ARCHITECTURE**

### **Core WebSocket Infrastructure**
```typescript
// Real-time features supportate
interface UnifiedWebSocketSystem {
  // Chat system (primary feature)
  chat: {
    global_chat: GlobalChatChannel;
    location_chat: LocationBasedChat;
    party_chat: PartyChat;
    private_messages: PrivateMessaging;
    guild_chat: GuildChat;
  };
  
  // Game event broadcasting
  game_events: {
    combat_updates: CombatEventSystem;
    character_updates: CharacterEventSystem;
    world_events: WorldEventSystem;
    notifications: NotificationSystem;
  };
  
  // Real-time coordination
  coordination: {
    party_coordination: PartyCoordination;
    guild_events: GuildEventSystem;
    system_announcements: SystemBroadcasts;
  };
}
```

---

## 🏗️ **SERVER ARCHITECTURE**

### **Core Socket.IO Setup**
```typescript
// server.ts - Unified WebSocket + Chat Server
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

class UnifiedWebSocketServer {
  private io: Server;
  private redisClient: any;
  private publisher: any;
  private subscriber: any;

  constructor(httpServer: any) {
    // Initialize Socket.IO with CORS
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_ORIGINS?.split(',') || ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupRedisAdapter();
    this.setupEventHandlers();
    this.setupChatSystem();
    this.setupGameEventSystem();
  }

  private async setupRedisAdapter() {
    // Redis pub/sub for scaling across server instances
    this.publisher = createClient({ 
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      db: 1 // Separate DB for WebSocket events
    });
    
    this.subscriber = this.publisher.duplicate();
    
    await Promise.all([
      this.publisher.connect(),
      this.subscriber.connect()
    ]);

    // Redis adapter for multi-server support
    this.io.adapter(createAdapter(this.publisher, this.subscriber));
    
    console.log('✅ Redis adapter configured for WebSocket scaling');
  }
}
```

### **Connection Management**
```typescript
class ConnectionManager {
  private activeConnections = new Map<string, SocketUserData>();
  private heartbeatInterval = 30000; // 30 seconds
  
  setupConnection(socket: any) {
    // Authentication & user data setup
    socket.on('authenticate', async (authData: AuthData) => {
      try {
        const userData = await this.authenticateUser(authData);
        
        if (userData) {
          socket.userId = userData.character_id;
          socket.username = userData.character_name;
          socket.join(`user_${userData.character_id}`); // Personal room
          
          // Join location-based room
          if (userData.current_location_id) {
            socket.join(`location_${userData.current_location_id}`);
          }
          
          // Join guild room if member
          if (userData.guild_id) {
            socket.join(`guild_${userData.guild_id}`);
          }
          
          this.activeConnections.set(socket.id, userData);
          
          socket.emit('authenticated', {
            success: true,
            user_data: userData,
            server_time: new Date(),
            active_channels: await this.getActiveChannels(userData)
          });
          
          // Broadcast user online status
          this.broadcastUserStatus(userData.character_id, 'online');
          
        } else {
          socket.emit('authentication_failed', { reason: 'invalid_credentials' });
          socket.disconnect();
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('authentication_failed', { reason: 'server_error' });
        socket.disconnect();
      }
    });

    // Heartbeat system
    socket.on('ping', () => {
      socket.emit('pong', { server_time: new Date() });
    });

    // Disconnection handling
    socket.on('disconnect', (reason) => {
      const userData = this.activeConnections.get(socket.id);
      if (userData) {
        this.broadcastUserStatus(userData.character_id, 'offline');
        this.activeConnections.delete(socket.id);
        console.log(`User ${userData.character_name} disconnected: ${reason}`);
      }
    });
  }
}
```

---

## 💬 **UNIFIED CHAT SYSTEM**

### **Chat Channel Management**
```typescript
class ChatChannelManager {
  private channels = new Map<string, ChatChannel>();

  async createChannel(type: ChannelType, context?: ChannelContext): Promise<string> {
    const channelId = `${type}_${context?.target_id || 'global'}_${Date.now()}`;
    
    const channel: ChatChannel = {
      id: channelId,
      type: type,
      context: context,
      participants: new Set(),
      message_history: [],
      settings: {
        max_participants: this.getMaxParticipants(type),
        rate_limit: this.getRateLimit(type),
        moderation_enabled: this.isModerationEnabled(type),
        message_retention_hours: this.getRetentionHours(type)
      },
      created_at: new Date()
    };

    this.channels.set(channelId, channel);
    
    // Save to database
    await this.saveChannelToDatabase(channel);
    
    return channelId;
  }

  async handleChatMessage(socket: any, messageData: ChatMessageData) {
    const userData = this.getSocketUserData(socket);
    if (!userData) return;

    // Validate message
    const validation = await this.validateMessage(messageData, userData);
    if (!validation.valid) {
      socket.emit('message_error', { 
        reason: validation.reason,
        message_id: messageData.temp_id 
      });
      return;
    }

    // Rate limiting check
    if (await this.isRateLimited(userData.character_id, messageData.channel_id)) {
      socket.emit('message_error', { 
        reason: 'rate_limited',
        retry_after: 60 
      });
      return;
    }

    // Create message object
    const message: ChatMessage = {
      id: generateUUID(),
      channel_id: messageData.channel_id,
      sender_id: userData.character_id,
      sender_name: userData.character_name,
      message_type: messageData.type || 'text',
      content: messageData.content,
      metadata: messageData.metadata || {},
      created_at: new Date()
    };

    // Save to database
    await this.saveMessageToDatabase(message);

    // Broadcast to channel participants
    await this.broadcastMessage(message);

    // Send confirmation to sender
    socket.emit('message_sent', {
      temp_id: messageData.temp_id,
      message_id: message.id,
      sent_at: message.created_at
    });
  }

  private async broadcastMessage(message: ChatMessage) {
    const channel = this.channels.get(message.channel_id);
    if (!channel) return;

    // Determine Socket.IO room based on channel type
    let roomName: string;
    
    switch (channel.type) {
      case 'global':
        roomName = 'global_chat';
        break;
      case 'location':
        roomName = `location_${channel.context?.location_id}`;
        break;
      case 'party':
        roomName = `party_${channel.context?.party_id}`;
        break;
      case 'guild':
        roomName = `guild_${channel.context?.guild_id}`;
        break;
      case 'private':
        // Send to both participants individually
        this.io.to(`user_${message.sender_id}`).emit('chat_message', message);
        this.io.to(`user_${channel.context?.target_user_id}`).emit('chat_message', message);
        return;
      default:
        console.error(`Unknown channel type: ${channel.type}`);
        return;
    }

    // Broadcast to room
    this.io.to(roomName).emit('chat_message', message);
    
    // Update channel last activity
    channel.last_activity = new Date();
  }
}
```

### **Message Types & Formatting**
```typescript
// Unified message type definitions
interface ChatMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  sender_name: string;
  message_type: 'text' | 'action' | 'system' | 'combat' | 'trade' | 'notification';
  content: string;
  metadata: {
    // For action messages
    action_type?: string;
    action_target?: string;
    
    // For system messages
    system_event_type?: string;
    affected_users?: string[];
    
    // For combat messages
    combat_session_id?: string;
    damage_dealt?: number;
    abilities_used?: string[];
    
    // For mentions and formatting
    mentions?: string[];
    formatting?: {
      bold?: boolean;
      italic?: boolean;
      color?: string;
    };
    
    // For moderation
    flagged?: boolean;
    flagged_reason?: string;
  };
  created_at: Date;
  edited_at?: Date;
  deleted_at?: Date;
}

// Message processing pipeline
class MessageProcessor {
  async processMessage(rawMessage: string, type: string, sender: UserData): Promise<ProcessedMessage> {
    let processed = rawMessage;
    
    // 1. Profanity filter
    processed = await this.applyProfanityFilter(processed);
    
    // 2. Mention detection (@username)
    const mentions = this.extractMentions(processed);
    
    // 3. Command processing (/me, /roll, etc.)
    const commandResult = await this.processCommands(processed, sender);
    if (commandResult.is_command) {
      return {
        content: commandResult.formatted_message,
        type: commandResult.message_type,
        metadata: { ...commandResult.metadata, mentions }
      };
    }
    
    // 4. Link detection and safety
    processed = await this.processSafeLinks(processed);
    
    // 5. Emote/emoji conversion
    processed = this.processEmotes(processed);
    
    return {
      content: processed,
      type: type,
      metadata: { mentions }
    };
  }

  private async processCommands(message: string, sender: UserData): Promise<CommandResult> {
    if (!message.startsWith('/')) {
      return { is_command: false };
    }

    const [command, ...args] = message.slice(1).split(' ');
    
    switch (command.toLowerCase()) {
      case 'me':
        return {
          is_command: true,
          message_type: 'action',
          formatted_message: args.join(' '),
          metadata: { action_type: 'emote', action_target: sender.character_name }
        };
        
      case 'roll':
        const diceResult = this.rollDice(args[0] || 'd20');
        return {
          is_command: true,
          message_type: 'action',
          formatted_message: `rolled ${diceResult.notation} and got ${diceResult.result}`,
          metadata: { 
            action_type: 'dice_roll', 
            dice_notation: diceResult.notation,
            dice_result: diceResult.result
          }
        };
        
      case 'w':
      case 'whisper':
        const targetUser = args[0];
        const whisperMessage = args.slice(1).join(' ');
        return {
          is_command: true,
          message_type: 'private',
          formatted_message: whisperMessage,
          metadata: { 
            action_type: 'whisper',
            target_user: targetUser
          }
        };
        
      default:
        return { is_command: false };
    }
  }
}
```

---

## 🎮 **GAME EVENT SYSTEM**

### **Real-Time Game Events**
```typescript
class GameEventBroadcaster {
  
  // Combat events
  async broadcastCombatEvent(combat_session_id: string, event: CombatEvent) {
    const participants = await this.getCombatParticipants(combat_session_id);
    
    // Send to all combat participants
    participants.forEach(participant_id => {
      this.io.to(`user_${participant_id}`).emit('combat_event', {
        session_id: combat_session_id,
        event_type: event.type,
        event_data: event.data,
        timestamp: new Date()
      });
    });

    // Send combat log to location channel
    const session = await this.getCombatSession(combat_session_id);
    if (session.location_id) {
      const combatMessage: ChatMessage = {
        id: generateUUID(),
        channel_id: `location_${session.location_id}`,
        sender_id: null, // System message
        sender_name: 'Combat System',
        message_type: 'combat',
        content: this.formatCombatEventForChat(event),
        metadata: {
          system_event_type: 'combat_action',
          combat_session_id: combat_session_id,
          affected_users: participants
        },
        created_at: new Date()
      };

      await this.chatManager.broadcastSystemMessage(combatMessage);
    }
  }

  // Character progression events
  async broadcastCharacterUpdate(character_id: string, update: CharacterUpdate) {
    // Send to character
    this.io.to(`user_${character_id}`).emit('character_update', update);

    // Send notifications to friends/party/guild
    const relationships = await this.getCharacterRelationships(character_id);
    
    if (update.type === 'level_up') {
      // Broadcast level up to guild
      if (relationships.guild_id) {
        this.io.to(`guild_${relationships.guild_id}`).emit('guild_notification', {
          type: 'member_level_up',
          character_id: character_id,
          character_name: update.character_name,
          new_level: update.new_level
        });
      }

      // Send congratulations message to location chat
      const levelUpMessage: ChatMessage = {
        id: generateUUID(),
        channel_id: `location_${update.current_location_id}`,
        sender_id: null,
        sender_name: 'System',
        message_type: 'system',
        content: `${update.character_name} has reached level ${update.new_level}!`,
        metadata: {
          system_event_type: 'level_up',
          affected_users: [character_id]
        },
        created_at: new Date()
      };

      await this.chatManager.broadcastSystemMessage(levelUpMessage);
    }
  }

  // World events
  async broadcastWorldEvent(event: WorldEvent) {
    // System-wide announcements
    this.io.emit('world_event', {
      event_type: event.type,
      title: event.title,
      description: event.description,
      affects_all_players: event.global,
      duration_minutes: event.duration,
      timestamp: new Date()
    });

    // Send as system message to global chat
    const worldEventMessage: ChatMessage = {
      id: generateUUID(),
      channel_id: 'global_chat',
      sender_id: null,
      sender_name: 'World System',
      message_type: 'system',
      content: `🌍 ${event.title}: ${event.description}`,
      metadata: {
        system_event_type: 'world_event',
        event_id: event.id,
        event_category: event.category
      },
      created_at: new Date()
    };

    await this.chatManager.broadcastSystemMessage(worldEventMessage);
  }
}
```

---

## 🛡️ **SECURITY & MODERATION**

### **Rate Limiting & Spam Protection**
```typescript
class ModerationSystem {
  private rateLimiter = new Map<string, RateLimitData>();
  private spamDetector = new SpamDetectionEngine();

  async checkRateLimit(user_id: string, channel_id: string): Promise<RateLimitResult> {
    const key = `${user_id}_${channel_id}`;
    const now = Date.now();
    const limit = this.getRateLimitForChannel(channel_id);
    
    if (!this.rateLimiter.has(key)) {
      this.rateLimiter.set(key, {
        messages: [now],
        window_start: now
      });
      return { allowed: true };
    }

    const userData = this.rateLimiter.get(key)!;
    
    // Clean old messages outside time window
    userData.messages = userData.messages.filter(
      timestamp => now - timestamp < limit.window_ms
    );

    if (userData.messages.length >= limit.max_messages) {
      return {
        allowed: false,
        retry_after: limit.window_ms - (now - userData.messages[0])
      };
    }

    userData.messages.push(now);
    return { allowed: true };
  }

  async detectSpam(message: string, user_id: string): Promise<SpamDetectionResult> {
    // Check for repeated characters
    if (this.hasExcessiveRepeating(message)) {
      return { is_spam: true, reason: 'excessive_repeating' };
    }

    // Check for advertising patterns
    if (this.containsAdvertising(message)) {
      return { is_spam: true, reason: 'advertising' };
    }

    // Check user's recent message history
    const recentMessages = await this.getRecentMessages(user_id, 10);
    if (this.isDuplicateSpam(message, recentMessages)) {
      return { is_spam: true, reason: 'duplicate_messages' };
    }

    return { is_spam: false };
  }

  async moderateMessage(message: ChatMessage): Promise<ModerationAction> {
    // Auto-moderation rules
    const rules = await this.getModerationRules(message.channel_id);
    
    for (const rule of rules) {
      const violation = await this.checkRule(message, rule);
      if (violation.triggered) {
        return {
          action: rule.action, // 'delete', 'flag', 'mute_user', 'ban_user'
          reason: violation.reason,
          duration: rule.duration,
          automated: true
        };
      }
    }

    return { action: 'allow' };
  }
}
```

---

## 📊 **MONITORING & METRICS**

### **Performance Monitoring**
```typescript
class WebSocketMetrics {
  private metrics = {
    active_connections: 0,
    messages_per_second: 0,
    average_latency_ms: 0,
    error_rate: 0,
    redis_performance: {
      pub_latency_ms: 0,
      sub_latency_ms: 0
    }
  };

  startMetricsCollection() {
    // Connection metrics
    setInterval(() => {
      this.metrics.active_connections = this.io.engine.clientsCount;
      this.publishMetrics();
    }, 10000); // Every 10 seconds

    // Message throughput
    setInterval(() => {
      this.calculateMessageThroughput();
    }, 5000); // Every 5 seconds

    // Latency monitoring
    setInterval(() => {
      this.measureLatency();
    }, 30000); // Every 30 seconds
  }

  private async publishMetrics() {
    // Send to monitoring service (Prometheus, DataDog, etc.)
    await this.redis.publish('metrics:websocket', JSON.stringify({
      server_id: process.env.SERVER_ID,
      timestamp: new Date(),
      metrics: this.metrics
    }));
  }
}
```

---

## 🚀 **DEPLOYMENT & SCALING**

### **Production Configuration**
```typescript
// production.ts
const productionConfig = {
  redis: {
    cluster_enabled: true,
    sentinel_hosts: process.env.REDIS_SENTINELS?.split(','),
    password: process.env.REDIS_PASSWORD,
    db: {
      chat_messages: 0,
      websocket_events: 1,
      rate_limiting: 2,
      session_store: 3
    }
  },
  
  websocket: {
    max_connections_per_server: 5000,
    heartbeat_interval: 30000,
    disconnect_timeout: 60000,
    compression: true,
    binary_support: true
  },

  chat: {
    message_retention_days: 30,
    max_message_length: 1000,
    max_channels_per_user: 50,
    rate_limits: {
      global: { messages: 10, window_ms: 60000 },
      location: { messages: 20, window_ms: 60000 },
      party: { messages: 30, window_ms: 60000 },
      guild: { messages: 25, window_ms: 60000 },
      private: { messages: 15, window_ms: 60000 }
    }
  },

  moderation: {
    auto_moderate: true,
    profanity_filter_enabled: true,
    spam_detection_enabled: true,
    auto_mute_threshold: 3, // violations before auto-mute
    admin_notification_threshold: 5
  }
};
```

### **Load Balancing Strategy**
```typescript
// Multi-server sticky sessions based on user_id
class LoadBalancerConfig {
  static getServerForUser(user_id: string): string {
    const hash = createHash('md5').update(user_id).digest('hex');
    const serverIndex = parseInt(hash.substring(0, 8), 16) % SERVER_COUNT;
    return WEBSOCKET_SERVERS[serverIndex];
  }

  static setupStickyRouting(app: Express) {
    app.use('/socket.io/', (req, res, next) => {
      const user_id = req.query.user_id as string;
      if (user_id && process.env.NODE_ENV === 'production') {
        const targetServer = this.getServerForUser(user_id);
        if (targetServer !== process.env.SERVER_ID) {
          return res.redirect(`https://${targetServer}/socket.io/${req.path}`);
        }
      }
      next();
    });
  }
}
```

---

## ✅ **INTEGRATION POINTS**

### **Database Integration**
```typescript
// Uses unified DATABASE_MASTER_SCHEMA.md tables:
// - chat_channels
// - chat_messages  
// - chat_user_settings
// - characters (for auth and user data)
// - guilds, guild_members (for guild chat)
// - locations (for location-based chat)
```

### **API Integration**
```typescript
// REST API fallback for when WebSocket unavailable
app.post('/api/chat/send', async (req, res) => {
  const result = await chatManager.handleChatMessage(null, {
    ...req.body,
    sender_id: req.user.character_id,
    fallback_mode: true
  });
  
  res.json(result);
});

app.get('/api/chat/history/:channel_id', async (req, res) => {
  const history = await chatManager.getChannelHistory(
    req.params.channel_id,
    req.query.limit || 50,
    req.query.before
  );
  
  res.json(history);
});
```

---

## 📱 **CLIENT INTEGRATION**

### **React WebSocket Hook**
```typescript
// useWebSocket.ts
export function useWebSocket(user_token: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socketInstance = io(WEBSOCKET_URL, {
      auth: { token: user_token },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      socketInstance.emit('authenticate', { token: user_token });
    });

    socketInstance.on('authenticated', (data) => {
      console.log('WebSocket authenticated:', data);
    });

    socketInstance.on('chat_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user_token]);

  const sendMessage = useCallback((channel_id: string, content: string, type: string = 'text') => {
    if (socket && connected) {
      socket.emit('send_message', {
        temp_id: generateTempId(),
        channel_id,
        content,
        type
      });
    }
  }, [socket, connected]);

  return { socket, connected, messages, sendMessage };
}
```

---

## ✅ **BENEFITS OF UNIFIED SYSTEM**

### **✅ Eliminazione Duplicazioni**:
- Single WebSocket server handling ALL real-time features
- Unified message format across chat and game events
- Shared authentication and user management
- Consistent rate limiting and moderation

### **✅ Performance Optimization**:
- Single Redis adapter for scaling
- Shared connection pools
- Unified monitoring and metrics
- Efficient room management

### **✅ Development Benefits**:
- Single codebase to maintain
- Consistent APIs and interfaces
- Unified testing strategy
- Clear separation of concerns

---

**🎯 NEXT STEPS**:
1. Replace old WebSocket and Chat specification files
2. Update client-side integration code
3. Setup Redis cluster for production
4. Implement monitoring dashboard

**✅ PROBLEMA CRITICO #2: RISOLTO**
