import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UIState, Notification } from '../../types';

// Initial state
const initialState: UIState = {
  sidebarCollapsed: false,
  chatCollapsed: false,
  activePanel: null,
  notifications: [],
  isLoading: false,
  modalStack: [],
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar management
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    // Chat management
    toggleChat: (state) => {
      state.chatCollapsed = !state.chatCollapsed;
    },

    setChatCollapsed: (state, action: PayloadAction<boolean>) => {
      state.chatCollapsed = action.payload;
    },

    // Panel management
    setActivePanel: (state, action: PayloadAction<UIState['activePanel']>) => {
      state.activePanel = action.payload;
    },

    togglePanel: (state, action: PayloadAction<UIState['activePanel']>) => {
      if (state.activePanel === action.payload) {
        state.activePanel = null;
      } else {
        state.activePanel = action.payload;
      }
    },

    // Notification management
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };

      state.notifications.unshift(notification);

      // Keep only the last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Loading management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Modal management
    openModal: (state, action: PayloadAction<string>) => {
      if (!state.modalStack.includes(action.payload)) {
        state.modalStack.push(action.payload);
      }
    },

    closeModal: (state, action: PayloadAction<string>) => {
      state.modalStack = state.modalStack.filter(modal => modal !== action.payload);
    },

    closeTopModal: (state) => {
      state.modalStack.pop();
    },

    closeAllModals: (state) => {
      state.modalStack = [];
    },

    // Responsive layout helpers
    updateLayoutForBreakpoint: (state, action: PayloadAction<'mobile' | 'tablet' | 'desktop'>) => {
      const breakpoint = action.payload;

      switch (breakpoint) {
        case 'mobile':
          state.sidebarCollapsed = true;
          state.chatCollapsed = true;
          break;
        case 'tablet':
          state.sidebarCollapsed = false;
          state.chatCollapsed = false;
          break;
        case 'desktop':
          state.sidebarCollapsed = false;
          state.chatCollapsed = false;
          break;
      }
    },

    // Reset UI state (useful for logout)
    resetUIState: (state) => {
      state.activePanel = null;
      state.notifications = [];
      state.isLoading = false;
      state.modalStack = [];
    },
  },
});

// Notification helper actions
export const showSuccessNotification = (message: string, title = 'Success') => 
  uiSlice.actions.addNotification({
    type: 'success',
    title,
    message,
    duration: 5000,
  });

export const showErrorNotification = (message: string, title = 'Error') =>
  uiSlice.actions.addNotification({
    type: 'error',
    title,
    message,
    duration: 7000,
  });

export const showWarningNotification = (message: string, title = 'Warning') =>
  uiSlice.actions.addNotification({
    type: 'warning',
    title,
    message,
    duration: 6000,
  });

export const showInfoNotification = (message: string, title = 'Info') =>
  uiSlice.actions.addNotification({
    type: 'info',
    title,
    message,
    duration: 4000,
  });

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleChat,
  setChatCollapsed,
  setActivePanel,
  togglePanel,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  openModal,
  closeModal,
  closeTopModal,
  closeAllModals,
  updateLayoutForBreakpoint,
  resetUIState,
} = uiSlice.actions;

export default uiSlice.reducer;
