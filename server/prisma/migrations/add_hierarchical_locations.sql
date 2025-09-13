-- Migration per aggiungere il sistema di location gerarchiche
-- Basato sul sistema a 4 livelli: Continent -> Region -> City -> Location

-- Drop e ricreo Location table con nuovo schema
DROP TABLE IF EXISTS locations CASCADE;

CREATE TABLE locations (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('continent', 'region', 'city', 'location')),
  parent_id VARCHAR(191),
  
  -- Coordinates system
  coordinates_x DECIMAL(10,6) DEFAULT 0,
  coordinates_y DECIMAL(10,6) DEFAULT 0,
  coordinates_z DECIMAL(10,6) DEFAULT 0,
  
  -- Discovery system
  is_accessible BOOLEAN DEFAULT true,
  is_known BOOLEAN DEFAULT false,
  is_discovered BOOLEAN DEFAULT false,
  
  -- Game mechanics
  is_safe_zone BOOLEAN DEFAULT true,
  is_pvp_enabled BOOLEAN DEFAULT false,
  is_start_area BOOLEAN DEFAULT false,
  max_players INTEGER DEFAULT 50,
  
  -- Additional properties (JSON for flexibility)
  special_features TEXT[], -- Array of special features
  population INTEGER,
  requirements JSONB, -- Level, quest, cultural requirements
  lore_connections JSONB, -- Connections to lore and world building
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraint
  CONSTRAINT fk_location_parent FOREIGN KEY (parent_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_locations_parent_id ON locations(parent_id);
CREATE INDEX idx_locations_tier ON locations(tier);
CREATE INDEX idx_locations_coordinates ON locations(coordinates_x, coordinates_y);
CREATE INDEX idx_locations_accessibility ON locations(is_accessible, is_known, is_discovered);

-- Update Character table to reference new location system
ALTER TABLE characters ADD COLUMN current_location_id VARCHAR(191);
ALTER TABLE characters ADD CONSTRAINT fk_character_location FOREIGN KEY (current_location_id) REFERENCES locations(id);

-- Update spawn_points to reference new locations
UPDATE spawn_points SET location_id = NULL WHERE location_id IS NOT NULL;
