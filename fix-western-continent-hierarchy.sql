-- Fix Western Continent Location Hierarchy
-- Problem: Many settlements are marked as cities directly under regions
-- Solution: Reorganize settlements under proper cities

-- REGIONE: Regno Gnomesco di Nôr-Velyr
-- Step 1: Find the region and city IDs
-- Step 2: Reassign settlements to be under cities instead of region

-- Get the region ID for Reino Gnomesco
WITH gnomi_region AS (
  SELECT id as region_id, name
  FROM locations 
  WHERE name = 'Regno Gnomesco di Nôr-Velyr' 
  AND tier = 'REGION'
),
-- Get city IDs
cities AS (
  SELECT l.id, l.name, l.tier, gr.region_id
  FROM locations l
  JOIN gnomi_region gr ON l.parent_id = gr.region_id
  WHERE l.name IN ('Nôr-Velyr', 'Gearwood', 'Crystalspire', 'Clockwork')
  AND l.tier = 'CITY'
),
-- Get settlement IDs that need to be reassigned
settlements AS (
  SELECT l.id, l.name, l.tier, gr.region_id
  FROM locations l  
  JOIN gnomi_region gr ON l.parent_id = gr.region_id
  WHERE l.name IN ('Steamvale', 'Tinkertown', 'Alchemyville', 'Lightforge', 'Windmill Heights', 'Cogwheel Station')
  AND l.tier = 'LOCATION'
)

-- Show current structure before changes
SELECT 'CURRENT STRUCTURE:' as info, NULL as id, NULL as name, NULL as new_parent;

-- Display current hierarchy
SELECT 
  'Region: ' || gr.name as info,
  NULL as id,
  NULL as name, 
  NULL as new_parent
FROM gnomi_region gr

UNION ALL

SELECT 
  '  City: ' || c.name as info,
  c.id,
  c.name,
  NULL as new_parent
FROM cities c

UNION ALL

SELECT 
  '  Settlement: ' || s.name || ' (needs to be moved)' as info,
  s.id,
  s.name,
  NULL as new_parent
FROM settlements s;

-- Now show the reassignment plan
-- Assign settlements to cities logically:
-- Nôr-Velyr (Capital): Tinkertown, Alchemyville (central services)
-- Gearwood (Industrial): Steamvale, Cogwheel Station (mechanical/industrial) 
-- Crystalspire (Energy): Lightforge (optical/energy related)
-- Clockwork (Precision): Windmill Heights (precision/measurement)

-- Step 1: Update settlements to be under appropriate cities
UPDATE locations 
SET parent_id = (SELECT id FROM locations WHERE name = 'Nôr-Velyr' AND tier = 'CITY')
WHERE name IN ('Tinkertown', 'Alchemyville') 
  AND parent_id = (SELECT id FROM locations WHERE name = 'Regno Gnomesco di Nôr-Velyr');

UPDATE locations 
SET parent_id = (SELECT id FROM locations WHERE name = 'Gearwood' AND tier = 'CITY')
WHERE name IN ('Steamvale', 'Cogwheel Station') 
  AND parent_id = (SELECT id FROM locations WHERE name = 'Regno Gnomesco di Nôr-Velyr');

UPDATE locations 
SET parent_id = (SELECT id FROM locations WHERE name = 'Crystalspire' AND tier = 'CITY')
WHERE name IN ('Lightforge') 
  AND parent_id = (SELECT id FROM locations WHERE name = 'Regno Gnomesco di Nôr-Velyr');

UPDATE locations 
SET parent_id = (SELECT id FROM locations WHERE name = 'Clockwork' AND tier = 'CITY')
WHERE name IN ('Windmill Heights') 
  AND parent_id = (SELECT id FROM locations WHERE name = 'Regno Gnomesco di Nôr-Velyr');

-- Verify the changes
SELECT 'UPDATED STRUCTURE:' as result;

-- Show new hierarchy
WITH gnomi_region AS (
  SELECT id as region_id, name
  FROM locations 
  WHERE name = 'Regno Gnomesco di Nôr-Velyr' 
  AND tier = 'REGION'
)
SELECT 
  CASE 
    WHEN l.parent_id = gr.region_id AND l.tier = 'CITY' THEN '  City: ' || l.name || ' (Children: ' || 
      COALESCE((SELECT COUNT(*)::text FROM locations WHERE parent_id = l.id), '0') || ')'
    WHEN l.tier = 'LOCATION' AND parent.tier = 'CITY' THEN '    Settlement: ' || l.name || ' (under ' || parent.name || ')'
    ELSE 'Other: ' || l.name
  END as hierarchy
FROM locations l
JOIN gnomi_region gr ON (l.parent_id = gr.region_id OR l.id = gr.region_id)
LEFT JOIN locations parent ON l.parent_id = parent.id
WHERE l.parent_id = gr.region_id OR parent.parent_id = gr.region_id
ORDER BY 
  CASE WHEN l.tier = 'CITY' THEN 1 ELSE 2 END,
  l.name;
