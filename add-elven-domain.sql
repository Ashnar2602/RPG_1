-- Add Elven Domain (Dominio Elfico di Altherys) to Western Continent

-- First, create the region
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('region_elfi_altherys', 'Dominio Elfico di Altherys', 
 'Nord-ovest del continente, foreste temperate secolari. Dominio degli alti elfi con foreste sacre e magia naturale.',
 'region', 'continent_occidentale', -800, 300, 0,
 false, false, false, true, false, false,
 50, ARRAY['Foreste secolari', 'Magia naturale', 'Primavera perpetua', 'Conoscenza antica'],
 180000, '{"access_type":"elven_guide_required","restrictions":"very_selective","culture":"ceremonious"}', '{}', CURRENT_TIMESTAMP);

-- Add main cities (Tier 1 and 2)

-- Elarion (Capital - Tier 1)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_elarion', 'Elarion', 
 'Cuore del Bosco - Capitale elfica costruita come città-albero integrata nella natura. Sede del Consiglio delle Cinque Casate.',
 'city', 'region_elfi_altherys', -800, 300, 50,
 false, true, false, true, false, false,
 50, ARRAY['Città-albero', 'Costruzioni naturali', 'Consiglio Cinque Casate', 'Arte elfica suprema'],
 107000, '{"access_type":"official_invitation","requirements":["elven_escort_mandatory"],"services":"ceremonious_style"}', '{}', CURRENT_TIMESTAMP);

-- Silvermoon
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_silvermoon', 'Silvermoon', 
 'Luna d''Argento - Centro religioso sul lago sacro con città su palafitte arboree. Osservatorio astronomico elfico.',
 'city', 'region_elfi_altherys', -750, 350, 20,
 false, false, false, true, false, false,
 50, ARRAY['Lago sacro', 'Palafitte arboree', 'Magia lunare', 'Osservatorio astronomico'],
 37000, '{"access_type":"religious_pilgrims","requirements":["religious_references"],"services":"healing_magic"}', '{}', CURRENT_TIMESTAMP);

-- Whisperwind
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_whisperwind', 'Whisperwind', 
 'Vento Sussurrante - Insediamento semi-nomadico nella foresta profonda. Guardiani della natura e maestri scout.',
 'city', 'region_elfi_altherys', -850, 280, 0,
 false, false, false, true, false, false,
 50, ARRAY['Semi-nomadico', 'Foresta profonda', 'Guardiani natura', 'Maestria scout'],
 30000, '{"access_type":"elven_guides_essential","requirements":["naturalist_permits"],"services":"ranger_training"}', '{}', CURRENT_TIMESTAMP);

-- Starfall Citadel
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_starfall_citadel', 'Starfall Citadel', 
 'Cittadella Stellacadente - Torre-albero magica con biblioteca vivente. Centro di ricerca magica e educazione superiore.',
 'city', 'region_elfi_altherys', -780, 320, 100,
 false, false, false, true, false, false,
 50, ARRAY['Torre-albero magica', 'Biblioteca vivente', 'Ricerca magica', 'Università elfica'],
 24000, '{"access_type":"registered_mages","alternatives":["accepted_students"],"services":"magical_university"}', '{}', CURRENT_TIMESTAMP);
