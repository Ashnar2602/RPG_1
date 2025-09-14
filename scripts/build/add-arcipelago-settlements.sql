-- =====================================================
-- ARCIPELAGO CENTRALE - IMPLEMENTAZIONE SETTLEMENTS
-- Basato su documentazione: 06_ARCHIPELAGO_CENTRAL_DETAILED.md
-- =====================================================

-- =====================================================
-- REGIONE 1: CONFEDERAZIONE MERCANTILE DI PORTOLUNA
-- 6 Insediamenti Minori + 6 Location Speciali
-- =====================================================

-- Insediamenti Minori (Tier 3)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('settlement_silkroad', 'Silkroad', 'Centro commerciale specializzato in tessuti di lusso e sete orientali. Mercanti tessili e acquirenti facoltosi si incontrano in questo vivace insediamento portuale.', 400.0, 200.0, 15.0, 'location', 'city_portoluna', 12000, 60, true, true, ARRAY['commercio_tessili', 'sete_orientali', 'mercanti_lusso'], '{"level_min": 1, "reputation": {"merchants": 10}}', CURRENT_TIMESTAMP),

('settlement_spiceport', 'Spiceport', 'Porto specializzato nell''importazione e conservazione delle spezie più rare del mondo. L''aria è sempre impregnata di aromi esotici e il commercio non si ferma mai.', 420.0, 210.0, 12.0, 'location', 'city_goldweight', 10500, 55, true, true, ARRAY['importazione_spezie', 'conservazione', 'aromi_esotici'], '{"level_min": 1, "skills": {"alchemy": 15}}'),

('settlement_gemhaven', 'Gemhaven', 'Rifugio sicuro per gioiellieri e commercianti di gemme preziose. Ogni edificio scintilla di ricchezze e i maestri tagliatori lavorano gemme leggendarie.', 385.0, 225.0, 20.0, 'location', 'city_shipwright', 9200, 50, true, true, ARRAY['commercio_gemme', 'gioielleria_fine', 'taglio_gemme'], '{"level_min": 5, "wealth_min": 1000}'),

('settlement_sealane', 'Sealane', 'Insediamento di guide portuali e piloti navali che conoscono ogni corrente e scoglio dell''arcipelago. Servizi portuali e logistica navale di altissimo livello.', 440.0, 190.0, 8.0, 'location', 'city_compass', 8800, 45, true, true, ARRAY['servizi_portuali', 'pilotaggio_navale', 'logistica'], '{"level_min": 1, "skills": {"navigation": 20}}'),

('settlement_coinmint', 'Coinmint', 'Zecca ufficiale dell''arcipelago dove maestri monetari coniano le monete più precise e certificate del mondo. Centro di certificazione metalli preziosi.', 405.0, 235.0, 18.0, 'location', 'city_goldweight', 7600, 40, true, true, ARRAY['conio_monete', 'certificazione_metalli', 'maestri_monetari'], '{"level_min": 3, "reputation": {"bankers": 25}}'),

('settlement_warehouse', 'Warehouse', 'Complesso di magazzini e centri di distribuzione che gestiscono le merci di tutto l''arcipelago. Logistica commerciale e stoccaggio merci avanzati.', 415.0, 205.0, 10.0, 'location', 'city_portoluna', 6400, 35, true, true, ARRAY['stoccaggio_merci', 'distribuzione', 'logistica_commerciale'], '{"level_min": 1, "reputation": {"merchants": 15}}');

-- Location Speciali (Tier 4)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements) VALUES
('special_camera_tesoro_mondiale', 'Camera del Tesoro Mondiale', 'Vault contenente le più grandi riserve di tesori del mondo. Solo i più alti funzionari bancari e trattati internazionali permettono l''accesso a questo luogo leggendario.', 405.0, 220.0, -10.0, 'location', 'city_goldweight', 50, 5, true, true, ARRAY['vault_mondiale', 'riserve_auree', 'tesori_leggendari'], '{"level_min": 20, "reputation": {"bankers": 80}, "special_permits": ["international_treaty"]}'),

('special_faro_rotte_eterne', 'Faro delle Rotte Eterne', 'Faro magico che guida tutto il traffico marittimo mondiale. La sua luce magica può essere vista da qualsiasi distanza e coordina le rotte di navigazione globali.', 450.0, 180.0, 45.0, 'location', 'city_compass', 25, 8, true, true, ARRAY['faro_magico', 'navigazione_globale', 'coordinamento_rotte'], '{"level_min": 15, "skills": {"navigation": 40}, "class": ["navigator", "sea_mage"]}'),

('special_sala_contratti_sacri', 'Sala dei Contratti Sacri', 'Sala dove vengono firmati i più importanti accordi commerciali del mondo. I contratti qui firmati sono vincolanti magicamente e riconosciuti da tutte le nazioni.', 400.0, 200.0, 25.0, 'location', 'city_portoluna', 100, 12, true, true, ARRAY['accordi_internazionali', 'contratti_magici', 'diritto_commerciale'], '{"level_min": 10, "reputation": {"merchants": 50}, "wealth_min": 5000}'),

('special_giardino_monete_mondo', 'Giardino delle Monete del Mondo', 'Museo-giardino che espone le valute di tutte le terre conosciute. Ogni moneta racconta la storia economica e culturale della sua civiltà di origine.', 390.0, 210.0, 12.0, 'location', 'city_goldweight', 200, 25, true, true, ARRAY['museo_valute', 'storia_economica', 'collezione_monete'], '{"level_min": 5, "skills": {"history": 25}, "interests": ["economics", "culture"]}'),

('special_osservatorio_maree', 'Osservatorio delle Maree', 'Struttura avanzata per la previsione delle maree e del tempo meteorologico marino. Utilizza magia delle acque e scienza meteorologica per la sicurezza marittima.', 435.0, 185.0, 30.0, 'location', 'city_compass', 80, 15, true, true, ARRAY['previsione_maree', 'meteorologia_marina', 'sicurezza_marittima'], '{"level_min": 8, "skills": {"weather_magic": 30}, "class": ["weather_mage", "navigator"]}'),

('special_cripta_mercanti_leggendari', 'Cripta dei Mercanti Leggendari', 'Tomba che onora i più grandi mercanti della storia. I visitatori possono ricevere benedizioni commerciali e apprendere antichi segreti del commercio.', 410.0, 215.0, -5.0, 'location', 'city_portoluna', 20, 10, true, true, ARRAY['tomba_mercanti', 'benedizioni_commerciali', 'saggezza_antica'], '{"level_min": 12, "reputation": {"merchants": 60}, "pilgrimage": true}');

-- =====================================================
-- REGIONE 2: REPUBBLICA MARINARA DI VELACORTA  
-- 6 Insediamenti Minori + 6 Location Speciali
-- =====================================================

-- Insediamenti Minori (Tier 3)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements) VALUES
('settlement_seahawk', 'Seahawk', 'Centro di addestramento per esploratori aerei e addestratori di uccelli marini. I falchi marini addestrati qui sono i migliori messaggeri e scout del mondo.', 320.0, 150.0, 35.0, 'location', 'city_velacorta', 7800, 40, true, true, ARRAY['ricognizione_aerea', 'addestramento_uccelli', 'scout_aereo'], '{"level_min": 3, "skills": {"animal_handling": 25}}'),

('settlement_tidepool', 'Tidepool', 'Insediamento di specialisti delle maree che studiano e utilizzano la magia delle correnti. Esperti in navigazione costiera e magia delle acque basse.', 305.0, 135.0, 5.0, 'location', 'city_stormwatch', 6900, 35, true, true, ARRAY['ricerca_maree', 'navigazione_costiera', 'magia_maree'], '{"level_min": 5, "skills": {"water_magic": 20}}'),

('settlement_saltspray', 'Saltspray', 'Centro di produzione del sale marino e conservazione alimentare. I lavoratori del sale producono i conservanti più puri e le essenze marine più pregiate.', 340.0, 165.0, 8.0, 'location', 'city_deepanchor', 6200, 30, true, true, ARRAY['produzione_sale', 'conservazione_cibo', 'chimica_marina'], '{"level_min": 1, "skills": {"alchemy": 10}}'),

('settlement_kelp', 'Kelp', 'Insediamento di botanici marini che coltivano e studiano le alghe e piante marine. Agricoltura sottomarina e ricerca su vegetali di mare.', 315.0, 140.0, -2.0, 'location', 'city_windcutter', 5500, 28, true, true, ARRAY['botanica_marina', 'agricoltura_sottomarina', 'piante_marine'], '{"level_min": 4, "skills": {"herbalism": 20}, "abilities": ["water_breathing"]}'),

('settlement_coral', 'Coral', 'Centro di gestione delle barriere coralline e costruzione sottomarina. Specialisti in protezione marina e architettura acquatica.', 330.0, 125.0, -8.0, 'location', 'city_deepanchor', 4800, 25, true, true, ARRAY['gestione_coralli', 'costruzione_sottomarina', 'protezione_marina'], '{"level_min": 6, "skills": {"underwater_construction": 25}, "abilities": ["water_breathing"]}'),

('settlement_pearl', 'Pearl', 'Villaggio di pescatori di perle e cercatori di tesori sottomarini. I tuffatori più esperti del mondo recuperano tesori dalle profondità marine.', 325.0, 155.0, -5.0, 'location', 'city_velacorta', 4100, 22, true, true, ARRAY['pesca_perle', 'tesori_sottomarini', 'immersioni_profonde'], '{"level_min": 8, "skills": {"diving": 30}, "abilities": ["breath_hold"]}');

-- Location Speciali (Tier 4)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements) VALUES
('special_abisso_kraken_dormiente', 'Abisso del Kraken Dormiente', 'Fossa marina profondissima dove dorme un antico mostro marino. Solo i più coraggiosi esploratori osano avventurarsi in queste acque maledette e pericolose.', 300.0, 120.0, -200.0, 'location', 'city_deepanchor', 0, 3, true, false, ARRAY['mostro_marino_antico', 'profondità_estreme', 'maledizioni_antiche'], '{"level_min": 25, "skills": {"diving": 50}, "abilities": ["pressure_resistance"], "courage": 80}'),

('special_tempio_correnti', 'Tempio delle Correnti', 'Tempio sottomarino dedicato alle correnti marine e alla navigazione perfetta. I sacerdoti del mare benedicono i navigatori con protezione e lettura delle correnti.', 310.0, 145.0, -15.0, 'location', 'city_velacorta', 30, 10, true, true, ARRAY['tempio_sottomarino', 'benedizioni_navigazione', 'lettura_correnti'], '{"level_min": 10, "skills": {"navigation": 35}, "abilities": ["water_breathing"], "faith": ["sea_gods"]}'),

('special_cimitero_navi_perdute', 'Cimitero delle Navi Perdute', 'Cimitero sottomarino delle navi più famose della storia. Archeologi subacquei studiano i relitti per recuperare tesori e conoscenze perdute.', 335.0, 130.0, -25.0, 'location', 'city_deepanchor', 15, 8, true, false, ARRAY['relitti_storici', 'archeologia_sottomarina', 'tesori_perduti'], '{"level_min": 15, "skills": {"archaeology": 40, "diving": 35}, "abilities": ["water_breathing"]}'),

('special_laboratorio_maree_magiche', 'Laboratorio delle Maree Magiche', 'Laboratorio di ricerca che studia gli effetti magici delle maree. Maghi dell''acqua sperimentano con manipolazione delle maree e incantesimi oceanici.', 320.0, 160.0, 10.0, 'location', 'city_stormwatch', 40, 12, true, true, ARRAY['ricerca_maree_magiche', 'manipolazione_acque', 'incantesimi_oceanici'], '{"level_min": 12, "skills": {"water_magic": 40}, "class": ["water_mage"], "research_permit": true}'),

('special_arena_navale_eroi', 'Arena Navale degli Eroi', 'Grande arena per competizioni navali e battaglie simulate. I migliori marinai e atleti navali si sfidano in gare spettacolari davanti a folle entusiaste.', 345.0, 170.0, 15.0, 'location', 'city_windcutter', 500, 100, true, true, ARRAY['competizioni_navali', 'battaglie_simulate', 'sport_navali'], '{"level_min": 8, "skills": {"sailing": 30}, "athletic_ability": 25}'),

('special_archivio_rotte_segrete', 'Archivio delle Rotte Segrete', 'Archivio segreto contenente le rotte marine nascoste e intelligence marittima. Solo ufficiali di alto grado e spie navali possono accedere a questi segreti.', 315.0, 155.0, -10.0, 'location', 'city_velacorta', 10, 5, true, true, ARRAY['rotte_segrete', 'intelligence_marittima', 'informazioni_strategiche'], '{"level_min": 18, "rank": ["admiral", "naval_spy"], "security_clearance": "top_secret"}');
