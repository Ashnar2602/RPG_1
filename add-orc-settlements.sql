-- Add Orc Territory Minor Settlements (Tier 3)

-- Treeshade Village
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_treeshade_village', 'Treeshade Village', 
 'Villaggio Ombraalbero - Posto di scambio pacifico e territorio neutrale. Centro di commercio inter-tribale.',
 'location', 'region_orchi', -1080, -120, 0,
 true, false, false, true, false, false,
 50, ARRAY['Territorio neutrale', 'Commercio pacifico', 'Scambi inter-tribali', 'Zona sicura'],
 4500, '{"access_type":"neutral_zone","services":"peaceful_trading","caution":"traders_welcomed_carefully"}', '{}', CURRENT_TIMESTAMP);

-- Riverclaw Outpost
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_riverclaw_outpost', 'Riverclaw Outpost', 
 'Avamposto Artigliofiume - Controllo fluviale, pesca e trasporto via acqua. Base per pescatori orcheschi.',
 'location', 'region_orchi', -1200, -130, 0,
 false, false, false, true, false, false,
 50, ARRAY['Controllo fluviale', 'Pesca specializzata', 'Trasporti acquatici', 'Guide fluviali'],
 3200, '{"access_type":"river_travelers","requirements":["fishing_permits"],"services":"boat_transport"}', '{}', CURRENT_TIMESTAMP);

-- Bonecrusher Mine
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_bonecrusher_mine', 'Bonecrusher Mine', 
 'Miniera Spezzaossa - Estrazione di pietra e metalli. Condizioni di lavoro pericolose con manodopera orchesca.',
 'location', 'region_orchi', -1160, -180, -50,
 false, false, false, false, false, false,
 50, ARRAY['Estrazione mineraria', 'Metalli grezzi', 'Condizioni pericolose', 'Produzione utensili'],
 2800, '{"access_type":"mining_specialists","danger":"dangerous_working_conditions","workforce":"orc_laborers"}', '{}', CURRENT_TIMESTAMP);

-- Thornwall Camp
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_thornwall_camp', 'Thornwall Camp', 
 'Campo Murospin - Pattugliamento confini e sistema di allarme precoce. Checkpoint militare orchesco.',
 'location', 'region_orchi', -1000, -120, 20,
 false, false, false, false, true, false,
 50, ARRAY['Pattuglia confini', 'Allarme precoce', 'Checkpoint militare', 'Sorveglianza stranieri'],
 2100, '{"access_type":"military_checkpoint","attitude":"very_suspicious_outsiders","purpose":"border_patrol"}', '{}', CURRENT_TIMESTAMP);

-- Wildmeat Market
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_wildmeat_market', 'Wildmeat Market', 
 'Mercato Carneselvaggia - Commercio di cibo e lavorazione carne esotica. Centro del commercio alimentare.',
 'location', 'region_orchi', -1130, -160, 0,
 false, false, false, true, false, false,
 50, ARRAY['Commercio alimentare', 'Carne esotica', 'Lavorazione cacciagione', 'Mercanti viaggiatori'],
 1900, '{"access_type":"meat_traders","clientele":"exotic_food_enthusiasts","services":"food_processing"}', '{}', CURRENT_TIMESTAMP);

-- Spiritdance Clearing
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_spiritdance_clearing', 'Spiritdance Clearing', 
 'Radura Danzaspiriti - Cerimonie religiose e comunicazione con spiriti. Centro spirituale orchesco.',
 'location', 'region_orchi', -1170, -110, 10,
 false, false, false, true, false, false,
 50, ARRAY['Cerimonie religiose', 'Comunicazione spiriti', 'Sciamani orcheschi', 'Rituali tribali'],
 1500, '{"access_type":"shamans_spiritual_seekers_only","purpose":"religious_ceremonies","spirits":"nature_spirits"}', '{}', CURRENT_TIMESTAMP);
