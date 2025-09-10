import { io, Socket } from 'socket.io-client';
import type { ChatMessage, GameEvent } from '../types';

export class GameSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  // Event handlers
  private eventHandlers: Map<string, Set<(...args: any[]) => void>> = new Map();

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      // Create socket connection
      this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3000', {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
      });

      // Connection success
      this.socket.on('connect', () => {
        console.log('🔌 WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connection_status', true);
        resolve();
      });

      // Connection error
      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        this.emit('connection_status', false);
        
        if (this.reconnectAttempts === 0) {
          reject(new Error('Failed to connect to game server'));
        }
      });

      // Disconnection
      this.socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        this.emit('connection_status', false);
        
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, don't reconnect
          return;
        }
        
        // Attempt reconnection
        this.attemptReconnect(token);
      });

      // Setup event listeners
      this.setupEventListeners();
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.eventHandlers.clear();
    this.reconnectAttempts = 0;
  }

  private attemptReconnect(token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.emit('connection_error', 'Connection lost and could not be restored');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s

    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect(token).catch(() => {
        // Connection failed, will try again
      });
    }, delay);
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Chat events
    this.socket.on('chat:message', (message: ChatMessage) => {
      this.emit('chat:message', message);
    });

    this.socket.on('chat:channel_update', (channel) => {
      this.emit('chat:channel_update', channel);
    });

    // Character events
    this.socket.on('character:stats_update', (data) => {
      this.emit('character:stats_update', data);
    });

    this.socket.on('character:level_up', (data) => {
      this.emit('character:level_up', data);
    });

    // World events
    this.socket.on('world:location_change', (location) => {
      this.emit('world:location_change', location);
    });

    this.socket.on('world:player_count_update', (data) => {
      this.emit('world:player_count_update', data);
    });

    // Quest events
    this.socket.on('quest:progress_update', (data) => {
      this.emit('quest:progress_update', data);
    });

    this.socket.on('quest:completed', (quest) => {
      this.emit('quest:completed', quest);
    });

    // Guild events
    this.socket.on('guild:member_joined', (member) => {
      this.emit('guild:member_joined', member);
    });

    this.socket.on('guild:member_left', (userId) => {
      this.emit('guild:member_left', userId);
    });

    this.socket.on('guild:update', (guild) => {
      this.emit('guild:update', guild);
    });

    // Game events
    this.socket.on('game:notification', (notification) => {
      this.emit('game:notification', notification);
    });
  }

  // ====================
  // CHAT METHODS
  // ====================

  sendMessage(channelId: string, content: string, type: ChatMessage['type'] = 'text'): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to game server');
    }

    this.socket.emit('chat:send_message', {
      channelId,
      content,
      type,
    });
  }

  joinChatChannel(channelId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit('chat:join_channel', { channelId });
  }

  leaveChatChannel(channelId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit('chat:leave_channel', { channelId });
  }

  // ====================
  // WORLD METHODS
  // ====================

  requestTravel(locationId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to game server');
    }

    this.socket.emit('world:travel_request', { locationId });
  }

  updateLocation(locationId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit('world:location_update', { locationId });
  }

  // ====================
  // CHARACTER METHODS
  // ====================

  requestCharacterUpdate(): void {
    if (!this.socket?.connected) return;

    this.socket.emit('character:request_update');
  }

  // ====================
  // QUEST METHODS
  // ====================

  updateQuestProgress(questId: string, objectiveId: string, progress: number): void {
    if (!this.socket?.connected) return;

    this.socket.emit('quest:update_progress', {
      questId,
      objectiveId,
      progress,
    });
  }

  // ====================
  // EVENT SYSTEM
  // ====================

  on(event: string, handler: (...args: any[]) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // ====================
  // UTILITY METHODS
  // ====================

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionId(): string | null {
    return this.socket?.id || null;
  }
}

// Singleton instance
export const gameSocket = new GameSocketService();
