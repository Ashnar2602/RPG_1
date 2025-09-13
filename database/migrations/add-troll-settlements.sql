-- Add Troll Territories Minor Settlements (Tier location)

-- Icicle Village - Ice crafting and art
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_icicle_village', 'Icicle Village', 
 'Villaggio Ghiacciolo - Villaggio specializato nella lavorazione artistica del ghiaccio, sculture e espressione artistica dei Troll.',
 'location', 'region_troll_montagne', -360, 590, 450,
 false, true, false, true, false, false,
 12, ARRAY['Lavorazione ghiaccio', 'Sculture artistiche', 'Arte troll', 'Espressione creativa'],
 2100, '{"access_type":"artists_ice_crafters","requirements":["cold_protection"],"services":"ice_crafting_art","specialization":"ice_sculpture"}', '{}', CURRENT_TIMESTAMP);

-- Snowdrift Outpost - Border watch
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_snowdrift_outpost', 'Snowdrift Outpost', 
 'Avamposto Cumulo - Avamposto di sorveglianza dei confini e sistema di allarme precoce per valanghe.',
 'location', 'region_troll_montagne', -320, 640, 550,
 false, false, false, false, true, false,
 8, ARRAY['Sorveglianza confini', 'Allarme valanghe', 'Scout montagna', 'Posto avanzato'],
 1800, '{"access_type":"mountain_scouts","services":"border_watch_avalanche_warning","personnel":"emergency_teams","function":"early_warning"}', '{}', CURRENT_TIMESTAMP);

-- Frostbite Camp - Survival training
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_frostbite_camp', 'Frostbite Camp', 
 'Campo Morsogelato - Campo di addestramento per sopravvivenza in condizioni estreme e adattamento al freddo mortale.',
 'location', 'region_troll_montagne', -460, 580, 350,
 false, true, false, false, true, false,
 10, ARRAY['Addestramento sopravvivenza', 'Condizioni estreme', 'Adattamento freddo', 'Resistenza estrema'],
 1400, '{"access_type":"survival_trainees","services":"extreme_survival_training","specialization":"cold_adaptation","training":"extreme_conditions"}', '{}', CURRENT_TIMESTAMP);

-- Crystalfrost Mine - Ice crystal extraction
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_crystalfrost_mine', 'Crystalfrost Mine', 
 'Miniera Cristalgelo - Miniera per estrazione di cristalli di ghiaccio magico e raccolta di componenti magiche del freddo.',
 'location', 'region_troll_montagne', -410, 570, 300,
 false, true, false, false, true, false,
 8, ARRAY['Estrazione cristalli', 'Ghiaccio magico', 'Componenti magiche', 'Miniera specializzata'],
 1200, '{"access_type":"crystal_specialists","services":"magical_crystal_extraction","products":"ice_magic_components","specialization":"magical_mining"}', '{}', CURRENT_TIMESTAMP);

-- Blizzard''s Rest - Emergency shelter
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_blizzards_rest', 'Blizzard''s Rest', 
 'Riposo Bufera - Rifugio di emergenza per viaggiatori in difficoltà e centro operazioni di soccorso in montagna.',
 'location', 'region_troll_montagne', -390, 610, 400,
 true, true, true, true, false, false,
 15, ARRAY['Rifugio emergenza', 'Soccorso montagna', 'Operazioni rescue', 'Shelter sicuro'],
 900, '{"access_type":"emergency_situations","services":"rescue_operations","function":"emergency_shelter","personnel":"rescue_teams"}', '{}', CURRENT_TIMESTAMP);

-- Permafrost Storage - Frozen storage facility
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_permafrost_storage', 'Permafrost Storage', 
 'Deposito Permafrost - Struttura di conservazione congelata per deposito a lungo termine di beni preziosi e deperibili.',
 'location', 'region_troll_montagne', -430, 590, 250,
 false, true, false, true, false, false,
 8, ARRAY['Conservazione congelata', 'Deposito lungo termine', 'Servizi preservazione', 'Storage contract'],
 600, '{"access_type":"storage_clients","services":"frozen_preservation","requirements":["storage_contracts","valuable_goods"],"specialization":"long_term_storage"}', '{}', CURRENT_TIMESTAMP);
