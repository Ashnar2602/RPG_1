-- Remove duplicate empty Archipelago
DELETE FROM locations WHERE id = 'continent_arcipelago';

-- Verify remaining Archipelagos
SELECT id, name, created_at, 
       (SELECT COUNT(*) FROM locations children WHERE children.parent_id = w.id) as children_count
FROM locations w 
WHERE name = 'Arcipelago Centrale' 
AND tier = 'CONTINENT';
