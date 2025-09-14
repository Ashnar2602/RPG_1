import React, { useState, useEffect } from 'react';

// World hierarchy types
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

export const MapPage: React.FC = () => {
  const [worldData, setWorldData] = useState<WorldLocation[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [mapView, setMapView] = useState<MapViewState>({
    currentZoom: 'world',
    focusedLocationId: undefined,
    selectedLocationId: undefined
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CSS inline styles for reliable display
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '1.5rem',
      fontFamily: 'Inter, sans-serif'
    },
    header: {
      fontSize: '2rem',
      fontWeight: 'bold' as const,
      color: '#60a5fa',
      marginBottom: '1.5rem'
    },
    badge: {
      position: 'fixed' as const,
      top: '1rem',
      right: '1rem',
      backgroundColor: '#16a34a',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: 'bold' as const,
      zIndex: 1000
    },
    error: {
      backgroundColor: '#dc2626',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem'
    },
    loading: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem'
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem',
      color: '#9ca3af'
    },
    breadcrumbButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    button: {
      padding: '0.5rem 1rem',
      backgroundColor: '#374151',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer'
    },
    primaryButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600' as const,
      color: '#f97316',
      marginBottom: '1rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    card: {
      padding: '1rem',
      backgroundColor: '#374151',
      border: '1px solid #4b5563',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    cardSelected: {
      padding: '1rem',
      backgroundColor: '#1e40af',
      border: '1px solid #3b82f6',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: '600' as const,
      marginBottom: '0.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    tierBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500' as const
    },
    description: {
      color: '#d1d5db',
      fontSize: '0.875rem',
      marginBottom: '0.75rem'
    },
    population: {
      color: '#9ca3af',
      fontSize: '0.75rem',
      marginBottom: '0.5rem'
    },
    features: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.25rem',
      marginBottom: '0.5rem'
    },
    feature: {
      padding: '0.25rem 0.5rem',
      backgroundColor: '#4b5563',
      color: '#d1d5db',
      borderRadius: '0.25rem',
      fontSize: '0.75rem'
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    status: {
      display: 'flex',
      gap: '0.5rem'
    },
    statusBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem'
    },
    explore: {
      color: '#60a5fa',
      fontSize: '0.875rem'
    },
    overview: {
      backgroundColor: '#374151',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      border: '1px solid #4b5563'
    },
    overviewTitle: {
      fontSize: '1.25rem',
      fontWeight: '600' as const,
      color: '#a855f7',
      marginBottom: '1rem'
    }
  };

  // Initialize world data from API
  useEffect(() => {
    console.log('🗺️ MAP SYSTEM v2.0 WITH INLINE STYLES LOADING...');
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
      setWorldData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCharacterState = () => {
    // Check if user is Admin (for testing) - in real app this would come from auth
    const isAdmin = localStorage.getItem('currentUser') === 'Admin';
    
    if (isAdmin) {
      // Admin has access to everything
      setCharacter({
        id: 999,
        name: 'Admin Explorer',
        currentLocationId: 'location_laboratorio_alchimista',
        level: 100,
        knownLocations: [] // Will be handled by isLocationKnown function
      });
    } else {
      // Regular player
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
    }
  };

  const getVisibleLocations = (): WorldLocation[] => {
    if (loading || !worldData || worldData.length === 0) return [];
    
    const { currentZoom, focusedLocationId } = mapView;
    const isAdmin = localStorage.getItem('currentUser') === 'Admin';
    
    if (currentZoom === 'world') {
      const continents = worldData.filter(loc => loc.tier === 'CONTINENT');
      // Admin sees all continents, regular players see only known/accessible ones
      if (isAdmin) {
        return continents;
      }
      return continents.filter(loc => isLocationKnown(loc) || loc.isAccessible);
    }
    
    if (currentZoom === 'continent' && focusedLocationId) {
      const continent = findLocationInHierarchy(focusedLocationId);
      const regions = continent?.children?.filter(loc => loc.tier === 'REGION') || [];
      // Admin sees all regions, regular players see only known/accessible ones
      if (isAdmin) {
        return regions;
      }
      return regions.filter(loc => isLocationKnown(loc) || loc.isAccessible);
    }
    
    if (currentZoom === 'region' && focusedLocationId) {
      const region = findLocationInHierarchy(focusedLocationId);
      const cities = region?.children?.filter(loc => loc.tier === 'CITY') || [];
      // Admin sees all cities, regular players see only known/accessible ones
      if (isAdmin) {
        return cities;
      }
      return cities.filter(loc => isLocationKnown(loc) || loc.isAccessible);
    }
    
    if (currentZoom === 'city' && focusedLocationId) {
      const city = findLocationInHierarchy(focusedLocationId);
      const locations = city?.children?.filter(loc => loc.tier === 'LOCATION') || [];
      // Admin sees ALL settlements/locations, regular players see only known/accessible ones
      if (isAdmin) {
        console.log(`🔍 Admin Mode: Showing ${locations.length} settlements in city ${city?.name}`, locations.map(l => l.name));
        return locations;
      }
      const visibleLocations = locations.filter(loc => isLocationKnown(loc) || loc.isAccessible);
      console.log(`👤 Player Mode: Showing ${visibleLocations.length}/${locations.length} settlements in city ${city?.name}`);
      return visibleLocations;
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
      setMapView(prev => ({
        ...prev,
        selectedLocationId: location.id
      }));
    }
  };

  const zoomOut = () => {
    const { currentZoom, focusedLocationId } = mapView;
    
    if (currentZoom === 'city' && focusedLocationId) {
      const city = findLocationInHierarchy(focusedLocationId);
      const parentRegion = city?.parentId ? findLocationInHierarchy(city.parentId) : null;
      
      setMapView({
        currentZoom: 'region',
        focusedLocationId: parentRegion?.id,
        selectedLocationId: parentRegion?.id
      });
    } else if (currentZoom === 'region' && focusedLocationId) {
      const region = findLocationInHierarchy(focusedLocationId);
      const parentContinent = region?.parentId ? findLocationInHierarchy(region.parentId) : null;
      
      setMapView({
        currentZoom: 'continent',
        focusedLocationId: parentContinent?.id,
        selectedLocationId: parentContinent?.id
      });
    } else if (currentZoom === 'continent') {
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
    // Admin can see everything
    const isAdmin = localStorage.getItem('currentUser') === 'Admin';
    if (isAdmin) {
      return true;
    }
    
    // Regular player logic
    return character?.knownLocations.includes(location.id) || location.isKnown;
  };

  const getTierBadgeStyle = (tier: string) => {
    const base = { ...styles.tierBadge };
    switch (tier) {
      case 'CONTINENT':
        return { ...base, backgroundColor: '#7c3aed', color: 'white' };
      case 'REGION':
        return { ...base, backgroundColor: '#2563eb', color: 'white' };
      case 'CITY':
        return { ...base, backgroundColor: '#16a34a', color: 'white' };
      default:
        return { ...base, backgroundColor: '#ea580c', color: 'white' };
    }
  };

  const renderLocationCard = (location: WorldLocation) => {
    const isKnown = isLocationKnown(location);
    const isSelected = mapView.selectedLocationId === location.id;
    const canZoomIn = location.tier !== 'LOCATION' && location.children && location.children.length > 0;
    
    return (
      <div
        key={location.id}
        style={isSelected ? styles.cardSelected : styles.card}
        onClick={() => zoomIntoLocation(location)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isSelected ? '#1e40af' : '#4b5563';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isSelected ? '#1e40af' : '#374151';
        }}
      >
        <div style={styles.cardTitle}>
          <h3>{isKnown ? location.name : '???'}</h3>
          <span style={getTierBadgeStyle(location.tier)}>
            {location.tier.toLowerCase()}
          </span>
        </div>
        
        {isKnown && location.description && (
          <p style={styles.description}>{location.description}</p>
        )}
        
        {isKnown && location.population && (
          <p style={styles.population}>
            Population: {location.population.toLocaleString()}
          </p>
        )}
        
        {isKnown && location.specialFeatures && location.specialFeatures.length > 0 && (
          <div style={styles.features}>
            {location.specialFeatures.map((feature, index) => (
              <span key={index} style={styles.feature}>
                {feature}
              </span>
            ))}
          </div>
        )}
        
        <div style={styles.cardFooter}>
          <div style={styles.status}>
            {!location.isAccessible && (
              <span style={{...styles.statusBadge, backgroundColor: '#dc2626', color: 'white'}}>
                Restricted
              </span>
            )}
            {!isKnown && (
              <span style={{...styles.statusBadge, backgroundColor: '#6b7280', color: 'white'}}>
                Unknown
              </span>
            )}
          </div>
          
          {canZoomIn && (
            <span style={styles.explore}>Click to explore →</span>
          )}
        </div>
      </div>
    );
  };

  const visibleLocations = getVisibleLocations();
  const breadcrumb = getBreadcrumb();

  return (
    <div style={styles.container}>
      {/* Debug Badge */}
      <div style={styles.badge}>
        INLINE STYLES v2.0 ✅
      </div>
      
      {/* Admin Toggle for Testing */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 1000
      }}>
        <button
          style={{
            ...styles.button,
            backgroundColor: localStorage.getItem('currentUser') === 'Admin' ? '#16a34a' : '#374151'
          }}
          onClick={() => {
            const isAdmin = localStorage.getItem('currentUser') === 'Admin';
            if (isAdmin) {
              localStorage.removeItem('currentUser');
              console.log('🔄 Switched to Player Mode');
            } else {
              localStorage.setItem('currentUser', 'Admin');
              console.log('🔄 Switched to Admin Mode - All locations should now be visible');
            }
            loadCharacterState();
            // Force re-render by resetting view state
            setMapView({
              currentZoom: 'world',
              focusedLocationId: undefined,
              selectedLocationId: undefined
            });
          }}
        >
          {localStorage.getItem('currentUser') === 'Admin' ? '👑 Admin Mode (All Visible)' : '🔓 Enable Admin Mode'}
        </button>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={styles.header}>World Map & Travel System</h1>
        
        {error && (
          <div style={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {loading && (
          <div style={styles.loading}>
            Loading world data...
          </div>
        )}
        
        {/* Breadcrumb Navigation */}
        {breadcrumb.length > 0 && (
          <div style={styles.breadcrumb}>
            <button
              style={styles.breadcrumbButton}
              onClick={() => setMapView({ currentZoom: 'world', focusedLocationId: undefined, selectedLocationId: undefined })}
            >
              🌍 World
            </button>
            {breadcrumb.map((loc) => (
              <React.Fragment key={loc.id}>
                <span>→</span>
                <button
                  style={styles.breadcrumbButton}
                  onClick={() => zoomIntoLocation(loc)}
                >
                  {loc.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
        
        {/* Zoom Controls */}
        <div style={styles.controls}>
          {mapView.currentZoom !== 'world' && (
            <button style={styles.button} onClick={zoomOut}>
              ← Zoom Out
            </button>
          )}
          
          <div style={styles.primaryButton}>
            Current View: {mapView.currentZoom}
          </div>
        </div>
        
        {/* Available Destinations */}
        {/* Debug Information */}
        <div style={{
          backgroundColor: '#374151',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem',
          border: '1px solid #4b5563'
        }}>
          <h3 style={{fontSize: '1rem', fontWeight: '600', color: '#fbbf24', marginBottom: '0.5rem'}}>
            🔍 Debug Info
          </h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.875rem'}}>
            <div>Mode: {localStorage.getItem('currentUser') === 'Admin' ? '👑 Admin' : '👤 Player'}</div>
            <div>Current Zoom: {mapView.currentZoom}</div>
            <div>Focused Location: {mapView.focusedLocationId || 'None'}</div>
            <div>Available Locations: {visibleLocations.length}</div>
            <div>Total Continents: {worldData.length}</div>
            <div>World Data Loaded: {worldData.length > 0 ? '✅' : '❌'}</div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={styles.sectionTitle}>Available Destinations</h2>
          
          {visibleLocations.length === 0 ? (
            <div style={styles.card}>
              <p style={styles.description}>
                {loading ? 'Loading locations...' : `No accessible locations found in ${mapView.currentZoom} view. ${localStorage.getItem('currentUser') === 'Admin' ? 'This might indicate a data loading issue.' : 'You may need to complete quests or reach higher levels, or try Admin mode.'}`}
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {visibleLocations.map(renderLocationCard)}
            </div>
          )}
        </div>
        
        {/* World Overview */}
        <div style={styles.overview}>
          <h2 style={styles.overviewTitle}>World Overview</h2>
          
          {worldData.length === 0 ? (
            <p style={styles.description}>
              {loading ? 'Loading world information...' : 'No world data available.'}
            </p>
          ) : (
            <div style={styles.grid}>
              {worldData.map(continent => (
                <div key={continent.id} style={{...styles.card, cursor: 'default'}}>
                  <h3 style={{...styles.cardTitle, color: '#a855f7'}}>{continent.name}</h3>
                  <p style={styles.description}>{continent.description}</p>
                  <p style={styles.population}>
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
