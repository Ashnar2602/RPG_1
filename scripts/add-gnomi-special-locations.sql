-- Special Locations per Regno degli Gnomi Orientali di Teldrun

-- Il Grande Orologio del Mondo
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_grande_orologio_mondo', 'Il Grande Orologio del Mondo', 
 'Meccanismo ad orologeria massiccio che traccia i fusi orari mondiali. Funzione: coordinazione tempo globale, aiuto navigazione.',
 'location', 'city_teldrun', 100, 200, 120,
 false, true, false, true, false, false,
 10, ARRAY['Coordinazione temporale', 'Navigazione globale', 'Meccanica di precisione', 'Magia temporale'],
 25, '{"access_type":"master_clockmaker_clearance","function":"global_time_coordination","services":"navigation_aid"}', '{}', CURRENT_TIMESTAMP);

-- Archivio Tecnico Universale
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_archivio_tecnico_universale', 'Archivio Tecnico Universale', 
 'Archivio completo di tutta la conoscenza tecnica. Contenuto: tutti i progetti, manuali tecnici, soluzioni ingegneristiche.',
 'location', 'city_teldrun', 120, 180, 80,
 false, false, false, true, false, false,
 15, ARRAY['Conoscenza tecnica completa', 'Progetti universali', 'Manuali ingegneristici', 'Soluzioni innovative'],
 40, '{"access_type":"master_engineer_clearance","content":"all_technical_knowledge","access":"inventors_scholars"}', '{}', CURRENT_TIMESTAMP);

-- Fucina del Mithril Levigato
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_fucina_mithril_levigato', 'Fucina del Mithril Levigato', 
 'Unica fucina capace di lavorare il mithril raffinato perfettamente. Prodotti: oggetti mithril perfetti, strumenti precisione.',
 'location', 'city_copperwork', 80, 220, 60,
 false, false, false, true, false, false,
 8, ARRAY['Lavorazione mithril', 'Qualità leggendaria', 'Strumenti perfetti', 'Artigianato supremo'],
 20, '{"access_type":"master_smith_clearance","products":"perfect_mithril_items","quality":"legendary"}', '{}', CURRENT_TIMESTAMP);

-- Osservatorio delle Stelle Meccaniche
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_osservatorio_stelle_meccaniche', 'Osservatorio delle Stelle Meccaniche', 
 'Osservatorio meccanico con tracciamento stelle ad orologeria. Servizi: carte stellari, sistemi navigazione.',
 'location', 'city_timekeeper', 140, 160, 200,
 false, true, false, true, false, false,
 12, ARRAY['Tracciamento stellare', 'Carte astronomiche', 'Navigazione precisa', 'Meccanica celeste'],
 30, '{"access_type":"astronomer_navigator_clearance","services":"star_charts","navigation":"precision_systems"}', '{}', CURRENT_TIMESTAMP);

-- Camera di Risonanza Perfetta
INSERT INTO locations 
(id, name, description, tier, parent_id, coordinates_x, coordinates_y, coordinates_z, 
 is_accessible, is_known, is_discovered, is_safe_zone, is_pvp_enabled, is_start_area, 
 max_players, special_features, population, requirements, lore_connections, updated_at)
VALUES 
('location_camera_risonanza_perfetta', 'Camera di Risonanza Perfetta', 
 'Stanza con acustica perfetta per ricerca del suono. Uso: perfezione sonora, ricerca acustica, innovazione musicale.',
 'location', 'city_gearspring', 60, 240, 40,
 false, false, false, true, false, false,
 20, ARRAY['Acustica perfetta', 'Ricerca sonora', 'Innovazione musicale', 'Risonanza ideale'],
 35, '{"access_type":"acoustic_researcher_clearance","use":"sound_perfection","research":"acoustic_innovation"}', '{}', CURRENT_TIMESTAMP);
