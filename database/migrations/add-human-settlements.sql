-- Add Human Confederation Minor Settlements (Tier 3)

-- Crossroads Inn - Hub viaggiatori  
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_crossroads_inn', 'Crossroads Inn', 
 'Locanda Crocevia - Hub per viaggiatori, informazioni e servizi strada. Aperto 24/7, safe haven per tutti i viaggiatori.',
 'location', 'region_umani_kaerdan', -220, -120, 0,
 true, true, true, true, false, false,
 50, ARRAY['Hub viaggiatori', 'Informazioni', 'Servizi strada', 'Safe haven 24/7'],
 6000, '{"access_type":"open_travelers","services":"24_7_safe_haven","information":"travel_hub"}', '{}', CURRENT_TIMESTAMP);

-- Hilltown - Centro tessile
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_hilltown', 'Hilltown', 
 'Città Collina - Centro tessile specializato in lavorazione lana e pellame, controlli sanitari per bestiame.',
 'location', 'region_umani_kaerdan', -160, -80, 0,
 true, true, true, true, false, false,
 50, ARRAY['Centro tessile', 'Lavorazione lana', 'Pellame', 'Controlli sanitari'],
 9100, '{"access_type":"textile_workers","services":"wool_leather_processing","controls":"health_inspections"}', '{}', CURRENT_TIMESTAMP);

-- Woodhaven - Insediamento boscaioli
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_woodhaven', 'Woodhaven', 
 'Rifugio del Bosco - Insediamento di boscaioli e ranger, taglio legname e caccia. Permessi required per attività forestali.',
 'location', 'region_umani_kaerdan', -280, -40, 0,
 true, true, true, true, false, false,
 50, ARRAY['Boscaioli', 'Ranger', 'Taglio legname', 'Caccia regolamentata'],
 6700, '{"access_type":"foresters_hunters","requirements":["forestry_permits"],"services":"logging_hunting"}', '{}', CURRENT_TIMESTAMP);

-- Arena dei Campioni - Complesso sportivo
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_arena_campioni', 'Arena dei Campioni', 
 'Complesso sportivo per spettacoli, tornei, duelli e feste. Accesso tramite biglietti per spettatori o qualifiche per partecipanti.',
 'location', 'region_umani_kaerdan', -200, -130, 0,
 true, true, true, true, true, false,
 100, ARRAY['Complesso sportivo', 'Tornei', 'Duelli', 'Spettacoli'],
 2500, '{"access_type":"ticketed_events","requirements":["spectator_tickets","participant_qualifications"],"events":"tournaments_shows"}', '{}', CURRENT_TIMESTAMP);

-- Tomba del Re Perduto - Dungeon storico
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_tomba_re_perduto', 'Tomba del Re Perduto', 
 'Dungeon/Tomba antica con tesori, trappole e guardiani non-morti. Accesso limitato ad avventurieri con permesso archeologico.',
 'location', 'region_umani_kaerdan', -240, -160, -50,
 false, true, false, false, true, false,
 8, ARRAY['Dungeon storico', 'Tesori antichi', 'Trappole', 'Guardiani non-morti'],
 0, '{"access_type":"archaeological_permit","dangers":"traps_undead_guardians","rewards":"ancient_treasures"}', '{}', CURRENT_TIMESTAMP);

-- Ponte del Giuramento - Sito diplomatico
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('settlement_ponte_giuramento', 'Ponte del Giuramento', 
 'Sito storico per accordi internazionali, cerimonie e trattati. Accesso limitato a diplomatici e delegazioni ufficiali.',
 'location', 'region_umani_kaerdan', -190, -110, 0,
 false, true, true, true, false, false,
 20, ARRAY['Sito storico', 'Accordi internazionali', 'Cerimonie', 'Trattati diplomatici'],
 500, '{"access_type":"diplomatic_only","services":"international_treaties","ceremonies":"official_delegations"}', '{}', CURRENT_TIMESTAMP);
