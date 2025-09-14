-- Fix accessibility settings for Western Continent settlements
-- Rendi tutti gli insediamenti del Continente Occidentale navigabili

UPDATE locations 
SET is_accessible = true, 
    is_known = true, 
    is_discovered = false  -- Devono essere scoperti durante gameplay
WHERE tier = 'location' 
AND parent_id IN (
    SELECT id FROM locations 
    WHERE parent_id = 'continent_occidentale' 
    AND tier = 'region'
);

-- Rendi alcuni insediamenti più importanti già scoperti
UPDATE locations 
SET is_discovered = true
WHERE tier = 'location' 
AND parent_id IN (
    SELECT id FROM locations 
    WHERE parent_id = 'continent_occidentale' 
    AND tier = 'region'
)
AND name IN (
    'Crossroads Inn',
    'Greenwood Market', 
    'Tinkertown',
    'Grimm Khazad',
    'Wildmeat Market',
    'Bonegrinder Camp',
    'Frostbite Camp',
    'Nightcool Haven'
);
