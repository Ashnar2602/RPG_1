-- Add Eastern Continent Settlements - Part 2
-- ELFI SCURI DI VORYN'DHAL + GNOMI ORIENTALI DI TELDRUN

-- REAME ELFI SCURI DI VORYN'DHAL - Settlements (Tier location)

-- Poisonleaf (Foglia Veleno)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_poisonleaf', 'Poisonleaf', 
 'Foglia Veleno - Laboratori alchemici segreti per produzione veleni letali e antidoti rari. Centro ricerca tossicologica.',
 'location', 'region_elfi_scuri', 350, 200, 10,
 false, false, false, false, true, false,
 15, ARRAY['Produzione veleni', 'Ricerca antidoti', 'Alchimia tossica', 'Laboratori segreti'],
 6200, '{"access_type":"poison_specialists","requirements":["toxicology_clearance"],"dangers":"lethal_compounds"}', '{}', CURRENT_TIMESTAMP);

-- Nightbloom (Fiore Notte)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_nightbloom', 'Nightbloom', 
 'Fiore Notte - Giardini notturni dove crescono piante magiche che fioriscono solo al buio. Raccolta componenti notturni.',
 'location', 'region_elfi_scuri', 380, 180, 5,
 false, false, false, true, false, false,
 20, ARRAY['Piante notturne', 'Componenti magici', 'Giardini oscuri', 'Botanica magica'],
 5800, '{"access_type":"night_botanists","schedule":"nocturnal_only","resources":"dark_magic_components"}', '{}', CURRENT_TIMESTAMP);

-- Silentbrook (Ruscello Silente)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_silentbrook', 'Silentbrook', 
 'Ruscello Silente - Centro di addestramento per magia del silenzio e tecniche stealth avanzate. Scuola assassini.',
 'location', 'region_elfi_scuri', 320, 160, 15,
 false, false, false, false, true, false,
 18, ARRAY['Magia silenzio', 'Addestramento stealth', 'Scuola assassini', 'Tecniche infiltrazione'],
 4900, '{"access_type":"stealth_specialists","training":"silence_magic","skills":"advanced_infiltration"}', '{}', CURRENT_TIMESTAMP);

-- Darkwood (Bosco Scuro)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_darkwood', 'Darkwood', 
 'Bosco Scuro - Foresta di sorveglianza permanente con sentieri nascosti e posti di osservazione. Rete intelligence forestale.',
 'location', 'region_elfi_scuri', 400, 220, 25,
 false, false, false, false, true, false,
 20, ARRAY['Sorveglianza forestale', 'Sentieri nascosti', 'Posti osservazione', 'Intelligence network'],
 4300, '{"access_type":"forest_rangers","surveillance":"continuous_monitoring","network":"hidden_watchtowers"}', '{}', CURRENT_TIMESTAMP);

-- Ravenspire (Guglia Corvo)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_ravenspire', 'Ravenspire', 
 'Guglia Corvo - Torre di intercettazione comunicazioni e decrittazione codici. Centro di intelligence e spionaggio.',
 'location', 'region_elfi_scuri', 360, 240, 150,
 false, false, false, true, false, false,
 15, ARRAY['Intercettazione comunicazioni', 'Decrittazione codici', 'Intelligence center', 'Torre segnali'],
 3700, '{"access_type":"intelligence_agents","services":"code_breaking","security":"maximum_clearance"}', '{}', CURRENT_TIMESTAMP);

-- Misthollow (Cava Nebbia)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_misthollow', 'Misthollow', 
 'Cava Nebbia - Valle perpetuamente avvolta nella nebbia dove si studiano illusioni e incantesimi di occultamento.',
 'location', 'region_elfi_scuri', 340, 140, 30,
 false, false, false, true, false, false,
 12, ARRAY['Nebbia perpetua', 'Magia illusioni', 'Occultamento', 'Ricerca concealment'],
 3200, '{"access_type":"illusion_mages","environment":"perpetual_mist","research":"concealment_magic"}', '{}', CURRENT_TIMESTAMP);

-- REGNO GNOMI ORIENTALI DI TELDRUN - Settlements (Tier location)

-- Springcoil (Mollaelica)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_springcoil', 'Springcoil', 
 'Mollaelica - Officine specializzate in produzione molle e meccanismi elastici di precisione. Centro ingegneria tensione.',
 'location', 'region_gnomi', 50, 250, 180,
 true, true, false, true, false, false,
 25, ARRAY['Produzione molle', 'Meccanismi elastici', 'Ingegneria tensione', 'Precision springs'],
 7800, '{"access_type":"mechanical_engineers","specialization":"spring_mechanisms","precision":"ultra_high"}', '{}', CURRENT_TIMESTAMP);

-- Measuredepth (Profondità Misurata)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_measuredepth', 'Measuredepth', 
 'Profondità Misurata - Centro di rilevamento topografico e cartografia di precisione. Mappe del mondo più accurate.',
 'location', 'region_gnomi', 30, 280, 200,
 true, true, false, true, false, false,
 30, ARRAY['Rilevamento topografico', 'Cartografia precisione', 'Surveying avanzato', 'Mappe accurate'],
 6900, '{"access_type":"surveyors_cartographers","services":"precision_mapping","accuracy":"meter_level"}', '{}', CURRENT_TIMESTAMP);

-- Finewheel (Ruota Fine)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_finewheel', 'Finewheel', 
 'Ruota Fine - Laboratori per taglio ingranaggi e produzione ruote di precisione. Meccanica circolare perfetta.',
 'location', 'region_gnomi', 80, 220, 160,
 true, true, false, true, false, false,
 25, ARRAY['Taglio ingranaggi', 'Ruote precisione', 'Meccanica circolare', 'Gear cutting'],
 6200, '{"access_type":"precision_crafters","specialization":"gear_cutting","tolerance":"micro_precision"}', '{}', CURRENT_TIMESTAMP);

-- Brightlens (Lente Chiara)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_brightlens', 'Brightlens', 
 'Lente Chiara - Officine di levigatura lenti e produzione strumenti ottici. Telescopi e microscopi di qualità suprema.',
 'location', 'region_gnomi_teldrun', 60, 300, 220,
 true, true, false, true, false, false,
 20, ARRAY['Levigatura lenti', 'Strumenti ottici', 'Telescopi', 'Microscopi precision'],
 5600, '{"access_type":"optical_specialists","products":"precision_optics","quality":"supreme_clarity"}', '{}', CURRENT_TIMESTAMP);

-- Soundwave (Ondasonora)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_soundwave', 'Soundwave', 
 'Ondasonora - Laboratori di ricerca acustica e ingegneria del suono. Sistemi di comunicazione e amplificazione.',
 'location', 'region_gnomi_teldrun', 40, 240, 190,
 true, true, false, true, false, false,
 22, ARRAY['Ricerca acustica', 'Ingegneria suono', 'Comunicazione', 'Amplificazione'],
 5100, '{"access_type":"sound_engineers","research":"acoustic_engineering","applications":"long_distance_communication"}', '{}', CURRENT_TIMESTAMP);

-- Tunneldeep (Tunnel Profondo)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_tunneldeep', 'Tunneldeep', 
 'Tunnel Profondo - Stazione di manutenzione del Grande Tunnel verso il continente occidentale. Hub trasporti sotterranei.',
 'location', 'region_gnomi_teldrun', 20, 260, -50,
 true, true, false, true, false, false,
 30, ARRAY['Manutenzione tunnel', 'Trasporti sotterranei', 'Ingegneria underground', 'Hub intercontinentale'],
 4500, '{"access_type":"tunnel_workers","connections":"western_continent","transport":"underground_network"}', '{}', CURRENT_TIMESTAMP);
