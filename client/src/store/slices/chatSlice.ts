import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, ChatMessage, ChatChannel } from '../../types';

// Initial state
const initialState: ChatState = {
  channels: [],
  activeChannelId: null,
  messages: {},
  isConnected: false,
  loading: false,
  error: null,
};

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Connection management
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    // Channel management
    setChannels: (state, action: PayloadAction<ChatChannel[]>) => {
      state.channels = action.payload;
    },

    addChannel: (state, action: PayloadAction<ChatChannel>) => {
      const existingIndex = state.channels.findIndex(c => c.id === action.payload.id);
      if (existingIndex !== -1) {
        state.channels[existingIndex] = action.payload;
      } else {
        state.channels.push(action.payload);
      }
    },

    removeChannel: (state, action: PayloadAction<string>) => {
      state.channels = state.channels.filter(c => c.id !== action.payload);
      delete state.messages[action.payload];
      
      if (state.activeChannelId === action.payload) {
        state.activeChannelId = state.channels.length > 0 ? state.channels[0].id : null;
      }
    },

    setActiveChannel: (state, action: PayloadAction<string>) => {
      state.activeChannelId = action.payload;
      
      // Mark all messages in this channel as read
      const channel = state.channels.find(c => c.id === action.payload);
      if (channel) {
        channel.unreadCount = 0;
      }
    },

    // Message management
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload;
      const channelId = message.channelId;
      
      // Initialize messages array if it doesn't exist
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      
      // Add message to the channel
      state.messages[channelId].push(message);
      
      // Update unread count if not the active channel
      if (state.activeChannelId !== channelId) {
        const channel = state.channels.find(c => c.id === channelId);
        if (channel) {
          channel.unreadCount = (channel.unreadCount || 0) + 1;
          channel.lastMessage = message;
        }
      }
      
      // Keep only the last 100 messages per channel for performance
      if (state.messages[channelId].length > 100) {
        state.messages[channelId] = state.messages[channelId].slice(-100);
      }
    },

    setMessages: (state, action: PayloadAction<{ channelId: string; messages: ChatMessage[] }>) => {
      const { channelId, messages } = action.payload;
      state.messages[channelId] = messages;
    },

    markMessagesAsRead: (state, action: PayloadAction<string>) => {
      const channelId = action.payload;
      const channel = state.channels.find(c => c.id === channelId);
      
      if (channel) {
        channel.unreadCount = 0;
      }
      
      // Mark all messages in this channel as read
      if (state.messages[channelId]) {
        state.messages[channelId].forEach(message => {
          message.isRead = true;
        });
      }
    },

    // Error management
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Clear all data (for logout)
    clearChatData: (state) => {
      state.channels = [];
      state.activeChannelId = null;
      state.messages = {};
      state.isConnected = false;
      state.error = null;
    },
  },
});

export const {
  setConnectionStatus,
  setChannels,
  addChannel,
  removeChannel,
  setActiveChannel,
  addMessage,
  setMessages,
  markMessagesAsRead,
  setError,
  clearError,
  setLoading,
  clearChatData,
} = chatSlice.actions;

export default chatSlice.reducer;
