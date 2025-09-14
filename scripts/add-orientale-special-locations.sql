-- Aggiungi Special Locations per Regno di Brynnar

-- Sala degli Eroi Caduti
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_sala_eroi_caduti', 'Sala degli Eroi Caduti', 
 'Sala sacra che onora i guerrieri morti, guida spirituale. Benefici: benedizioni guerriere, restauro onore.',
 'location', 'city_valkhyr', -100, 300, 50,
 true, true, true, true, false, false,
 30, ARRAY['Onore guerriero', 'Benedizioni spirituali', 'Memoria eroica', 'Guida ancestrale'],
 80, '{"access_type":"warrior_pilgrimage","services":"honor_restoration","benefits":"spiritual_strength"}', '{}', CURRENT_TIMESTAMP);

-- Foresta degli Spiriti Lupo
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_foresta_spiriti_lupo', 'Foresta degli Spiriti Lupo', 
 'Foresta sacra abitata da spiriti lupo. Potere: comunicazione spiriti lupo, legame branco, magia caccia.',
 'location', 'city_ironwolf', -150, 350, 100,
 false, false, false, false, true, false,
 15, ARRAY['Spiriti lupo', 'Legame branco', 'Magia caccia', 'Connessione spirituale'],
 200, '{"access_type":"wolf_rider_bond","requirements":["pack_leadership","spiritual_connection"],"power":"wolf_communication"}', '{}', CURRENT_TIMESTAMP);

-- Ghiacciaio dell'Eternità
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_ghiacciaio_eternita', 'Ghiacciaio dell''Eternità', 
 'Ghiacciaio antico con artefatti preservati nel tempo. Contenuto: armi antiche, storia preservata, magia ghiaccio.',
 'location', 'city_frostbeard', -80, 320, 200,
 false, true, false, false, true, false,
 10, ARRAY['Artefatti antichi', 'Preservazione temporale', 'Magia ghiaccio', 'Storia congelata'],
 50, '{"access_type":"archaeological_expedition","requirements":["cold_immunity","climbing_gear"],"treasures":"ancient_artifacts"}', '{}', CURRENT_TIMESTAMP);

-- Arena del Valore
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_arena_valore', 'Arena del Valore', 
 'Grande arena per dimostrare il valore marziale. Eventi: duelli d''onore, competizioni forza, prove guerriere.',
 'location', 'city_valkhyr', -120, 280, 30,
 true, true, true, false, true, false,
 100, ARRAY['Duelli onore', 'Prove marziali', 'Competizioni forza', 'Valore guerriero'],
 500, '{"access_type":"warrior_trials","events":"honor_duels","purpose":"martial_worth_proving"}', '{}', CURRENT_TIMESTAMP);

-- Tempio della Tempesta
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_tempio_tempesta', 'Tempio della Tempesta', 
 'Tempio dedicato alla magia tempesta e controllo meteo. Servizi: addestramento magia tempesta, previsioni.',
 'location', 'city_stormhaven', -50, 380, 80,
 true, true, false, true, false, false,
 25, ARRAY['Magia tempesta', 'Controllo meteo', 'Previsioni tempeste', 'Protezione nautica'],
 120, '{"access_type":"storm_mage_training","services":"weather_prediction","protection":"storm_shields"}', '{}', CURRENT_TIMESTAMP);

-- Sepolcro del Re-Lupo
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_sepolcro_re_lupo', 'Sepolcro del Re-Lupo', 
 'Tomba del leggendario re che si unì ai lupi. Contenuto: artefatti reali, segreti legame lupo, saggezza leadership.',
 'location', 'city_ironwolf', -180, 330, -10,
 false, true, false, true, false, false,
 20, ARRAY['Leggenda re-lupo', 'Artefatti reali', 'Segreti lupo', 'Saggezza leadership'],
 30, '{"access_type":"royal_pilgrimage","requirements":["wolf_pack_leadership","historical_significance"],"wisdom":"leadership_bonding"}', '{}', CURRENT_TIMESTAMP);

-- Special Locations per Territorio degli Elfi Scuri

-- Labirinto delle Menti
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_labirinto_menti', 'Labirinto delle Menti', 
 'Labirinto magico che attacca la mente, rende molti folli. Pericolo: dominazione mentale, follia, memoria perduta.',
 'location', 'city_nalthor', 350, 150, -50,
 false, true, false, false, true, false,
 5, ARRAY['Attacco mentale', 'Rischio follia', 'Dominazione psichica', 'Perdita memoria'],
 10, '{"access_type":"extreme_mental_protection","dangers":"insanity_risk","requirements":["psychic_shields","extreme_caution"]}', '{}', CURRENT_TIMESTAMP);

-- Archivio delle Ombre
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_archivio_ombre', 'Archivio delle Ombre', 
 'Archivio segreto contenente tutta l''intelligence raccolta. Contenuto: segreti mondiali, materiale ricatto.',
 'location', 'city_nalthor', 330, 130, -80,
 false, false, false, true, false, false,
 3, ARRAY['Intelligence segreta', 'Segreti mondiali', 'Materiale ricatto', 'Storie nascoste'],
 15, '{"access_type":"shadow_council_only","clearance":"top_level_spies","content":"world_secrets"}', '{}', CURRENT_TIMESTAMP);

-- Pozzo dell'Oblio
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_pozzo_oblio', 'Pozzo dell''Oblio', 
 'Pozzo che può cancellare memorie o concedere conoscenza dimenticata. Effetti: manipolazione memoria, amnesia pericolosa.',
 'location', 'city_shadowmere', 380, 120, -30,
 false, false, false, false, true, false,
 8, ARRAY['Cancellazione memoria', 'Conoscenza dimenticata', 'Manipolazione mentale', 'Amnesia magica'],
 25, '{"access_type":"memory_mage_ritual","effects":"memory_manipulation","dangers":"dangerous_amnesia"}', '{}', CURRENT_TIMESTAMP);

-- Giardino dei Veleni Eterni
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_giardino_veleni_eterni', 'Giardino dei Veleni Eterni', 
 'Giardino delle piante più mortali esistenti. Risorse: veleni definitivi, antidoti rari, componenti tossici.',
 'location', 'city_whisperdale', 320, 180, 20,
 false, false, false, false, true, false,
 12, ARRAY['Veleni mortali', 'Piante letali', 'Antidoti rari', 'Componenti tossici'],
 40, '{"access_type":"master_poisoner_clearance","requirements":["protection_gear","antidote_specialist"],"resources":"ultimate_poisons"}', '{}', CURRENT_TIMESTAMP);

-- Teatro delle Illusioni
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_teatro_illusioni', 'Teatro delle Illusioni', 
 'Teatro dove le illusioni diventano temporaneamente reali. Spettacoli: illusioni viventi, performance alterano realtà.',
 'location', 'city_thornwall', 400, 100, 40,
 false, false, false, true, false, false,
 30, ARRAY['Illusioni reali', 'Performance magiche', 'Alterazione realtà', 'Arte illusoria'],
 80, '{"access_type":"master_illusionist_invitation","performances":"reality_bending","art":"living_illusions"}', '{}', CURRENT_TIMESTAMP);

-- Cripta dei Traditori
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_cripta_traditori', 'Cripta dei Traditori', 
 'Tomba di elfi scuri che tradirono il loro popolo. Lezioni: conseguenze tradimento, giuramenti lealtà.',
 'location', 'city_nalthor', 360, 140, -60,
 false, true, false, true, false, false,
 15, ARRAY['Storia tradimento', 'Lezioni lealtà', 'Conseguenze morali', 'Redenzione possibile'],
 35, '{"access_type":"historical_pilgrimage","lessons":"betrayal_consequences","purpose":"redemption_seeking"}', '{}', CURRENT_TIMESTAMP);
