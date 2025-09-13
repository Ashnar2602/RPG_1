-- Add Elven Domain Minor Settlements (Tier 3)

-- Greenwood Market
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_greenwood_market', 'Greenwood Market', 
 'Mercato del Bosco Verde - Unico centro commerciale elfico aperto ai non-elfi. Hub di scambio inter-razziale.',
 'location', 'region_elfi_altherys', -820, 250, 0,
 true, false, false, true, false, false,
 50, ARRAY['Commercio inter-razziale', 'Accesso libero', 'Mercanti elfici', 'Scambio culturale'],
 7500, '{"access_type":"registered_merchants","services":"open_to_non_elves","trade":"inter_racial_hub"}', '{}', CURRENT_TIMESTAMP);

-- Thornwall
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_thornwall', 'Thornwall', 
 'Muro di Spine - Posto di controllo al confine meridionale. Difesa militare del territorio elfico.',
 'location', 'region_elfi_altherys', -790, 220, 0,
 false, false, false, true, false, false,
 50, ARRAY['Controllo confini', 'Difesa militare', 'Checkpoint elfico', 'Sorveglianza'],
 5000, '{"access_type":"military_checkpoint","controls":"rigorous","purpose":"border_defense"}', '{}', CURRENT_TIMESTAMP);

-- Moonwell Village
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_moonwell_village', 'Moonwell Village', 
 'Villaggio Pozzo Lunare - Centro spirituale per druidi elfici. Comunicazione diretta con spiriti della natura.',
 'location', 'region_elfi_altherys', -770, 380, 0,
 false, false, false, true, false, false,
 50, ARRAY['Centro spirituale', 'Druidi elfici', 'Spiriti natura', 'Pozzo lunare sacro'],
 4600, '{"access_type":"druids_nature_spirits_only","spiritual":"high_level","communion":"nature_spirits"}', '{}', CURRENT_TIMESTAMP);

-- Silverleaf
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_silverleaf', 'Silverleaf', 
 'Foglia d''Argento - Centro di produzione artistica elfica. Oggetti d''arte, gioielli e manufatti di qualità suprema.',
 'location', 'region_elfi_altherys', -830, 340, 0,
 false, false, false, true, false, false,
 50, ARRAY['Arte elfica', 'Gioielleria suprema', 'Manufatti pregiati', 'Artigiani maestri'],
 4100, '{"access_type":"artists_collectors","requirements":["invitation_only"],"products":"supreme_quality"}', '{}', CURRENT_TIMESTAMP);

-- Shadowmere
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_elven_shadowmere', 'Shadowmere', 
 'Lago Ombra Elfico - Centro di magie ombra e illusioni elfiche. Creature magiche e misticismo avanzato.',
 'location', 'region_elfi_altherys', -760, 290, 0,
 false, false, false, true, false, false,
 50, ARRAY['Magie ombra', 'Illusioni elfiche', 'Creature magiche', 'Misticismo avanzato'],
 3700, '{"access_type":"specialized_shadow_mages","selection":"very_selective","magic":"shadow_illusion"}', '{}', CURRENT_TIMESTAMP);

-- Windsong
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_windsong', 'Windsong', 
 'Canto del Vento - Villaggio di bardi e menestrelli elfici. Centro culturale per musica e arti performative.',
 'location', 'region_elfi_altherys', -810, 360, 0,
 false, false, false, true, false, false,
 50, ARRAY['Bardi elfici', 'Menestrelli', 'Musica magica', 'Arti performative'],
 4800, '{"access_type":"artists_musicians","culture":"elven_music","services":"performance_arts"}', '{}', CURRENT_TIMESTAMP);
