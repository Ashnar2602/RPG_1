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

  // Initialize world data with our 4-tier hierarchy
  useEffect(() => {
    console.log('🗺️ NEW MAP SYSTEM LOADING...');
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
        console.log('✅ World data loaded:', result.data);
        setWorldData(result.data);
      } else {
        throw new Error(result.error || 'Failed to load world data');
      }
    } catch (err) {
      console.error('❌ Error loading world data:', err);
      setError('Failed to load world data. Using offline mode.');
      
      // Fallback to hardcoded data if API fails
      const fallbackData: WorldLocation[] = [
      // CONTINENTS (Tier 1)
      {
        id: 'cont_occidental',
        name: 'Continente Occidentale',
        description: 'Terre ancestrali di nani, orchi, troll e altre razze antiche. Territorio selvaggio con grandi foreste, montagne e clan tradizionali.',
        tier: 'continent',
        isAccessible: true,
        isKnown: true,
        coordinates: { x: 0, y: 0 },
        population: 12000000
      },
      {
        id: 'cont_oriental',
        name: 'Continente Orientale',
        description: 'Centro della civilizzazione umana e della magia. Sede dell\'Accademia Suprema e dei regni più organizzati.',
        tier: 'continent',
        isAccessible: true,
        isKnown: true,
        coordinates: { x: 1, y: 0 },
        population: 8000000
      },
      {
        id: 'archipelago_central',
        name: 'Arcipelago Centrale',
        description: 'Cuore del commercio marittimo mondiale. Isole libere, porti neutrali e rotte commerciali vitali.',
        tier: 'continent',
        isAccessible: true,
        isKnown: false, // Player needs to discover
        coordinates: { x: 0.5, y: 1 },
        population: 2500000
      },
      // REGIONS - Continente Occidentale
      {
        id: 'reg_reame_nanico',
        name: 'Reame Nanico di Kroldun',
        description: 'Regno sotterraneo dei nani, maestri dell\'artigianato e dell\'ingegneria mineraria.',
        tier: 'region',
        parentId: 'cont_occidental',
        isAccessible: true,
        isKnown: false,
        coordinates: { x: 0, y: 0 }
      },
      {
        id: 'reg_domini_elfici',
        name: 'Domini Elfici di Aelthara',
        description: 'Foreste antiche degli elfi, guardiani della natura e della magia silvana.',
        tier: 'region',
        parentId: 'cont_occidental',
        isAccessible: true,
        isKnown: false,
        coordinates: { x: 1, y: 0 }
      },
      // REGIONS - Continente Orientale
      {
        id: 'reg_regno_velendar',
        name: 'Regno di Velendar',
        description: 'Regno umano civilizzato, sede dell\'Accademia di Magia e centro della diplomazia.',
        tier: 'region',
        parentId: 'cont_oriental',  
        isAccessible: true,
        isKnown: true, // Player starting region
        coordinates: { x: 0, y: 0 }
      },
      {
        id: 'reg_regno_brynnar',
        name: 'Regno di Brynnar',
        description: 'Regno guerriero del nord, terre fredde di guerrieri valorosi e tradizioni antiche.',
        tier: 'region',
        parentId: 'cont_oriental',
        isAccessible: true,
        isKnown: false, 
        coordinates: { x: 0, y: 1 }
      },
      // CITIES - Regno di Velendar (Player's starting region)
      {
        id: 'city_thalareth',
        name: 'Thalareth',
        description: 'Capitale del regno, sede dell\'Accademia di Magia Suprema. Città di ponti magici e torri di cristallo.',
        tier: 'city',
        parentId: 'reg_regno_velendar',
        isAccessible: true,
        isKnown: true, // Player starting city
        coordinates: { x: 0, y: 0 },
        population: 435000,
        specialFeatures: ['Accademia di Magia', 'Ponti Magici', 'Senato Accademico']
      },
      {
        id: 'city_goldenharbor',
        name: 'Goldenharbor',
        description: 'Porto Dorato, principale hub commerciale del regno con cantieri navali e commercio internazionale.',
        tier: 'city',
        parentId: 'reg_regno_velendar',
        isAccessible: true,
        isKnown: false,
        coordinates: { x: 1, y: 1 },
        population: 100000,
        specialFeatures: ['Porto Commerciale', 'Cantieri Navali', 'Dogane Internazionali']
      }
    ];

    setWorldData(worldHierarchy);
    
    // Set initial view based on player's known locations
    const playerKnownRegion = worldHierarchy.find(loc => 
      loc.tier === 'region' && loc.isKnown
    );
    
    if (playerKnownRegion) {
      setMapView({
        currentZoom: 'region',
        focusedLocationId: playerKnownRegion.id
      });
    }
  };

  const loadCharacterState = () => {
    // Load character state from localStorage or API
    const activeCharacter = localStorage.getItem('activeCharacter');
    if (activeCharacter) {
      try {
        const character = JSON.parse(activeCharacter);
        setCharacter({
          id: character.id,
          name: character.name,
          level: character.level || 1,
          currentLocationId: 'city_thalareth', // Starting location
          knownLocations: ['cont_oriental', 'reg_regno_velendar', 'city_thalareth'] // Starting knowledge
        });
      } catch (error) {
        console.error('Failed to parse character data:', error);
      }
    }
  };

  // Navigation functions
  const zoomIntoLocation = (locationId: string) => {
    const location = worldData.find(loc => loc.id === locationId);
    if (!location) return;

    // Determine new zoom level based on location tier
    let newZoom: 'world' | 'continent' | 'region' | 'city' = 'world';
    switch (location.tier) {
      case 'continent':
        newZoom = 'continent';
        break;
      case 'region':
        newZoom = 'region';
        break;
      case 'city':
        newZoom = 'city';
        break;
    }

    setMapView({
      currentZoom: newZoom,
      focusedLocationId: locationId,
      selectedLocationId: undefined
    });
  };

  const zoomOut = () => {
    const currentFocus = worldData.find(loc => loc.id === mapView.focusedLocationId);
    
    if (mapView.currentZoom === 'city') {
      // Zoom out to region
      const parentRegion = currentFocus?.parentId;
      setMapView({
        currentZoom: 'region',
        focusedLocationId: parentRegion,
        selectedLocationId: undefined
      });
    } else if (mapView.currentZoom === 'region') {
      // Zoom out to continent
      const parentContinent = worldData.find(loc => loc.id === currentFocus?.parentId)?.parentId;
      setMapView({
        currentZoom: 'continent',
        focusedLocationId: parentContinent,
        selectedLocationId: undefined
      });
    } else if (mapView.currentZoom === 'continent') {
      // Zoom out to world
      setMapView({
        currentZoom: 'world',
        focusedLocationId: undefined,
        selectedLocationId: undefined
      });
    }
  };

  const selectLocation = (locationId: string) => {
    setMapView(prev => ({
      ...prev,
      selectedLocationId: locationId
    }));
  };

  // Travel function
  const travelToLocation = async (locationId: string) => {
    if (!character) return;
    
    setLoading(true);
    try {
      // Here you would make API call to move character
      // For now, just update local state
      setCharacter(prev => prev ? {
        ...prev,
        currentLocationId: locationId,
        knownLocations: [...prev.knownLocations, locationId]
      } : null);
      
      setMapView(prev => ({
        ...prev,
        selectedLocationId: undefined
      }));
    } catch (error) {
      setError('Failed to travel to location');
    } finally {
      setLoading(false);
    }
  };

  // Get locations for current view
  const getVisibleLocations = (): WorldLocation[] => {
    switch (mapView.currentZoom) {
      case 'world':
        return worldData.filter(loc => loc.tier === 'continent');
      case 'continent':
        return worldData.filter(loc => 
          loc.parentId === mapView.focusedLocationId && loc.tier === 'region'
        );
      case 'region':
        return worldData.filter(loc => 
          loc.parentId === mapView.focusedLocationId && loc.tier === 'city'
        );
      case 'city':
        return worldData.filter(loc => 
          loc.parentId === mapView.focusedLocationId && loc.tier === 'location'
        );
      default:
        return [];
    }
  };

  const getCurrentLocation = (): WorldLocation | null => {
    if (!character?.currentLocationId) return null;
    return worldData.find(loc => loc.id === character.currentLocationId) || null;
  };

  const getLocationTypeColor = (tier: string) => {
    switch (tier) {
      case 'continent': return '#10b981'; // green
      case 'region': return '#3b82f6'; // blue  
      case 'city': return '#f59e0b'; // amber
      case 'location': return '#8b5cf6'; // purple
      default: return '#6b7280';
    }
  };

  const getBreadcrumbs = (): WorldLocation[] => {
    const breadcrumbs: WorldLocation[] = [];
    let currentLoc = worldData.find(loc => loc.id === mapView.focusedLocationId);
    
    while (currentLoc) {
      breadcrumbs.unshift(currentLoc);
      currentLoc = worldData.find(loc => loc.id === currentLoc?.parentId);
    }
    
    return breadcrumbs;
  };

  const visibleLocations = getVisibleLocations();
  const currentLocation = getCurrentLocation();
  const selectedLocation = worldData.find(loc => loc.id === mapView.selectedLocationId);
  const breadcrumbs = getBreadcrumbs();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white',
      padding: '20px'
    }}>
      {/* DEBUG: New map system loaded */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: '#10b981',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        NEW MAP v2.0 ACTIVE ✅
      </div>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#3b82f6',
            margin: 0
          }}>
            🗺️ World Map Navigator [v2.0 - 13/09]
          </h1>
          
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMapView({ currentZoom: 'world', focusedLocationId: undefined })}
              style={{
                padding: '6px 12px',
                backgroundColor: mapView.currentZoom === 'world' ? '#3b82f6' : 'transparent',
                color: 'white',
                border: '1px solid #3b82f6',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🌍 World
            </button>
            {breadcrumbs.map((loc) => (
              <React.Fragment key={loc.id}>
                <span style={{ color: '#6b7280' }}>→</span>
                <button
                  onClick={() => zoomIntoLocation(loc.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: mapView.focusedLocationId === loc.id ? '#3b82f6' : 'transparent',
                    color: 'white',
                    border: '1px solid #6b7280',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {loc.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#7f1d1d',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Map Grid - Left Side */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '20px',
            minHeight: '600px'
          }}>
            {/* Map Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: '#10b981',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {mapView.currentZoom === 'world' && '🌍 World View'}
                {mapView.currentZoom === 'continent' && '🏔️ Continent View'}
                {mapView.currentZoom === 'region' && '🏛️ Region View'} 
                {mapView.currentZoom === 'city' && '🏘️ City View'}
              </h2>
              
              {mapView.currentZoom !== 'world' && (
                <button
                  onClick={zoomOut}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#374151',
                    color: 'white',
                    border: '1px solid #6b7280',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  ↶ Zoom Out
                </button>
              )}
            </div>

            {/* Map Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '15px',
              minHeight: '500px'
            }}>
              {visibleLocations
                .filter(loc => character?.knownLocations.includes(loc.id) || loc.isKnown)
                .map(location => (
                <div
                  key={location.id}
                  style={{
                    backgroundColor: location.id === character?.currentLocationId ? '#065f46' : 
                                   mapView.selectedLocationId === location.id ? '#1e40af' : '#374151',
                    border: `2px solid ${
                      location.id === character?.currentLocationId ? '#10b981' : 
                      mapView.selectedLocationId === location.id ? '#3b82f6' : '#4b5563'
                    }`,
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: mapView.selectedLocationId === location.id ? 'scale(1.02)' : 'scale(1)',
                    position: 'relative'
                  }}
                  onClick={() => selectLocation(location.id)}
                  onDoubleClick={() => {
                    if (location.tier !== 'location') {
                      zoomIntoLocation(location.id);
                    }
                  }}
                >
                  {/* Location Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: getLocationTypeColor(location.tier),
                        flexShrink: 0
                      }}
                    />
                    <h3 style={{ 
                      color: '#e2e8f0', 
                      margin: 0, 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}>
                      {location.name}
                    </h3>
                  </div>

                  {/* Tier Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: getLocationTypeColor(location.tier),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {location.tier}
                  </div>

                  {/* Location Info */}
                  <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '0.9rem', 
                    margin: '0 0 12px 0',
                    lineHeight: '1.4'
                  }}>
                    {location.description}
                  </p>

                  {/* Population & Features */}
                  {location.population && (
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '0.8rem', 
                      margin: '0 0 8px 0' 
                    }}>
                      👥 Population: {location.population.toLocaleString()}
                    </p>
                  )}

                  {location.specialFeatures && (
                    <div style={{ marginTop: '8px' }}>
                      {location.specialFeatures.slice(0, 2).map(feature => (
                        <span
                          key={feature}
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#1f2937',
                            color: '#9ca3af',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            marginRight: '4px',
                            marginBottom: '4px'
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Current Location Indicator */}
                  {location.id === character?.currentLocationId && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      📍 Current Location
                    </div>
                  )}

                  {/* Zoom Indicator */}
                  {location.tier !== 'location' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      color: '#6b7280',
                      fontSize: '0.8rem'
                    }}>
                      🔍 Double-click to explore
                    </div>
                  )}
                </div>
              ))}

              {/* Unknown Locations */}
              {visibleLocations
                .filter(loc => !character?.knownLocations.includes(loc.id) && !loc.isKnown)
                .map((_, index) => (
                <div
                  key={`unknown-${index}`}
                  style={{
                    backgroundColor: '#1f2937',
                    border: '2px dashed #374151',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>❓</div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Unknown Territory</p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>Explore to discover</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel - Right Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Character Status */}
            {character && (
              <div style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#10b981' }}>
                  🧙‍♂️ Character Status
                </h3>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <p><strong>Name:</strong> {character.name}</p>
                  <p><strong>Level:</strong> {character.level}</p>
                  <p><strong>Current Location:</strong></p>
                  <div style={{ 
                    backgroundColor: '#374151', 
                    padding: '8px', 
                    borderRadius: '4px',
                    marginTop: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {currentLocation ? currentLocation.name : 'Unknown'}
                  </div>
                  <p style={{ marginTop: '8px' }}>
                    <strong>Known Locations:</strong> {character.knownLocations.length}
                  </p>
                </div>
              </div>
            )}

            {/* Selected Location Details */}
            {selectedLocation && (
              <div style={{
                backgroundColor: '#1e293b',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '12px', 
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getLocationTypeColor(selectedLocation.tier)
                    }}
                  />
                  {selectedLocation.name}
                </h3>
                
                <p style={{ color: '#9ca3af', marginBottom: '16px', lineHeight: '1.4' }}>
                  {selectedLocation.description}
                </p>

                {selectedLocation.population && (
                  <p style={{ color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '8px' }}>
                    <strong>Population:</strong> {selectedLocation.population.toLocaleString()}
                  </p>
                )}

                {selectedLocation.specialFeatures && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '8px' }}>
                      <strong>Special Features:</strong>
                    </p>
                    {selectedLocation.specialFeatures.map(feature => (
                      <div
                        key={feature}
                        style={{
                          backgroundColor: '#374151',
                          color: '#9ca3af',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          marginBottom: '4px'
                        }}
                      >
                        • {feature}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedLocation.tier !== 'location' && (
                    <button
                      onClick={() => zoomIntoLocation(selectedLocation.id)}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      🔍 Explore {selectedLocation.tier}
                    </button>
                  )}
                  
                  {selectedLocation.id !== character?.currentLocationId && selectedLocation.isAccessible && (
                    <button
                      onClick={() => travelToLocation(selectedLocation.id)}
                      disabled={loading}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: loading ? '#6b7280' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {loading ? '🚶‍♂️ Traveling...' : '🚶‍♂️ Travel Here'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Help */}
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#f59e0b' }}>
                💡 Navigation Help
              </h3>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem', lineHeight: '1.6' }}>
                <p>• <strong>Click</strong> to select a location</p>
                <p>• <strong>Double-click</strong> to zoom into regions/cities</p>
                <p>• Use <strong>Zoom Out</strong> to go back</p>
                <p>• <strong>Breadcrumbs</strong> show your navigation path</p>
                <p>• ❓ <strong>Unknown areas</strong> require exploration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
