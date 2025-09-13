-- Add Zar'Kaan Desert (Deserto Zar'Kaan delle Sabbie Ardenti) to Western Continent

-- First, create the region
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('region_zarkaan_deserto', 'Deserto Zar''Kaan delle Sabbie Ardenti', 
 'Estremo sud del continente, deserto infinito con dune, oasi nascoste e tempeste di sabbia. Dimora del popolo Zar''kaan e magia del fuoco.',
 'region', 'continent_occidentale', -300, -400, 0,
 false, true, false, false, true, false,
 25, ARRAY['Deserto infinito', 'Dune ardenti', 'Oasi nascoste', 'Magia del fuoco'],
 183900, '{"access_type":"desert_survival_mandatory","restrictions":"lethal_heat_cold","culture":"desert_nomadic","equipment":"desert_survival_gear"}', '{}', CURRENT_TIMESTAMP);

-- Add main cities (Tier city)

-- Sirr'Takhal (Capital - Tier 1)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_sirr_takhal', 'Sirr''Takhal', 
 'Perla del Deserto - Capitale semi-sotterranea con cupole dorate e sistemi di raffreddamento. Sede del Consiglio dei Signori del Deserto.',
 'city', 'region_zarkaan_deserto', -300, -400, -20,
 false, true, false, true, false, false,
 50, ARRAY['Città semi-sotterranea', 'Cupole dorate', 'Sistemi raffreddamento', 'Consiglio Signori Deserto'],
 93000, '{"access_type":"official_permits","requirements":["desert_survival_gear"],"services":"all_services_luxury_goods","governance":"council_merchant_princes"}', '{}', CURRENT_TIMESTAMP);

-- Mirage City (Trading Hub)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_mirage_city', 'Mirage City', 
 'Città Miraggio - Oasi maggiore che appare e scompare come un miraggio. Hub commerciale e centro di ricerca magica delle illusioni.',
 'city', 'region_zarkaan_deserto', -250, -350, 0,
 false, false, false, true, false, false,
 30, ARRAY['Oasi maggiore', 'Effetto miraggio', 'Hub commerciale', 'Ricerca magia illusioni'],
 35000, '{"access_type":"caravan_membership","requirements":["navigation_skills"],"services":"caravan_supplies_magical_items","specialization":"illusion_magic"}', '{}', CURRENT_TIMESTAMP);

-- Sunspear Fortress (Military Stronghold)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_sunspear_fortress', 'Sunspear Fortress', 
 'Fortezza Lanciasolea - Fortezza militare strategica su oasi, accademia di magia del fuoco e addestramento guerrieri.',
 'city', 'region_zarkaan_deserto', -350, -450, 50,
 false, true, false, false, true, false,
 25, ARRAY['Fortezza strategica', 'Accademia magia fuoco', 'Addestramento guerrieri', 'Elementali fuoco'],
 28000, '{"access_type":"military_invitation","requirements":["fire_resistance"],"services":"fire_magic_training","specialization":"elemental_binding"}', '{}', CURRENT_TIMESTAMP);

-- Crystal Sands Market (Trade Hub)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_crystal_sands_market', 'Crystal Sands Market', 
 'Mercato Sabbie Cristallo - Grande oasi con posto commerciale permanente, lavorazione cristalli e beni di lusso internazionali.',
 'city', 'region_zarkaan_deserto', -280, -380, 0,
 true, true, true, true, false, false,
 40, ARRAY['Oasi grande', 'Commercio permanente', 'Lavorazione cristalli', 'Beni lusso internazionali'],
 32000, '{"access_type":"registered_traders","requirements":["valuable_goods"],"services":"crystal_processing_banking","trade":"international_commerce"}', '{}', CURRENT_TIMESTAMP);
