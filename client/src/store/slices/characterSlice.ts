import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CharacterState, Character, CharacterClass } from '../../types';

// API functions
const characterAPI = {
  getCharacters: async (): Promise<Character[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/characters', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch characters');
    }
    
    const data = await response.json();
    return data.characters;
  },

  getCharacterClasses: async (): Promise<CharacterClass[]> => {
    const response = await fetch('/api/characters/classes');
    
    if (!response.ok) {
      throw new Error('Failed to fetch character classes');
    }
    
    const data = await response.json();
    return data.classes;
  },

  createCharacter: async (characterData: {
    name: string;
    classId: string;
    stats: { [key: string]: number };
  }): Promise<Character> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(characterData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create character');
    }
    
    const data = await response.json();
    return data.character;
  },

  deleteCharacter: async (characterId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/characters/${characterId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete character');
    }
  },

  selectCharacter: async (characterId: string): Promise<Character> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/characters/${characterId}/select`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to select character');
    }
    
    const data = await response.json();
    return data.character;
  },
};

// Async thunks
export const fetchCharacters = createAsyncThunk(
  'character/fetchCharacters',
  async (_, { rejectWithValue }) => {
    try {
      return await characterAPI.getCharacters();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch characters');
    }
  }
);

export const fetchCharacterClasses = createAsyncThunk(
  'character/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      return await characterAPI.getCharacterClasses();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch classes');
    }
  }
);

export const createCharacter = createAsyncThunk(
  'character/create',
  async (
    characterData: {
      name: string;
      classId: string;
      stats: { [key: string]: number };
    },
    { rejectWithValue }
  ) => {
    try {
      return await characterAPI.createCharacter(characterData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create character');
    }
  }
);

export const deleteCharacter = createAsyncThunk(
  'character/delete',
  async (characterId: string, { rejectWithValue }) => {
    try {
      await characterAPI.deleteCharacter(characterId);
      return characterId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete character');
    }
  }
);

export const selectCharacter = createAsyncThunk(
  'character/select',
  async (characterId: string, { rejectWithValue }) => {
    try {
      return await characterAPI.selectCharacter(characterId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to select character');
    }
  }
);

// Initial state
const initialState: CharacterState = {
  characters: [],
  activeCharacter: null,
  classes: [],
  loading: false,
  error: null,
};

// Slice
const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateCharacterStats: (state, action: PayloadAction<{ characterId: string; stats: Partial<Character> }>) => {
      const { characterId, stats } = action.payload;
      
      // Update in characters array
      const characterIndex = state.characters.findIndex(c => c.id === characterId);
      if (characterIndex !== -1) {
        state.characters[characterIndex] = { ...state.characters[characterIndex], ...stats };
      }
      
      // Update active character if it matches
      if (state.activeCharacter?.id === characterId) {
        state.activeCharacter = { ...state.activeCharacter, ...stats };
      }
    },
    clearActiveCharacter: (state) => {
      state.activeCharacter = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch characters
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = action.payload;
        state.error = null;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch character classes
    builder
      .addCase(fetchCharacterClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacterClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
        state.error = null;
      })
      .addCase(fetchCharacterClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create character
    builder
      .addCase(createCharacter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.loading = false;
        state.characters.push(action.payload);
        state.error = null;
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete character
    builder
      .addCase(deleteCharacter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCharacter.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = state.characters.filter(c => c.id !== action.payload);
        
        // Clear active character if it was deleted
        if (state.activeCharacter?.id === action.payload) {
          state.activeCharacter = null;
        }
        
        state.error = null;
      })
      .addCase(deleteCharacter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Select character
    builder
      .addCase(selectCharacter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectCharacter.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCharacter = action.payload;
        state.error = null;
      })
      .addCase(selectCharacter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateCharacterStats, clearActiveCharacter } = characterSlice.actions;
export default characterSlice.reducer;
