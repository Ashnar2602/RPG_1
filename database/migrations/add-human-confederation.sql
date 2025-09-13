-- Add Human Confederation (Confederazione Umana di Kaerdan) to Western Continent

-- First, create the region
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('region_umani_kaerdan', 'Confederazione Umana di Kaerdan', 
 'Centro-sud del continente, confederazione di città-stato umane unite da accordi commerciali e militari. Centro politico e commerciale.',
 'region', 'continent_occidentale', -200, -100, 0,
 true, true, true, true, false, false,
 50, ARRAY['Confederazione città-stato', 'Centro politico', 'Hub commerciale', 'Diplomazia internazionale'],
 450000, '{"access_type":"diplomatic_commercial","restrictions":"standard_controls","culture":"confederate"}', '{}', CURRENT_TIMESTAMP);

-- Add main cities (Tier 1 and 2)

-- Dhorvar (Capital - Tier 1) 
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_dhorvar', 'Dhorvar', 
 'Capitale della confederazione, centro politico e diplomatico. Sede del Consiglio delle Città-Stato e delle ambasciate internazionali.',
 'city', 'region_umani_kaerdan', -200, -100, 0,
 true, true, true, true, false, false,
 50, ARRAY['Capitale confederazione', 'Consiglio Città-Stato', 'Ambasciate internazionali', 'Centro diplomatico'],
 120000, '{"access_type":"diplomatic_hub","services":"international_embassies","governance":"confederate_council"}', '{}', CURRENT_TIMESTAMP);

-- Goldport
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_goldport', 'Goldport', 
 'Principal porto commerciale della confederazione, hub mercantile con collegamenti marittimi verso tutti i continenti.',
 'city', 'region_umani_kaerdan', -150, -150, 0,
 true, true, true, true, false, false,
 50, ARRAY['Porto principale', 'Hub mercantile', 'Commercio marittimo', 'Collegamenti intercontinentali'],
 85000, '{"access_type":"commercial_port","services":"international_trade","connections":"all_continents"}', '{}', CURRENT_TIMESTAMP);

-- Ironhold
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_ironhold', 'Ironhold', 
 'Centro industriale della confederazione, estrazione mineraria, lavorazione metalli e produzione di armi e armature.',
 'city', 'region_umani_kaerdan', -250, -80, 0,
 true, true, true, true, false, false,
 50, ARRAY['Centro industriale', 'Estrazione mineraria', 'Lavorazione metalli', 'Produzione armamenti'],
 67000, '{"access_type":"industrial_center","services":"mining_metallurgy","products":"weapons_armor"}', '{}', CURRENT_TIMESTAMP);

-- Farmlands
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('city_farmlands', 'Farmlands', 
 'Principale centro agricolo della confederazione, terre fertili che forniscono cibo per tutta la regione.',
 'city', 'region_umani_kaerdan', -180, -60, 0,
 true, true, true, true, false, false,
 50, ARRAY['Centro agricolo', 'Terre fertili', 'Produzione alimentare', 'Granai confederazione'],
 52000, '{"access_type":"agricultural_center","services":"food_production","supplies":"entire_confederation"}', '{}', CURRENT_TIMESTAMP);
