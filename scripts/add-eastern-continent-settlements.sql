-- Add Eastern Continent Settlements
-- All 4 regions with 6 settlements each (24 total)

-- REGNO DI VELENDAR - Settlements (Tier location)

-- Moonbridge (Ponte Luna)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_moonbridge', 'Moonbridge', 
 'Ponte Luna - Elegante ponte commerciale verso territori elfici. Centro diplomatico e di scambio culturale inter-razziale.',
 'location', 'region_velendar', 200, 100, 25,
 true, true, false, true, false, false,
 40, ARRAY['Diplomazia inter-razziale', 'Scambio culturale', 'Commercio elfico', 'Ponte architettonico'],
 18000, '{"access_type":"diplomatic_missions","services":"cultural_exchange","welcome":"inter_racial_diplomats"}', '{}', CURRENT_TIMESTAMP);

-- Vineyard Hills (Colline Vigneto)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_vineyard_hills', 'Vineyard Hills', 
 'Colline Vigneto - Terrazze viticole panoramiche che producono i vini più pregiati del continente. Centro di ricerca agricola.',
 'location', 'region_velendar', 180, 80, 60,
 true, true, false, true, false, false,
 35, ARRAY['Viticoltura pregiata', 'Ricerca agricola', 'Vini di lusso', 'Terrazze panoramiche'],
 12500, '{"access_type":"wine_traders","services":"agricultural_research","products":"luxury_wines"}', '{}', CURRENT_TIMESTAMP);

-- Crystalwood (Bosco Cristallo)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_crystalwood', 'Crystalwood', 
 'Bosco Cristallo - Foresta magica dove gli alberi crescono cristalli naturali. Centro di raccolta componenti magici.',
 'location', 'region_velendar', 250, 120, 30,
 false, false, false, true, false, false,
 25, ARRAY['Componenti magici', 'Ricerca naturale', 'Cristalli naturali', 'Magia della natura'],
 9800, '{"access_type":"licensed_mages","requirements":["magic_permit"],"dangers":"wild_magic_surges"}', '{}', CURRENT_TIMESTAMP);

-- Lightweave (Tessimaluce)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_lightweave', 'Lightweave', 
 'Tessimaluce - Laboratori tessili magici dove si creano abiti incantati con fili di luce pura. Arte tessile suprema.',
 'location', 'region_velendar', 220, 60, 15,
 true, true, false, true, false, false,
 30, ARRAY['Tessuti magici', 'Abiti incantati', 'Fili di luce', 'Arte tessile suprema'],
 8600, '{"access_type":"textile_specialists","services":"enchanted_clothing","clients":"nobility_mages"}', '{}', CURRENT_TIMESTAMP);

-- Scholarsford (Guado Studiosi)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_scholarsford', 'Scholarsford', 
 'Guado Studiosi - Tranquillo centro di educazione secondaria e ricerca. Biblioteca e laboratori per studenti avanzati.',
 'location', 'region_velendar', 190, 140, 20,
 true, true, false, true, false, false,
 35, ARRAY['Educazione secondaria', 'Ricerca accademica', 'Biblioteca specializzata', 'Laboratori studenti'],
 7200, '{"access_type":"students_researchers","services":"secondary_education","atmosphere":"scholarly_quiet"}', '{}', CURRENT_TIMESTAMP);

-- Healer's Glen (Valle Guaritore)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_healers_glen', 'Healer''s Glen', 
 'Valle Guaritore - Valle sacra con sorgenti curative naturali. Centro di formazione medica e ricerca sui metodi di guarigione.',
 'location', 'region_velendar', 160, 110, 5,
 true, true, false, true, false, false,
 30, ARRAY['Sorgenti curative', 'Formazione medica', 'Ricerca guarigione', 'Valle sacra'],
 6400, '{"access_type":"medical_practitioners","services":"healing_research","benefits":"natural_healing_springs"}', '{}', CURRENT_TIMESTAMP);

-- REGNO DI BRYNNAR - Settlements (Tier location)

-- Bearpit (Fossa Orso)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_bearpit', 'Bearpit', 
 'Fossa Orso - Centro di caccia agli orsi e lavorazione pellami. Palestra naturale per guerrieri che vogliono testare la forza.',
 'location', 'region_brynnar', 150, 300, 40,
 true, true, false, false, true, false,
 25, ARRAY['Caccia orsi', 'Lavorazione pellami', 'Allenamento forza', 'Sfide guerriere'],
 8500, '{"access_type":"hunters_warriors","activities":"bear_hunting","training":"strength_endurance"}', '{}', CURRENT_TIMESTAMP);

-- Woodaxe (Asciabosco)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_woodaxe', 'Woodaxe', 
 'Asciabosco - Insediamento di taglialegna nelle foreste di conifere. Centro di lavorazione del legname e gestione forestale.',
 'location', 'region_brynnar', 120, 280, 80,
 true, true, false, true, false, false,
 30, ARRAY['Taglio legname', 'Lavorazione legno', 'Gestione forestale', 'Segherie idrauliche'],
 7200, '{"access_type":"lumberjacks_woodcrafters","industry":"lumber_processing","resources":"conifer_hardwood"}', '{}', CURRENT_TIMESTAMP);

-- Coldspring (Sorgente Fredda)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_coldspring', 'Coldspring', 
 'Sorgente Fredda - Sorgenti termali ghiacciate con proprietà curative uniche. Centro di addestramento alla resistenza al freddo.',
 'location', 'region_brynnar', 100, 320, 120,
 true, false, false, true, false, false,
 20, ARRAY['Sorgenti ghiacciate', 'Cure termali', 'Resistenza freddo', 'Acque curative'],
 6800, '{"access_type":"healers_cold_specialists","benefits":"cold_resistance_training","healing":"ice_water_therapy"}', '{}', CURRENT_TIMESTAMP);

-- Ravencroft (Campo Corvo)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_ravencroft', 'Ravencroft', 
 'Campo Corvo - Stazione di addestramento corvi messaggeri per comunicazioni a lunga distanza. Centro intelligence nordico.',
 'location', 'region_brynnar', 180, 340, 200,
 false, true, false, true, false, false,
 25, ARRAY['Corvi messaggeri', 'Comunicazioni', 'Intelligence', 'Addestramento animali'],
 5400, '{"access_type":"message_couriers","services":"long_distance_communication","network":"raven_post_system"}', '{}', CURRENT_TIMESTAMP);

-- Ironpit (Fossa Ferro)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_ironpit', 'Ironpit', 
 'Fossa Ferro - Miniere di ferro e fucine per armi da guerra. Centro di produzione armamenti per il regno guerriero.',
 'location', 'region_brynnar', 140, 260, -20,
 true, true, false, true, false, false,
 30, ARRAY['Miniere ferro', 'Fucine armi', 'Lavorazione metalli', 'Produzione armamenti'],
 4900, '{"access_type":"smiths_metalworkers","industry":"weapon_forging","products":"war_weapons_tools"}', '{}', CURRENT_TIMESTAMP);

-- Longboat (Drakkarlungo)
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_longboat', 'Longboat', 
 'Drakkarlungo - Cantieri navali specializzati in navi da guerra nordiche. Centro di costruzione flotte per navigazioni estreme.',
 'location', 'region_brynnar', 200, 380, 0,
 true, true, false, true, false, false,
 25, ARRAY['Cantieri navali', 'Navi da guerra', 'Costruzione flotte', 'Navigazione estrema'],
 4100, '{"access_type":"shipbuilders_sailors","industry":"warship_construction","specialization":"ice_resistant_vessels"}', '{}', CURRENT_TIMESTAMP);
