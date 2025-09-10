import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { GuildState, Guild, GuildMember } from '../../types';

// API functions
const guildAPI = {
  getCurrentGuild: async (): Promise<Guild | null> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/guilds/current', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.status === 404) {
      return null; // No guild
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch current guild');
    }
    
    const data = await response.json();
    return data.guild;
  },

  getAvailableGuilds: async (): Promise<Guild[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/guilds/available', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch available guilds');
    }
    
    const data = await response.json();
    return data.guilds;
  },

  createGuild: async (guildData: {
    name: string;
    tag: string;
    description: string;
    isPublic: boolean;
  }): Promise<Guild> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/guilds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(guildData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create guild');
    }
    
    const data = await response.json();
    return data.guild;
  },

  joinGuild: async (guildId: string): Promise<Guild> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/guilds/${guildId}/join`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join guild');
    }
    
    const data = await response.json();
    return data.guild;
  },

  leaveGuild: async (): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/guilds/leave', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to leave guild');
    }
  },
};

// Async thunks
export const fetchCurrentGuild = createAsyncThunk(
  'guild/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      return await guildAPI.getCurrentGuild();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch current guild');
    }
  }
);

export const fetchAvailableGuilds = createAsyncThunk(
  'guild/fetchAvailable',
  async (_, { rejectWithValue }) => {
    try {
      return await guildAPI.getAvailableGuilds();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch available guilds');
    }
  }
);

export const createGuild = createAsyncThunk(
  'guild/create',
  async (
    guildData: {
      name: string;
      tag: string;
      description: string;
      isPublic: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      return await guildAPI.createGuild(guildData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create guild');
    }
  }
);

export const joinGuild = createAsyncThunk(
  'guild/join',
  async (guildId: string, { rejectWithValue }) => {
    try {
      return await guildAPI.joinGuild(guildId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to join guild');
    }
  }
);

export const leaveGuild = createAsyncThunk(
  'guild/leave',
  async (_, { rejectWithValue }) => {
    try {
      await guildAPI.leaveGuild();
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to leave guild');
    }
  }
);

// Initial state
const initialState: GuildState = {
  currentGuild: null,
  availableGuilds: [],
  guildMembers: [],
  applications: [],
  loading: false,
  error: null,
};

// Slice
const guildSlice = createSlice({
  name: 'guild',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    updateGuildInfo: (state, action: PayloadAction<Partial<Guild>>) => {
      if (state.currentGuild) {
        state.currentGuild = { ...state.currentGuild, ...action.payload };
      }
    },

    updateMemberList: (state, action: PayloadAction<GuildMember[]>) => {
      state.guildMembers = action.payload;
      
      // Update member count in current guild
      if (state.currentGuild) {
        state.currentGuild.memberCount = action.payload.length;
      }
    },

    addMember: (state, action: PayloadAction<GuildMember>) => {
      state.guildMembers.push(action.payload);
      
      // Update member count
      if (state.currentGuild) {
        state.currentGuild.memberCount = state.guildMembers.length;
      }
    },

    removeMember: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.guildMembers = state.guildMembers.filter(m => m.userId !== userId);
      
      // Update member count
      if (state.currentGuild) {
        state.currentGuild.memberCount = state.guildMembers.length;
      }
    },

    updateMemberRank: (state, action: PayloadAction<{ userId: string; rank: GuildMember['rank'] }>) => {
      const { userId, rank } = action.payload;
      const member = state.guildMembers.find(m => m.userId === userId);
      
      if (member) {
        member.rank = rank;
      }
    },

    clearGuildData: (state) => {
      state.currentGuild = null;
      state.guildMembers = [];
      state.applications = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch current guild
    builder
      .addCase(fetchCurrentGuild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentGuild.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGuild = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentGuild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch available guilds
    builder
      .addCase(fetchAvailableGuilds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableGuilds.fulfilled, (state, action) => {
        state.loading = false;
        state.availableGuilds = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableGuilds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create guild
    builder
      .addCase(createGuild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuild.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGuild = action.payload;
        state.error = null;
      })
      .addCase(createGuild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Join guild
    builder
      .addCase(joinGuild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinGuild.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGuild = action.payload;
        state.error = null;
      })
      .addCase(joinGuild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Leave guild
    builder
      .addCase(leaveGuild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveGuild.fulfilled, (state) => {
        state.loading = false;
        state.currentGuild = null;
        state.guildMembers = [];
        state.applications = [];
        state.error = null;
      })
      .addCase(leaveGuild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  updateGuildInfo,
  updateMemberList,
  addMember,
  removeMember,
  updateMemberRank,
  clearGuildData,
} = guildSlice.actions;

export default guildSlice.reducer;
