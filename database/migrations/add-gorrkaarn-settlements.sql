-- Add Gorr'Kaarn Lands Minor Settlements (Tier location)

-- Ragehammer Village - Specialized weapon crafting
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_ragehammer_village', 'Ragehammer Village', 
 'Villaggio Martelloira - Insediamento specializato nella forgiatura di armi e produzione di utensili per i guerrieri Gorr''kaarn.',
 'location', 'region_gorrkaarn_cime', -570, 390, 180,
 false, true, false, false, true, false,
 15, ARRAY['Forgiatura specializzata', 'Produzione armi', 'Fabbri esperti', 'Utensili guerra'],
 5200, '{"access_type":"weapon_specialists","services":"specialized_weapon_crafting","requirements":["valuable_materials"],"trade":"weapons_tools"}', '{}', CURRENT_TIMESTAMP);

-- Cliffdweller Outpost - Mountain scouting
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_cliffdweller_outpost', 'Cliffdweller Outpost', 
 'Avamposto Abitarupi - Avamposto montano per ricognizione, controllo valanghe e guide per scalatori esperti.',
 'location', 'region_gorrkaarn_cime', -640, 440, 400,
 false, false, false, false, true, false,
 12, ARRAY['Ricognizione montana', 'Controllo valanghe', 'Guide scalata', 'Avamposto strategico'],
 3800, '{"access_type":"mountain_explorers","services":"climbing_guides_scouting","specialties":["avalanche_control"],"terrain":"extreme_altitude"}', '{}', CURRENT_TIMESTAMP);

-- Bonegrinder Camp - Food processing
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_bonegrinder_camp', 'Bonegrinder Camp', 
 'Campo Macinaossa - Campo specializato nella lavorazione della carne, artigianato dell''osso e concia delle pelli.',
 'location', 'region_gorrkaarn_cime', -590, 370, 120,
 false, true, false, false, true, false,
 15, ARRAY['Lavorazione carne', 'Artigianato osso', 'Concia pelli', 'Processamento cibo'],
 2900, '{"access_type":"food_traders_crafters","services":"meat_processing_bone_crafting","products":["leather_goods","bone_materials"],"specialization":"food_processing"}', '{}', CURRENT_TIMESTAMP);

-- Stormwatch Tower - Weather monitoring
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_stormwatch_tower', 'Stormwatch Tower', 
 'Torre Guardiatempesta - Torre di osservazione per monitoraggio meteorologico, relay di segnali e allarme precoce.',
 'location', 'region_gorrkaarn_cime', -610, 450, 350,
 false, true, false, true, false, false,
 8, ARRAY['Monitoraggio meteo', 'Relay segnali', 'Allarme precoce', 'Torre osservazione'],
 2100, '{"access_type":"weather_specialists","services":"weather_monitoring_communications","functions":["signal_relay","early_warning"],"strategic":"high_altitude"}', '{}', CURRENT_TIMESTAMP);

-- Windcutter Pass - Mountain pass control
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_windcutter_pass', 'Windcutter Pass', 
 'Passo Tagliavent - Controllo del passo montano strategico con riscossione pedaggi e checkpoint di sicurezza.',
 'location', 'region_gorrkaarn_cime', -580, 410, 250,
 true, true, false, false, true, false,
 10, ARRAY['Controllo passo', 'Riscossione pedaggi', 'Checkpoint sicurezza', 'Passaggio strategico'],
 1700, '{"access_type":"travelers_with_tribute","services":"mountain_crossing","requirements":["crossing_permits","tribute_payment"],"control":"toll_collection"}', '{}', CURRENT_TIMESTAMP);

-- Battlehorn Cemetery - Warrior burial ground
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_battlehorn_cemetery', 'Battlehorn Cemetery', 
 'Cimitero Cornoguerra - Sacro campo di sepoltura per guerrieri caduti, luogo di venerazione degli antenati e cerimonie spirituali.',
 'location', 'region_gorrkaarn_cime', -630, 390, 200,
 false, true, false, true, false, false,
 5, ARRAY['Sepoltura guerrieri', 'Venerazione antenati', 'Cerimonie spirituali', 'Sito sacro'],
 800, '{"access_type":"family_spiritual_only","services":"warrior_burial_ceremonies","restrictions":"sacred_ground","access":["family_members","spiritual_ceremonies"]}', '{}', CURRENT_TIMESTAMP);
