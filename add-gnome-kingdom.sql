-- Add Gnome Kingdom (Reino Gnomesco di Nôr-Velyr) to Western Continent

-- First, create the region
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('region_gnomi_occidentali', 'Regno Gnomesco di Nôr-Velyr', 
 'Ovest su colline e altipiani rocciosi. Regno degli gnomi inventori e ingegneri, con meccanismi giganti integrati nell''architettura.',
 'region', 'continent_occidentale', -1300, -200, 0,
 true, false, false, true, false, false,
 50, ARRAY['Invenzioni straordinarie', 'Meccanismi giganti', 'Ricerca avanzata', 'Università tecnica'],
 275000, '{}', '{}', CURRENT_TIMESTAMP);

-- Add main cities (Tier 2)

-- Nôr-Velyr (Capital - Tier 1 actually, but we'll make it a special city)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_nor_velyr', 'Nôr-Velyr', 
 'Cuore degli Ingranaggi - Capitale gnomesca con meccanismi giganti integrati nell''architettura. Sede del Consiglio dei Grandi Inventori.',
 'city', 'region_gnomi_occidentali', -1300, -200, 0,
 false, true, false, true, false, false,
 50, ARRAY['Consiglio Grandi Inventori', 'Meccanismi architettonici', 'Università tecnica', 'Laboratori supremi'],
 143000, '{"access_type":"inventors_scholars","requirements":["projects_or_references"],"clearance":"technical_aptitude"}', '{}', CURRENT_TIMESTAMP);

-- Gearwood
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_gearwood', 'Gearwood', 
 'Bosco degli Ingranaggi - Foresta con alberi meccanici artificiali. Centro di produzione industriale e automazione.',
 'city', 'region_gnomi_occidentali', -1350, -150, 0,
 false, false, false, true, false, false,
 50, ARRAY['Alberi meccanici', 'Produzione automatizzata', 'Automi avanzati', 'Fabbriche automatizzate'],
 42000, '{"access_type":"qualified_technicians","requirements":["safety_clearance"],"services":"automated_production"}', '{}', CURRENT_TIMESTAMP);

-- Crystalspire
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_crystalspire', 'Crystalspire', 
 'Guglia di Cristallo - Torre cristallina che catalizza energia magica. Centro di ricerca energetica avanzata.',
 'city', 'region_gnomi_occidentali', -1250, -180, 50,
 false, false, false, true, false, false,
 50, ARRAY['Torre cristallina', 'Catalizzazione energia', 'Ricerca energetica', 'Sistemi di potenza'],
 38000, '{"access_type":"mage_engineers","requirements":["specialist_certification","heavy_insurance"],"danger":"energy_experiments"}', '{}', CURRENT_TIMESTAMP);

-- Clockwork
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_clockwork', 'Clockwork', 
 'Orologeria - Città che è essa stessa un orologio gigante. Centro di precisione, misurazioni e strumenti.',
 'city', 'region_gnomi_occidentali', -1280, -240, 0,
 false, false, false, true, false, false,
 50, ARRAY['Città-orologio gigante', 'Precisione assoluta', 'Strumenti navigazione', 'Osservazioni celesti'],
 35000, '{"access_type":"precision_artisans","requirements":["mathematical_aptitude"],"services":"instruments_maps"}', '{}', CURRENT_TIMESTAMP);
