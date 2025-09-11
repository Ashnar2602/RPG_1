import React, { useState, useEffect } from 'react';

interface Location {
  id: number;
  name: string;
  description: string;
  type: string;
  parentLocationId?: number;
  level: number;
  requirements?: {
    minLevel?: number;
    questRequirements?: string[];
  };
}

interface Character {
  id: number;
  name: string;
  currentLocationId?: number;
  level: number;
}

interface MapPageProps {}

export const MapPage: React.FC<MapPageProps> = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
    fetchCharacterLocation();
  }, []);

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/map/locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      setLocations(data.locations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
    }
  };

  const fetchCharacterLocation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/map/character/location', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch character location');
      }

      const data = await response.json();
      setCharacter(data.character || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch character location');
    }
  };

  const moveToLocation = async (locationId: number) => {
    if (!character) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/map/move', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: character.id,
          locationId: locationId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to move character');
      }

      // Update character location
      setCharacter(prev => prev ? { ...prev, currentLocationId: locationId } : null);
      setSelectedLocationId(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move character');
    } finally {
      setLoading(false);
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'continent': return '#10b981'; // green
      case 'kingdom': return '#3b82f6'; // blue
      case 'region': return '#8b5cf6'; // purple
      case 'city': return '#f59e0b'; // amber
      case 'town': return '#ef4444'; // red
      case 'village': return '#6b7280'; // gray
      case 'dungeon': return '#7c2d12'; // dark red
      case 'wilderness': return '#16a34a'; // dark green
      default: return '#6b7280';
    }
  };

  const getCurrentLocation = () => {
    if (!character?.currentLocationId) return null;
    return locations.find(loc => loc.id === character.currentLocationId);
  };

  const getAccessibleLocations = () => {
    if (!character) return [];
    
    return locations.filter(location => {
      // Can't move to current location
      if (location.id === character.currentLocationId) return false;
      
      // Check level requirements
      if (location.requirements?.minLevel && character.level < location.requirements.minLevel) {
        return false;
      }
      
      return true;
    });
  };

  const currentLocation = getCurrentLocation();
  const accessibleLocations = getAccessibleLocations();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '30px',
          textAlign: 'center',
          color: '#3b82f6'
        }}>
          World Map & Travel
        </h1>

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

        {/* Character Info */}
        {character && (
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#10b981' }}>
              Character Status
            </h2>
            <p><strong>Name:</strong> {character.name}</p>
            <p><strong>Level:</strong> {character.level}</p>
            <p><strong>Current Location:</strong> {currentLocation ? currentLocation.name : 'Unknown'}</p>
            {currentLocation && (
              <p style={{ color: '#9ca3af', fontStyle: 'italic', marginTop: '8px' }}>
                {currentLocation.description}
              </p>
            )}
          </div>
        )}

        {/* Movement Section */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#f59e0b' }}>
            Available Destinations
          </h2>

          {selectedLocationId && (
            <div style={{
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '6px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              {(() => {
                const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
                return selectedLocation ? (
                  <div>
                    <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>
                      Travel to: {selectedLocation.name}
                    </h3>
                    <p style={{ marginBottom: '15px' }}>{selectedLocation.description}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => moveToLocation(selectedLocationId)}
                        disabled={loading}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: loading ? '#6b7280' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading ? 'Traveling...' : 'Confirm Travel'}
                      </button>
                      <button
                        onClick={() => setSelectedLocationId(null)}
                        disabled={loading}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {accessibleLocations.map(location => (
              <div
                key={location.id}
                style={{
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '6px',
                  padding: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedLocationId(location.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getLocationTypeColor(location.type)
                    }}
                  />
                  <h3 style={{ color: '#e2e8f0', margin: 0 }}>{location.name}</h3>
                  <span style={{ 
                    backgroundColor: getLocationTypeColor(location.type),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {location.type}
                  </span>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
                  {location.description}
                </p>
                {location.requirements?.minLevel && (
                  <p style={{ 
                    color: character && character.level >= location.requirements.minLevel ? '#10b981' : '#ef4444',
                    fontSize: '0.8rem',
                    marginTop: '8px',
                    margin: '8px 0 0 0'
                  }}>
                    Min Level: {location.requirements.minLevel}
                  </p>
                )}
              </div>
            ))}
          </div>

          {accessibleLocations.length === 0 && (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>
              No accessible locations found. You may need to complete quests or reach higher levels.
            </p>
          )}
        </div>

        {/* All Locations List */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#8b5cf6' }}>
            World Overview
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '15px' }}>
            {locations.map(location => (
              <div
                key={location.id}
                style={{
                  backgroundColor: location.id === character?.currentLocationId ? '#065f46' : '#374151',
                  border: `1px solid ${location.id === character?.currentLocationId ? '#10b981' : '#4b5563'}`,
                  borderRadius: '6px',
                  padding: '15px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getLocationTypeColor(location.type)
                    }}
                  />
                  <h3 style={{ color: '#e2e8f0', margin: 0 }}>{location.name}</h3>
                  <span style={{ 
                    backgroundColor: getLocationTypeColor(location.type),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {location.type}
                  </span>
                  {location.id === character?.currentLocationId && (
                    <span style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      Current
                    </span>
                  )}
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
                  {location.description}
                </p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#9ca3af' }}>
                  <span>Level: {location.level}</span>
                  {location.requirements?.minLevel && (
                    <span>Min Level: {location.requirements.minLevel}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
