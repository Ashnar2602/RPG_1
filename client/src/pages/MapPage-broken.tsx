import React, { useState, useEffect } from 'react';

// World hierarchy types based on our 4-tier system
interface WorldLocation {
  id: string;
  name: string;
  description: string | null;
  tier: 'CONTINENT' | 'REGION' | 'CITY' | 'LOCATION';
  parentId?: string | null;
  isAccessible: boolean;
  isKnown: boolean;
  isDiscovered: boolean;
  coordinatesX: number;
  coordinatesY: number;
  coordinatesZ: number;
  specialFeatures?: string[];
  population?: number | null;
  requirements?: any;
  children?: WorldLocation[];
}

interface Character {
  id: number;
  name: string;
  currentLocationId?: string;
  level: number;
  knownLocations: string[];
}

interface MapViewState {
  currentZoom: 'world' | 'continent' | 'region' | 'city';
  focusedLocationId?: string;
  selectedLocationId?: string;
}

interface MapPageProps {}

export const MapPage: React.FC<MapPageProps> = () => {
  const [worldData, setWorldData] = useState<WorldLocation[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [mapView, setMapView] = useState<MapViewState>({
    currentZoom: 'world',
    focusedLocationId: undefined,
    selectedLocationId: undefined
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize world data from API
  useEffect(() => {
    console.log('🗺️ NEW MAP SYSTEM v2.0 LOADING...');
    loadWorldData();
    loadCharacterState();
  }, []);

  const loadWorldData = async () => {
    console.log('🌍 Loading world hierarchy data from API...');
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/locations/hierarchy');
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ World data loaded from API:', result.data);
        setWorldData(result.data);
      } else {
        throw new Error(result.error || 'Failed to load world data');
      }
    } catch (err) {
      console.error('❌ Error loading world data:', err);
      setError('Failed to load world data from server');
    } finally {
      setLoading(false);
    }
  };

  const loadCharacterState = () => {
    // Mock character data for now
    setCharacter({
      id: 1,
      name: 'Alchimista Player',
      currentLocationId: 'location_laboratorio_alchimista',
      level: 1,
      knownLocations: [
        'continent_orientale',
        'region_velendar', 
        'city_thalareth',
        'location_laboratorio_alchimista',
        'location_accademia',
        'location_mercato_quartiere'
      ]
    });
  };

  const getVisibleLocations = (): WorldLocation[] => {
    if (loading || !worldData || worldData.length === 0) return [];
    
    const { currentZoom, focusedLocationId } = mapView;
    
    if (currentZoom === 'world') {
      // Show all continents 
      return worldData.filter(loc => loc.tier === 'CONTINENT');
    }
    
    if (currentZoom === 'continent' && focusedLocationId) {
      // Show regions of focused continent
      const continent = findLocationInHierarchy(focusedLocationId);
      return continent?.children?.filter(loc => loc.tier === 'REGION') || [];
    }
    
    if (currentZoom === 'region' && focusedLocationId) {
      // Show cities of focused region
      const region = findLocationInHierarchy(focusedLocationId);
      return region?.children?.filter(loc => loc.tier === 'CITY') || [];
    }
    
    if (currentZoom === 'city' && focusedLocationId) {
      // Show locations of focused city
      const city = findLocationInHierarchy(focusedLocationId);
      return city?.children?.filter(loc => loc.tier === 'LOCATION') || [];
    }
    
    return [];
  };

  const findLocationInHierarchy = (locationId: string): WorldLocation | undefined => {
    const searchInArray = (locations: WorldLocation[]): WorldLocation | undefined => {
      for (const location of locations) {
        if (location.id === locationId) {
          return location;
        }
        if (location.children) {
          const found = searchInArray(location.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return searchInArray(worldData);
  };

  const zoomIntoLocation = (location: WorldLocation) => {
    console.log('🔍 Zooming into:', location.name);
    
    if (location.tier === 'CONTINENT') {
      setMapView({
        currentZoom: 'continent',
        focusedLocationId: location.id,
        selectedLocationId: location.id
      });
    } else if (location.tier === 'REGION') {
      setMapView({
        currentZoom: 'region',
        focusedLocationId: location.id,
        selectedLocationId: location.id
      });
    } else if (location.tier === 'CITY') {
      setMapView({
        currentZoom: 'city',
        focusedLocationId: location.id,
        selectedLocationId: location.id
      });
    } else if (location.tier === 'LOCATION') {
      // This is a final location, just select it
      setMapView(prev => ({
        ...prev,
        selectedLocationId: location.id
      }));
    }
  };

  const zoomOut = () => {
    const { currentZoom, focusedLocationId } = mapView;
    
    if (currentZoom === 'city' && focusedLocationId) {
      // Go back to region view
      const city = findLocationInHierarchy(focusedLocationId);
      const parentRegion = city?.parentId ? findLocationInHierarchy(city.parentId) : null;
      
      setMapView({
        currentZoom: 'region',
        focusedLocationId: parentRegion?.id,
        selectedLocationId: parentRegion?.id
      });
    } else if (currentZoom === 'region' && focusedLocationId) {
      // Go back to continent view
      const region = findLocationInHierarchy(focusedLocationId);
      const parentContinent = region?.parentId ? findLocationInHierarchy(region.parentId) : null;
      
      setMapView({
        currentZoom: 'continent',
        focusedLocationId: parentContinent?.id,
        selectedLocationId: parentContinent?.id
      });
    } else if (currentZoom === 'continent') {
      // Go back to world view
      setMapView({
        currentZoom: 'world',
        focusedLocationId: undefined,
        selectedLocationId: undefined
      });
    }
  };

  const getBreadcrumb = (): WorldLocation[] => {
    const breadcrumb: WorldLocation[] = [];
    const { focusedLocationId } = mapView;
    
    if (!focusedLocationId) return breadcrumb;
    
    let currentLocation = findLocationInHierarchy(focusedLocationId);
    
    while (currentLocation) {
      breadcrumb.unshift(currentLocation);
      if (currentLocation.parentId) {
        currentLocation = findLocationInHierarchy(currentLocation.parentId);
      } else {
        break;
      }
    }
    
    return breadcrumb;
  };

  const isLocationKnown = (location: WorldLocation): boolean => {
    return character?.knownLocations.includes(location.id) || location.isKnown;
  };

  const renderLocationCard = (location: WorldLocation) => {
    const isKnown = isLocationKnown(location);
    const isSelected = mapView.selectedLocationId === location.id;
    const canZoomIn = location.tier !== 'LOCATION' && location.children && location.children.length > 0;
    
    return (
      <div
        key={location.id}
        className={`
          p-4 border rounded-lg cursor-pointer transition-all duration-200
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-600 bg-gray-800'}
          ${isKnown ? 'opacity-100' : 'opacity-60'}
          hover:border-blue-400 hover:bg-gray-700
        `}
        onClick={() => zoomIntoLocation(location)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-semibold ${isKnown ? 'text-white' : 'text-gray-400'}`}>
            {isKnown ? location.name : '???'}
          </h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            location.tier === 'CONTINENT' ? 'bg-purple-600 text-white' :
            location.tier === 'REGION' ? 'bg-blue-600 text-white' :
            location.tier === 'CITY' ? 'bg-green-600 text-white' :
            'bg-orange-600 text-white'
          }`}>
            {location.tier.toLowerCase()}
          </span>
        </div>
        
        {isKnown && location.description && (
          <p className="text-gray-300 text-sm mb-3">{location.description}</p>
        )}
        
        {isKnown && location.population && (
          <p className="text-gray-400 text-xs mb-2">
            Population: {location.population.toLocaleString()}
          </p>
        )}
        
        {isKnown && location.specialFeatures && location.specialFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {location.specialFeatures.map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                {feature}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {!location.isAccessible && (
              <span className="px-2 py-1 bg-red-600 text-white rounded text-xs">
                Restricted
              </span>
            )}
            {!isKnown && (
              <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                Unknown
              </span>
            )}
          </div>
          
          {canZoomIn && (
            <span className="text-blue-400 text-sm">Click to explore →</span>
          )}
        </div>
      </div>
    );
  };

  const visibleLocations = getVisibleLocations();
  const breadcrumb = getBreadcrumb();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Debug Badge */}
      <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold z-50">
        NEW MAP v2.0 ACTIVE ✅
      </div>
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">World Map & Travel</h1>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
            Loading world data...
          </div>
        )}
        
        {/* Breadcrumb Navigation */}
        {breadcrumb.length > 0 && (
          <div className="mb-6 flex items-center gap-2 text-gray-300">
            <button
              onClick={() => setMapView({ currentZoom: 'world', focusedLocationId: undefined, selectedLocationId: undefined })}
              className="hover:text-blue-400 transition-colors"
            >
              🌍 World
            </button>
            {breadcrumb.map((loc, index) => (
              <React.Fragment key={loc.id}>
                <span className="text-gray-500">→</span>
                <button
                  onClick={() => zoomIntoLocation(loc)}
                  className="hover:text-blue-400 transition-colors"
                >
                  {loc.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
        
        {/* Zoom Controls */}
        <div className="mb-6 flex gap-4">
          {mapView.currentZoom !== 'world' && (
            <button
              onClick={zoomOut}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              ← Zoom Out
            </button>
          )}
          
          <div className="px-4 py-2 bg-blue-600 rounded-lg">
            Current View: {mapView.currentZoom}
          </div>
        </div>
        
        {/* Available Destinations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">Available Destinations</h2>
          
          {visibleLocations.length === 0 ? (
            <p className="text-gray-400">No accessible locations found. You may need to complete quests or reach higher levels.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleLocations.map(renderLocationCard)}
            </div>
          )}
        </div>
        
        {/* World Overview */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">World Overview</h2>
          
          {worldData.length === 0 ? (
            <p className="text-gray-400">Loading world information...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {worldData.map(continent => (
                <div key={continent.id} className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">{continent.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{continent.description}</p>
                  <p className="text-gray-400 text-xs">
                    Regions: {continent.children?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
