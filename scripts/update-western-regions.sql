-- Verify existing western continent structure
SELECT id, name, tier, 
       (SELECT COUNT(*) FROM locations children WHERE children.parent_id = w.id) as children_count
FROM locations w 
WHERE name = 'Continente Occidentale' 
AND tier = 'continent';

-- Show existing regions
SELECT id, name, tier, parent_id,
       (SELECT COUNT(*) FROM locations children WHERE children.parent_id = w.id) as children_count
FROM locations w 
WHERE parent_id = 'continent_occidentale' 
AND tier = 'region';

-- Update existing dwarf region with proper details
UPDATE locations 
SET 
  name = 'Regno Nanico delle Otto Forgie',
  description = 'Centro-nord del continente lungo la catena montuosa principale. Regno sotterraneo dei nani maestri forgiatori.',
  coordinates_x = -900,
  coordinates_y = 100,
  coordinates_z = 0,
  is_accessible = true,
  special_features = ARRAY['Forgiatura suprema', 'Miniere profonde', 'Città sotterranee', 'Regno delle Otto Forgie'],
  population = 600000
WHERE id = 'region_nani';

-- Update existing orc region with proper details  
UPDATE locations 
SET 
  name = 'Territori Orcheschi',
  description = 'Le terre selvagge degli orchi, dominate dalla forza bruta e clan in guerra costante.',
  coordinates_x = -1100,
  coordinates_y = -100,
  coordinates_z = 0,
  is_accessible = false,
  special_features = ARRAY['Guerrieri brutali', 'Terre selvagge', 'Clan in guerra'],
  population = 400000
WHERE id = 'region_orchi';

-- Verify updates
SELECT id, name, population, special_features 
FROM locations 
WHERE parent_id = 'continent_occidentale' 
AND tier = 'region';
