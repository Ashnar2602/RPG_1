# WEBSOCKET INFRASTRUCTURE - Specifica Completa
## Real-Time Communication System MMO

### 📋 OVERVIEW
Infrastruttura WebSocket scalabile per MMO testuale che supporta chat real-time, notifiche di gioco, aggiornamenti stato, combat events e sincronizzazione multi-giocatore. Basata su Socket.IO con Redis per scaling multi-server.

---

## 🎯 REQUISITI FUNZIONALI

### Real-Time Features Supportate
- **Chat System**: Messaggi istantanei globali, location-based, party, private, guild
- **Game Notifications**: Level up, item drops, quest completion, trade requests
- **Combat Updates**: Turni combattimento, damage, status effects in tempo reale
- **Player Status**: Online/offline, location changes, activity status
- **Party Coordination**: Movimento gruppo, target sharing, formazioni
- **Guild Events**: Notifiche immediate per eventi guild importanti
- **System Announcements**: Server maintenance, eventi speciali, aggiornamenti

### Connection Management
- **Auto-reconnection**: Reconnessione automatica con retry exponential backoff
- **Session Persistence**: Mantenimento stato durante disconnessioni brevi
- **Heartbeat System**: Ping/pong per rilevamento connessioni morte
- **Graceful Degradation**: Fallback a REST API se WebSocket non disponibile
- **Load Balancing**: Distribuzione connessioni tra server instances

---

## 🏗️ ARCHITETTURA TECNICA

### Server Architecture
```typescript
interface WebSocketServer {
  // Socket.IO server instance
  io: SocketIOServer;
  
  // Redis for inter-server communication
  redis_client: Redis;
  redis_adapter: RedisAdapter;
  
  // Connection management
  connection_manager: ConnectionManager;
  room_manager: RoomManager;
  
  // Event handlers
  event_handlers: Map<string, EventHandler>;
  
  // Authentication and authorization
  auth_middleware: AuthMiddleware;
  
  // Rate limiting and abuse prevention
  rate_limiter: RateLimiter;
  
  // Monitoring and metrics
  metrics_collector: MetricsCollector;
}

// Connection state management
interface ClientConnection {
  socket_id: string;
  user_id: string;
  character_id: string;
  character_name: string;
  
  // Connection info
  connected_at: Date;
  last_activity: Date;
  ip_address: string;
  user_agent: string;
  
  // Game state
  current_location_id: string;
  party_id?: string;
  guild_id?: string;
  
  // Connection status
  status: ConnectionStatus;
  away_since?: Date;
  
  // Rooms (channels) the client is subscribed to
  subscribed_rooms: Set<string>;
  
  // Rate limiting data
  rate_limit_data: RateLimitData;
  
  // Permissions
  permissions: ClientPermissions;
}

enum ConnectionStatus {
  CONNECTED = 'connected',
  AWAY = 'away',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting'
}

interface ClientPermissions {
  can_send_global_chat: boolean;
  can_send_private_messages: boolean;
  is_muted: boolean;
  mute_expires_at?: Date;
  is_admin: boolean;
  rate_limit_exemption: boolean;
}
```

### Room Management System
```typescript
// Rooms for organizing real-time communication
enum RoomType {
  // Chat rooms
  GLOBAL_CHAT = 'chat:global',
  LOCATION_CHAT = 'chat:location',
  PARTY_CHAT = 'chat:party',
  GUILD_CHAT = 'chat:guild',
  PRIVATE_CHAT = 'chat:private',
  
  // Game state rooms
  LOCATION = 'location',
  PARTY = 'party',
  COMBAT = 'combat',
  
  // System rooms
  USER_NOTIFICATIONS = 'notifications',
  ADMIN_BROADCAST = 'admin',
  
  // Special rooms
  NEWBIE_HELP = 'help:newbie',
  TRADE_ZONE = 'trade'
}

class RoomManager {
  // Join character to appropriate rooms based on game state
  async joinCharacterRooms(socket: Socket, character: Character) {
    const rooms = await this.calculateCharacterRooms(character);
    
    for (const room of rooms) {
      await socket.join(room);
      await this.updateRoomMemberList(room, character, 'joined');
    }
    
    // Send room update notifications
    await this.notifyRoomUpdates(socket, rooms);
  }
  
  async calculateCharacterRooms(character: Character): Promise<string[]> {
    const rooms: string[] = [];
    
    // Always join global notifications
    rooms.push(`${RoomType.USER_NOTIFICATIONS}:${character.id}`);
    rooms.push(RoomType.GLOBAL_CHAT);
    
    // Location-based room
    if (character.current_location_id) {
      rooms.push(`${RoomType.LOCATION_CHAT}:${character.current_location_id}`);
      rooms.push(`${RoomType.LOCATION}:${character.current_location_id}`);
    }
    
    // Party room
    if (character.party_id) {
      rooms.push(`${RoomType.PARTY_CHAT}:${character.party_id}`);
      rooms.push(`${RoomType.PARTY}:${character.party_id}`);
    }
    
    // Guild room
    if (character.guild_id) {
      rooms.push(`${RoomType.GUILD_CHAT}:${character.guild_id}`);
    }
    
    // Combat room (if in combat)
    if (character.combat_state?.combat_id) {
      rooms.push(`${RoomType.COMBAT}:${character.combat_state.combat_id}`);
    }
    
    // Admin room (if admin)
    if (character.user.is_admin) {
      rooms.push(RoomType.ADMIN_BROADCAST);
    }
    
    return rooms;
  }
  
  // Dynamic room management when game state changes
  async onLocationChange(character_id: string, old_location: string, new_location: string) {
    const socket = this.getSocketByCharacter(character_id);
    if (!socket) return;
    
    // Leave old location rooms
    if (old_location) {
      await socket.leave(`${RoomType.LOCATION_CHAT}:${old_location}`);
      await socket.leave(`${RoomType.LOCATION}:${old_location}`);
    }
    
    // Join new location rooms
    await socket.join(`${RoomType.LOCATION_CHAT}:${new_location}`);
    await socket.join(`${RoomType.LOCATION}:${new_location}`);
    
    // Notify location users of character arrival/departure
    await this.broadcastLocationUpdate(old_location, new_location, character_id);
  }
}
```

### Event System
```typescript
// Standardized event structure for all WebSocket communications
interface WebSocketEvent {
  event_type: string;
  timestamp: Date;
  sender_id?: string;
  target_room?: string;
  data: any;
  
  // Delivery options
  requires_ack: boolean;
  persist_offline: boolean;
  expiry_time?: Date;
  
  // Security
  permission_required?: string;
  rate_limit_category?: string;
}

// Event categories for organization
enum EventCategory {
  // Chat events
  CHAT = 'chat',
  
  // Game state events
  GAME_STATE = 'game_state',
  COMBAT = 'combat',
  MOVEMENT = 'movement',
  
  // Social events
  PARTY = 'party',
  GUILD = 'guild',
  FRIEND = 'friend',
  
  // System events
  NOTIFICATION = 'notification',
  SYSTEM = 'system',
  ADMIN = 'admin',
  
  // AI events
  AI_ACTION = 'ai_action',
  AI_STATUS = 'ai_status'
}

// Event handler registration system
class EventHandlerRegistry {
  private handlers: Map<string, EventHandler[]> = new Map();
  
  register(event_type: string, handler: EventHandler) {
    if (!this.handlers.has(event_type)) {
      this.handlers.set(event_type, []);
    }
    this.handlers.get(event_type)!.push(handler);
  }
  
  async handle(socket: Socket, event: WebSocketEvent): Promise<void> {
    const handlers = this.handlers.get(event.event_type) || [];
    
    // Pre-processing
    await this.validateEvent(socket, event);
    await this.checkRateLimit(socket, event);
    await this.checkPermissions(socket, event);
    
    // Execute handlers
    for (const handler of handlers) {
      try {
        await handler.handle(socket, event);
      } catch (error) {
        console.error(`Event handler error for ${event.event_type}:`, error);
        await this.handleEventError(socket, event, error);
      }
    }
    
    // Post-processing
    await this.logEvent(socket, event);
    await this.updateMetrics(event);
  }
}
```

---

## 🗄️ REDIS INTEGRATION

### Redis Adapter Configuration
```typescript
// Redis setup for scaling Socket.IO across multiple servers
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

class RedisWebSocketAdapter {
  private publisher: Redis;
  private subscriber: Redis;
  
  async initialize() {
    // Create Redis clients
    this.publisher = createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: 0 // Use separate DB for WebSocket
    });
    
    this.subscriber = this.publisher.duplicate();
    
    await this.publisher.connect();
    await this.subscriber.connect();
    
    // Create Socket.IO Redis adapter
    const adapter = createAdapter(this.publisher, this.subscriber);
    io.adapter(adapter);
    
    // Set up custom Redis channels for game events
    await this.setupGameEventChannels();
  }
  
  async setupGameEventChannels() {
    // Subscribe to game events from other services
    await this.subscriber.subscribe('game:character_update', this.handleCharacterUpdate.bind(this));
    await this.subscriber.subscribe('game:combat_event', this.handleCombatEvent.bind(this));
    await this.subscriber.subscribe('game:party_update', this.handlePartyUpdate.bind(this));
    await this.subscriber.subscribe('game:guild_event', this.handleGuildEvent.bind(this));
    await this.subscriber.subscribe('game:system_announcement', this.handleSystemAnnouncement.bind(this));
  }
  
  // Publish events to other server instances
  async publishCharacterUpdate(character_id: string, update_data: any) {
    await this.publisher.publish('game:character_update', JSON.stringify({
      character_id,
      update_data,
      timestamp: new Date(),
      server_id: process.env.SERVER_ID
    }));
  }
  
  async publishCombatEvent(combat_id: string, event_data: any) {
    await this.publisher.publish('game:combat_event', JSON.stringify({
      combat_id,
      event_data,
      timestamp: new Date(),
      server_id: process.env.SERVER_ID
    }));
  }
}
```

### Offline Message Persistence
```typescript
// Store messages for offline users in Redis
class OfflineMessageManager {
  private redis: Redis;
  private ttl_hours: number = 72; // 3 days retention
  
  async storeOfflineMessage(user_id: string, message: OfflineMessage) {
    const key = `offline_messages:${user_id}`;
    const message_data = JSON.stringify({
      ...message,
      stored_at: new Date()
    });
    
    // Add to user's offline message list
    await this.redis.lpush(key, message_data);
    
    // Set expiry on the list
    await this.redis.expire(key, this.ttl_hours * 3600);
    
    // Limit number of stored messages per user
    await this.redis.ltrim(key, 0, 99); // Keep last 100 messages
  }
  
  async getOfflineMessages(user_id: string): Promise<OfflineMessage[]> {
    const key = `offline_messages:${user_id}`;
    const messages = await this.redis.lrange(key, 0, -1);
    
    // Clear messages after retrieval
    await this.redis.del(key);
    
    return messages.map(msg => JSON.parse(msg));
  }
  
  async deliverOfflineMessages(socket: Socket, character_id: string) {
    const character = await Character.findById(character_id);
    const messages = await this.getOfflineMessages(character.user_id);
    
    for (const message of messages) {
      // Emit stored message to client
      socket.emit('offline_message_delivery', message);
      
      // Add small delay to prevent flooding
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (messages.length > 0) {
      socket.emit('offline_messages_complete', { count: messages.length });
    }
  }
}

interface OfflineMessage {
  type: 'chat' | 'notification' | 'system' | 'guild' | 'party';
  sender_id?: string;
  sender_name?: string;
  content: string;
  metadata?: any;
  importance: 'low' | 'normal' | 'high' | 'urgent';
  created_at: Date;
}
```

---

## 🔌 EVENT DEFINITIONS

### Client -> Server Events
```typescript
interface ClientEvents {
  // Connection management
  'authenticate': (token: string) => void;
  'heartbeat': () => void;
  'set_status': (status: ConnectionStatus) => void;
  
  // Chat events
  'chat:send_message': (data: SendMessageData) => void;
  'chat:join_channel': (channel_id: string) => void;
  'chat:leave_channel': (channel_id: string) => void;
  'chat:typing_start': (channel_id: string) => void;
  'chat:typing_stop': (channel_id: string) => void;
  
  // Game action events
  'game:move': (location_id: string) => void;
  'game:combat_action': (action_data: CombatActionData) => void;
  'game:use_item': (item_id: string, target?: string) => void;
  'game:interact_npc': (npc_id: string, action: string) => void;
  
  // Party events
  'party:invite': (character_id: string) => void;
  'party:accept_invite': (invite_id: string) => void;
  'party:leave': () => void;
  'party:set_formation': (formation_data: FormationData) => void;
  
  // Guild events
  'guild:invite_member': (character_id: string) => void;
  'guild:promote_member': (member_id: string, new_role: string) => void;
  'guild:contribute_treasury': (amount: number) => void;
  
  // Trade events
  'trade:request': (target_id: string) => void;
  'trade:accept': (trade_id: string) => void;
  'trade:update_offer': (trade_id: string, items: TradeItem[]) => void;
  
  // AI events
  'ai:configure': (ai_config: AIConfiguration) => void;
  'ai:toggle_auto': (enabled: boolean) => void;
}
```

### Server -> Client Events
```typescript
interface ServerEvents {
  // Connection status
  'connected': (session_data: SessionData) => void;
  'disconnected': (reason: string) => void;
  'reconnected': () => void;
  'session_restored': (missed_events: any[]) => void;
  
  // Chat events
  'chat:message_received': (message: ChatMessage) => void;
  'chat:user_joined': (channel_id: string, user: ChatUser) => void;
  'chat:user_left': (channel_id: string, user_id: string) => void;
  'chat:typing_indicator': (channel_id: string, user_id: string, is_typing: boolean) => void;
  
  // Game state updates
  'game:character_updated': (character_data: CharacterUpdate) => void;
  'game:location_changed': (location_data: LocationData) => void;
  'game:inventory_updated': (inventory: InventoryData) => void;
  'game:level_up': (level_data: LevelUpData) => void;
  
  // Combat events
  'combat:started': (combat_data: CombatData) => void;
  'combat:turn_start': (turn_data: TurnData) => void;
  'combat:action_result': (result: ActionResult) => void;
  'combat:ended': (result: CombatResult) => void;
  
  // Party events
  'party:invitation_received': (invite: PartyInvitation) => void;
  'party:member_joined': (member: PartyMember) => void;
  'party:member_left': (member_id: string) => void;
  'party:formation_updated': (formation: FormationData) => void;
  'party:leader_changed': (new_leader_id: string) => void;
  
  // Guild events
  'guild:member_joined': (member: GuildMember) => void;
  'guild:member_left': (member_id: string, reason: string) => void;
  'guild:member_promoted': (member_id: string, new_role: string) => void;
  'guild:announcement': (announcement: GuildAnnouncement) => void;
  'guild:treasury_updated': (treasury: GuildTreasury) => void;
  
  // Notifications
  'notification:system': (notification: SystemNotification) => void;
  'notification:achievement': (achievement: Achievement) => void;
  'notification:quest_completed': (quest: Quest) => void;
  'notification:item_received': (item: Item, source: string) => void;
  
  // Trade events
  'trade:request_received': (trade_request: TradeRequest) => void;
  'trade:offer_updated': (trade_id: string, offer: TradeOffer) => void;
  'trade:completed': (trade_result: TradeResult) => void;
  'trade:cancelled': (trade_id: string, reason: string) => void;
  
  // AI events
  'ai:action_taken': (action: AIAction) => void;
  'ai:status_changed': (status: AIStatus) => void;
  'ai:error': (error: AIError) => void;
  
  // Admin events
  'admin:broadcast': (message: AdminBroadcast) => void;
  'admin:maintenance_warning': (warning: MaintenanceWarning) => void;
  
  // Error events
  'error:rate_limited': (limit_info: RateLimitInfo) => void;
  'error:permission_denied': (action: string) => void;
  'error:invalid_action': (error: ActionError) => void;
}
```

---

## 🛡️ SICUREZZA E RATE LIMITING

### Authentication Middleware
```typescript
class WebSocketAuthMiddleware {
  async authenticate(socket: Socket, next: Function) {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user_id);
      
      if (!user || !user.email_verified) {
        return next(new Error('Invalid or unverified user'));
      }
      
      // Check for active character
      const character_id = socket.handshake.auth.character_id;
      const character = await Character.findById(character_id);
      
      if (!character || character.user_id !== user.id) {
        return next(new Error('Invalid character'));
      }
      
      // Attach user and character to socket
      socket.user = user;
      socket.character = character;
      
      // Check for existing connections (prevent multi-login)
      await this.handleExistingConnections(socket);
      
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  }
  
  async handleExistingConnections(socket: Socket) {
    const existing_connections = await this.getActiveConnections(socket.character.id);
    
    if (existing_connections.length > 0) {
      // Disconnect old connections
      for (const connection of existing_connections) {
        connection.emit('force_disconnect', 'New login detected');
        connection.disconnect(true);
      }
    }
  }
}
```

### Rate Limiting System
```typescript
interface RateLimitConfig {
  // Per-event type limits
  event_limits: Map<string, EventRateLimit>;
  
  // Global limits per connection
  global_limits: {
    messages_per_minute: number;
    actions_per_minute: number;
    max_burst_size: number;
  };
  
  // Escalation thresholds
  escalation: {
    warning_threshold: number;
    temp_restriction_threshold: number;
    disconnect_threshold: number;
  };
}

interface EventRateLimit {
  max_per_minute: number;
  max_per_hour: number;
  burst_allowance: number;
  cooldown_seconds?: number; // for specific actions
}

class WebSocketRateLimiter {
  private limits: Map<string, RateLimit> = new Map();
  
  async checkRateLimit(socket: Socket, event_type: string): Promise<RateLimitResult> {
    const client_id = socket.character.id;
    const limit_key = `${client_id}:${event_type}`;
    
    // Get current rate limit data
    let rate_data = this.limits.get(limit_key);
    if (!rate_data) {
      rate_data = this.createRateLimit(event_type);
      this.limits.set(limit_key, rate_data);
    }
    
    // Check if action is allowed
    const now = Date.now();
    const allowed = this.isActionAllowed(rate_data, now);
    
    if (allowed) {
      // Record the action
      rate_data.requests.push(now);
      
      // Clean old requests
      this.cleanOldRequests(rate_data, now);
      
      return { allowed: true };
    } else {
      // Rate limit exceeded
      await this.handleRateLimitViolation(socket, event_type, rate_data);
      
      return {
        allowed: false,
        retry_after: this.calculateRetryAfter(rate_data, now),
        current_count: rate_data.requests.length
      };
    }
  }
  
  private async handleRateLimitViolation(socket: Socket, event_type: string, rate_data: RateLimit) {
    rate_data.violations++;
    
    // Escalate based on violation count
    if (rate_data.violations >= RATE_LIMIT_CONFIG.escalation.disconnect_threshold) {
      socket.emit('error:rate_limited', {
        action: 'disconnect',
        reason: 'Excessive rate limit violations',
        event_type: event_type
      });
      
      socket.disconnect(true);
      
      // Log for admin review
      await this.logSevereRateLimitViolation(socket, event_type, rate_data);
      
    } else if (rate_data.violations >= RATE_LIMIT_CONFIG.escalation.temp_restriction_threshold) {
      // Temporary restriction
      rate_data.restricted_until = Date.now() + (5 * 60 * 1000); // 5 minutes
      
      socket.emit('error:rate_limited', {
        action: 'temporary_restriction',
        duration_minutes: 5,
        event_type: event_type
      });
      
    } else if (rate_data.violations >= RATE_LIMIT_CONFIG.escalation.warning_threshold) {
      // Warning
      socket.emit('error:rate_limited', {
        action: 'warning',
        message: 'You are sending actions too quickly. Please slow down.',
        event_type: event_type
      });
    }
  }
}

// Rate limit configurations per event type
const RATE_LIMIT_CONFIG: RateLimitConfig = {
  event_limits: new Map([
    ['chat:send_message', { max_per_minute: 20, max_per_hour: 500, burst_allowance: 5 }],
    ['game:combat_action', { max_per_minute: 30, max_per_hour: 1000, burst_allowance: 10 }],
    ['game:move', { max_per_minute: 60, max_per_hour: 2000, burst_allowance: 10 }],
    ['party:invite', { max_per_minute: 5, max_per_hour: 20, burst_allowance: 2, cooldown_seconds: 10 }],
    ['guild:invite_member', { max_per_minute: 3, max_per_hour: 15, burst_allowance: 1, cooldown_seconds: 30 }],
    ['trade:request', { max_per_minute: 5, max_per_hour: 25, burst_allowance: 2, cooldown_seconds: 5 }]
  ]),
  
  global_limits: {
    messages_per_minute: 100,
    actions_per_minute: 150,
    max_burst_size: 20
  },
  
  escalation: {
    warning_threshold: 3,
    temp_restriction_threshold: 6,
    disconnect_threshold: 10
  }
};
```

---

## 📊 MONITORING E METRICS

### Real-Time Metrics Collection
```typescript
class WebSocketMetrics {
  private metrics: MetricsCollector;
  
  // Connection metrics
  async recordConnection(socket: Socket) {
    await this.metrics.increment('websocket.connections.total');
    await this.metrics.gauge('websocket.connections.active', this.getActiveConnectionCount());
    
    await this.metrics.increment('websocket.connections.by_server', {
      server_id: process.env.SERVER_ID
    });
  }
  
  async recordDisconnection(socket: Socket, reason: string) {
    await this.metrics.increment('websocket.disconnections.total');
    await this.metrics.increment('websocket.disconnections.by_reason', {
      reason: reason
    });
    
    await this.metrics.gauge('websocket.connections.active', this.getActiveConnectionCount());
  }
  
  // Event metrics
  async recordEvent(event_type: string, processing_time: number, success: boolean) {
    await this.metrics.increment('websocket.events.total', {
      event_type: event_type,
      success: success.toString()
    });
    
    await this.metrics.histogram('websocket.events.processing_time', processing_time, {
      event_type: event_type
    });
  }
  
  // Performance metrics
  async recordLatency(socket: Socket, latency: number) {
    await this.metrics.histogram('websocket.latency', latency, {
      server_id: process.env.SERVER_ID,
      client_region: this.getClientRegion(socket)
    });
  }
  
  // Error metrics
  async recordError(error_type: string, event_type?: string) {
    await this.metrics.increment('websocket.errors.total', {
      error_type: error_type,
      event_type: event_type || 'unknown'
    });
  }
  
  // Rate limiting metrics
  async recordRateLimitViolation(event_type: string, severity: string) {
    await this.metrics.increment('websocket.rate_limit_violations.total', {
      event_type: event_type,
      severity: severity
    });
  }
}
```

### Health Monitoring
```typescript
class WebSocketHealthMonitor {
  private health_status: HealthStatus = HealthStatus.HEALTHY;
  private last_health_check: Date = new Date();
  
  async performHealthCheck(): Promise<HealthCheckResult> {
    const checks = await Promise.allSettled([
      this.checkRedisConnection(),
      this.checkDatabaseConnection(),
      this.checkMemoryUsage(),
      this.checkActiveConnections(),
      this.checkEventProcessingRate()
    ]);
    
    const failed_checks = checks
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ index }) => this.getCheckName(index));
    
    const health_status = failed_checks.length === 0 ? 
      HealthStatus.HEALTHY : 
      failed_checks.length <= 2 ? HealthStatus.DEGRADED : HealthStatus.UNHEALTHY;
    
    this.health_status = health_status;
    this.last_health_check = new Date();
    
    return {
      status: health_status,
      timestamp: this.last_health_check,
      failed_checks: failed_checks,
      metrics: await this.getHealthMetrics()
    };
  }
  
  private async checkActiveConnections(): Promise<void> {
    const active_connections = this.getActiveConnectionCount();
    const max_connections = parseInt(process.env.MAX_WEBSOCKET_CONNECTIONS || '10000');
    
    if (active_connections > max_connections * 0.9) {
      throw new Error(`High connection count: ${active_connections}/${max_connections}`);
    }
  }
  
  private async checkEventProcessingRate(): Promise<void> {
    const recent_events = await this.metrics.getRecentEventCount(60); // last minute
    const max_events_per_minute = 50000;
    
    if (recent_events > max_events_per_minute) {
      throw new Error(`High event processing rate: ${recent_events}/min`);
    }
  }
}

enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy'
}
```

---

## 🚀 DEPLOYMENT E SCALING

### Multi-Server Setup
```typescript
// Environment-specific configuration
const WEBSOCKET_CONFIG = {
  development: {
    max_connections_per_server: 100,
    redis_url: 'redis://localhost:6379',
    cors_origins: ['http://localhost:3000'],
    log_level: 'debug'
  },
  
  staging: {
    max_connections_per_server: 1000,
    redis_url: process.env.REDIS_URL,
    cors_origins: [process.env.FRONTEND_URL],
    log_level: 'info'
  },
  
  production: {
    max_connections_per_server: 5000,
    redis_url: process.env.REDIS_URL,
    cors_origins: [process.env.FRONTEND_URL],
    log_level: 'warn',
    enable_compression: true,
    enable_sticky_sessions: true
  }
};

// Load balancer configuration for Socket.IO
const LOAD_BALANCER_CONFIG = {
  // Sticky sessions by user ID to maintain connection affinity
  sticky_session_key: 'character_id',
  
  // Health check endpoint for load balancer
  health_check_path: '/health/websocket',
  
  // Graceful shutdown handling
  shutdown_timeout_seconds: 30,
  
  // Auto-scaling triggers
  scale_up_threshold: 0.8, // 80% connection capacity
  scale_down_threshold: 0.3, // 30% connection capacity
  min_instances: 2,
  max_instances: 10
};
```

### Docker Configuration
```dockerfile
# WebSocket server Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health/websocket || exit 1

# Expose WebSocket port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rpg-websocket
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rpg-websocket
  template:
    metadata:
      labels:
        app: rpg-websocket
    spec:
      containers:
      - name: websocket-server
        image: rpg-websocket:latest
        ports:
        - containerPort: 3001
        env:
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: MAX_WEBSOCKET_CONNECTIONS
          value: "5000"
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/websocket
            port: 3001
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health/websocket
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: rpg-websocket-service
spec:
  selector:
    app: rpg-websocket
  ports:
  - port: 3001
    targetPort: 3001
  sessionAffinity: ClientIP # Sticky sessions for WebSocket
```

---

## 🧪 TESTING STRATEGY

### Unit Tests
```typescript
describe('WebSocket Event Handling', () => {
  let server: SocketIOServer;
  let client: Socket;
  
  beforeEach(async () => {
    server = await createTestServer();
    client = await createTestClient();
  });
  
  test('should authenticate user on connection', async () => {
    const auth_token = generateTestToken();
    
    await client.emit('authenticate', auth_token);
    
    expect(client.character).toBeDefined();
    expect(client.user).toBeDefined();
  });
  
  test('should join appropriate rooms on authentication', async () => {
    const character = await createTestCharacter();
    await client.authenticate(character);
    
    const rooms = Array.from(client.rooms);
    expect(rooms).toContain(`chat:global`);
    expect(rooms).toContain(`location:${character.current_location_id}`);
  });
  
  test('should handle rate limiting correctly', async () => {
    // Send messages rapidly to trigger rate limit
    for (let i = 0; i < 25; i++) {
      await client.emit('chat:send_message', { content: `Message ${i}` });
    }
    
    // Should receive rate limit error
    const error = await client.waitFor('error:rate_limited');
    expect(error.action).toBe('warning');
  });
});
```

### Integration Tests
```typescript
describe('WebSocket Integration', () => {
  test('should sync across multiple server instances', async () => {
    const server1 = await createTestServer(3001);
    const server2 = await createTestServer(3002);
    
    const client1 = await createTestClient(3001);
    const client2 = await createTestClient(3002);
    
    // Client 1 sends message
    await client1.emit('chat:send_message', { 
      channel_id: 'global',
      content: 'Hello from server 1' 
    });
    
    // Client 2 should receive message via Redis
    const received_message = await client2.waitFor('chat:message_received');
    expect(received_message.content).toBe('Hello from server 1');
  });
});
```

### Load Tests
```typescript
// Load testing with Artillery.io configuration
const LOAD_TEST_CONFIG = {
  target: 'ws://localhost:3001',
  phases: [
    { duration: 60, arrivalRate: 10 }, // Ramp up
    { duration: 300, arrivalRate: 50 }, // Sustained load
    { duration: 60, arrivalRate: 100 } // Peak load
  ],
  
  scenarios: [
    {
      name: 'Connect and chat',
      weight: 70,
      engine: 'ws',
      flow: [
        { emit: 'authenticate', data: '{{ token }}' },
        { think: 2 },
        { loop: [
          { emit: 'chat:send_message', data: { content: 'Test message' } },
          { think: 5 }
        ], count: 10 }
      ]
    },
    
    {
      name: 'Combat simulation',
      weight: 30,
      engine: 'ws',
      flow: [
        { emit: 'authenticate', data: '{{ token }}' },
        { emit: 'game:move', data: 'combat_area_1' },
        { loop: [
          { emit: 'game:combat_action', data: { action: 'attack', target: 'test_enemy' } },
          { think: 3 }
        ], count: 5 }
      ]
    }
  ]
};
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Connection Optimization
- **Connection Pooling**: Riuso connessioni database
- **Memory Management**: Cleanup automatico connessioni inattive
- **Compression**: Gzip per messaggi > 1KB
- **Binary Protocol**: Protocol Buffer per eventi high-frequency
- **Lazy Loading**: Caricamento dati on-demand

### Redis Optimization
- **Connection Multiplexing**: Riuso connessioni Redis
- **Pipelining**: Batch Redis operations
- **Partitioning**: Sharding per user/guild data
- **TTL Management**: Automatic cleanup expired data
- **Memory Monitoring**: Alerts per usage limits

---

**Priorità Implementazione**: CRITICA per Week 1  
**Dipendenze**: Redis setup, JWT authentication  
**Ready for Development**: ✅ Completamente specificato

Questi 3 sistemi (Chat, Guild, WebSocket) formano il backbone dell'infrastruttura real-time del tuo MMO. Il WebSocket è la fondazione su cui Chat e Guild comunicano, mentre tutti e tre si integrano strettamente con i sistemi di gioco esistenti.
