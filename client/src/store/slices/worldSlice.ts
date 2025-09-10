import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { WorldState, Location, Region, LocationConnection } from '../../types';

// API functions
const worldAPI = {
  getWorldData: async (): Promise<{
    locations: Location[];
    regions: Region[];
    connections: LocationConnection[];
  }> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/world', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch world data');
    }
    
    return response.json();
  },

  travelToLocation: async (locationId: string): Promise<Location> => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/world/travel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ locationId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to travel');
    }
    
    const data = await response.json();
    return data.location;
  },
};

// Async thunks
export const fetchWorldData = createAsyncThunk(
  'world/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      return await worldAPI.getWorldData();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch world data');
    }
  }
);

export const travelToLocation = createAsyncThunk(
  'world/travel',
  async (locationId: string, { rejectWithValue }) => {
    try {
      return await worldAPI.travelToLocation(locationId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to travel');
    }
  }
);

// Initial state
const initialState: WorldState = {
  currentLocation: null,
  locations: [],
  regions: [],
  connections: [],
  mapData: {
    zoom: 1,
    centerX: 16,
    centerY: 16,
  },
  loading: false,
  error: null,
};

// Slice
const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setMapZoom: (state, action: PayloadAction<1 | 4 | 16 | 64>) => {
      state.mapData.zoom = action.payload;
    },
    setMapCenter: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.mapData.centerX = action.payload.x;
      state.mapData.centerY = action.payload.y;
    },
    updateLocationPlayerCount: (state, action: PayloadAction<{ locationId: string; count: number }>) => {
      const location = state.locations.find(l => l.id === action.payload.locationId);
      if (location) {
        location.playerCount = action.payload.count;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch world data
    builder
      .addCase(fetchWorldData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorldData.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.locations;
        state.regions = action.payload.regions;
        state.connections = action.payload.connections;
        state.error = null;
      })
      .addCase(fetchWorldData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Travel to location
    builder
      .addCase(travelToLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(travelToLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
        state.error = null;
      })
      .addCase(travelToLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setMapZoom, setMapCenter, updateLocationPlayerCount } = worldSlice.actions;
export default worldSlice.reducer;
