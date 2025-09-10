import type { ApiResponse } from '../types';

// Base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use the default error message
      }
      
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      // If no JSON content, return empty object
      return {} as T;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// ====================
// API SERVICE FUNCTIONS
// ====================

export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiClient.post('/api/auth/login', credentials),

  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) =>
    apiClient.post('/api/auth/register', userData),

  logout: () =>
    apiClient.post('/api/auth/logout'),

  verify: () =>
    apiClient.get('/api/auth/verify'),
};

export const characterAPI = {
  getCharacters: () =>
    apiClient.get('/api/characters'),

  getClasses: () =>
    apiClient.get('/api/characters/classes'),

  createCharacter: (data: {
    name: string;
    classId: string;
    stats: { [key: string]: number };
  }) =>
    apiClient.post('/api/characters', data),

  selectCharacter: (characterId: string) =>
    apiClient.post(`/api/characters/${characterId}/select`),

  deleteCharacter: (characterId: string) =>
    apiClient.delete(`/api/characters/${characterId}`),
};

export const worldAPI = {
  getWorldData: () =>
    apiClient.get('/api/world'),

  getLocation: (locationId: string) =>
    apiClient.get(`/api/world/locations/${locationId}`),

  travel: (locationId: string) =>
    apiClient.post('/api/world/travel', { locationId }),
};

export const chatAPI = {
  getChannels: () =>
    apiClient.get('/api/chat/channels'),

  getMessages: (channelId: string, page = 1, limit = 50) =>
    apiClient.get(`/api/chat/channels/${channelId}/messages?page=${page}&limit=${limit}`),

  sendMessage: (channelId: string, content: string, type = 'text') =>
    apiClient.post(`/api/chat/channels/${channelId}/messages`, { content, type }),
};

export const questAPI = {
  getAvailableQuests: () =>
    apiClient.get('/api/quests/available'),

  getActiveQuests: () =>
    apiClient.get('/api/quests/active'),

  getCompletedQuests: () =>
    apiClient.get('/api/quests/completed'),

  acceptQuest: (questId: string) =>
    apiClient.post(`/api/quests/${questId}/accept`),

  abandonQuest: (questId: string) =>
    apiClient.post(`/api/quests/${questId}/abandon`),

  completeQuest: (questId: string) =>
    apiClient.post(`/api/quests/${questId}/complete`),
};

export const guildAPI = {
  getCurrentGuild: () =>
    apiClient.get('/api/guilds/current'),

  getAvailableGuilds: () =>
    apiClient.get('/api/guilds/available'),

  createGuild: (data: {
    name: string;
    tag: string;
    description: string;
    isPublic: boolean;
  }) =>
    apiClient.post('/api/guilds', data),

  joinGuild: (guildId: string) =>
    apiClient.post(`/api/guilds/${guildId}/join`),

  leaveGuild: () =>
    apiClient.post('/api/guilds/leave'),

  getMembers: (guildId: string) =>
    apiClient.get(`/api/guilds/${guildId}/members`),

  inviteMember: (username: string) =>
    apiClient.post('/api/guilds/invite', { username }),

  kickMember: (userId: string) =>
    apiClient.post('/api/guilds/kick', { userId }),

  promoteMember: (userId: string, rank: string) =>
    apiClient.post('/api/guilds/promote', { userId, rank }),
};

// ====================
// UTILITY FUNCTIONS
// ====================

export const uploadFile = async (file: File, endpoint: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  return response.json();
};

export const downloadFile = async (endpoint: string): Promise<Blob> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('File download failed');
  }

  return response.blob();
};

// Error handling helper
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};
