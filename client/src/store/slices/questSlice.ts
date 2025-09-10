import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { QuestState, Quest } from '../../types';

// API functions
const questAPI = {
  getAvailableQuests: async (): Promise<Quest[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/quests/available', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch available quests');
    }
    
    const data = await response.json();
    return data.quests;
  },

  getActiveQuests: async (): Promise<Quest[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/quests/active', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch active quests');
    }
    
    const data = await response.json();
    return data.quests;
  },

  acceptQuest: async (questId: string): Promise<Quest> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/quests/${questId}/accept`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to accept quest');
    }
    
    const data = await response.json();
    return data.quest;
  },

  abandonQuest: async (questId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/quests/${questId}/abandon`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to abandon quest');
    }
  },
};

// Async thunks
export const fetchAvailableQuests = createAsyncThunk(
  'quest/fetchAvailable',
  async (_, { rejectWithValue }) => {
    try {
      return await questAPI.getAvailableQuests();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch available quests');
    }
  }
);

export const fetchActiveQuests = createAsyncThunk(
  'quest/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      return await questAPI.getActiveQuests();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch active quests');
    }
  }
);

export const acceptQuest = createAsyncThunk(
  'quest/accept',
  async (questId: string, { rejectWithValue }) => {
    try {
      return await questAPI.acceptQuest(questId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to accept quest');
    }
  }
);

export const abandonQuest = createAsyncThunk(
  'quest/abandon',
  async (questId: string, { rejectWithValue }) => {
    try {
      await questAPI.abandonQuest(questId);
      return questId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to abandon quest');
    }
  }
);

// Initial state
const initialState: QuestState = {
  availableQuests: [],
  activeQuests: [],
  completedQuests: [],
  trackedQuestIds: [],
  loading: false,
  error: null,
};

// Slice
const questSlice = createSlice({
  name: 'quest',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    toggleQuestTracking: (state, action: PayloadAction<string>) => {
      const questId = action.payload;
      
      if (state.trackedQuestIds.includes(questId)) {
        state.trackedQuestIds = state.trackedQuestIds.filter(id => id !== questId);
      } else {
        // Limit to maximum 5 tracked quests
        if (state.trackedQuestIds.length >= 5) {
          state.trackedQuestIds = state.trackedQuestIds.slice(1);
        }
        state.trackedQuestIds.push(questId);
      }
      
      // Update the quest's tracked status
      const updateQuestTracking = (quest: Quest) => {
        if (quest.id === questId) {
          quest.isTracked = !quest.isTracked;
        }
      };
      
      state.availableQuests.forEach(updateQuestTracking);
      state.activeQuests.forEach(updateQuestTracking);
    },

    updateQuestProgress: (state, action: PayloadAction<{
      questId: string;
      objectiveId: string;
      progress: number;
    }>) => {
      const { questId, objectiveId, progress } = action.payload;
      
      const quest = state.activeQuests.find(q => q.id === questId);
      if (quest) {
        const objective = quest.objectives.find(obj => obj.id === objectiveId);
        if (objective) {
          objective.current = progress;
          objective.isCompleted = objective.current >= objective.required;
        }
      }
    },

    completeQuest: (state, action: PayloadAction<string>) => {
      const questId = action.payload;
      const questIndex = state.activeQuests.findIndex(q => q.id === questId);
      
      if (questIndex !== -1) {
        const quest = state.activeQuests[questIndex];
        quest.status = 'completed';
        quest.completedAt = new Date().toISOString();
        
        // Move from active to completed
        state.completedQuests.push(quest);
        state.activeQuests.splice(questIndex, 1);
        
        // Remove from tracking
        state.trackedQuestIds = state.trackedQuestIds.filter(id => id !== questId);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch available quests
    builder
      .addCase(fetchAvailableQuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.availableQuests = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableQuests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch active quests
    builder
      .addCase(fetchActiveQuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.activeQuests = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveQuests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Accept quest
    builder
      .addCase(acceptQuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptQuest.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove from available and add to active
        const questId = action.payload.id;
        state.availableQuests = state.availableQuests.filter(q => q.id !== questId);
        state.activeQuests.push(action.payload);
        
        state.error = null;
      })
      .addCase(acceptQuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Abandon quest
    builder
      .addCase(abandonQuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(abandonQuest.fulfilled, (state, action) => {
        state.loading = false;
        
        const questId = action.payload;
        
        // Remove from active quests
        state.activeQuests = state.activeQuests.filter(q => q.id !== questId);
        
        // Remove from tracking
        state.trackedQuestIds = state.trackedQuestIds.filter(id => id !== questId);
        
        state.error = null;
      })
      .addCase(abandonQuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  toggleQuestTracking, 
  updateQuestProgress, 
  completeQuest 
} = questSlice.actions;

export default questSlice.reducer;
