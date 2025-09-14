-- =====================================================
-- ARCIPELAGO CENTRALE - IMPLEMENTAZIONE SETTLEMENTS COMPLETA
-- Basato su documentazione: 06_ARCHIPELAGO_CENTRAL_DETAILED.md
-- =====================================================

-- =====================================================
-- REGIONE 1: CONFEDERAZIONE MERCANTILE DI PORTOLUNA
-- 6 Insediamenti Minori + 6 Location Speciali
-- =====================================================

-- Insediamenti Minori (Tier 3)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('settlement_silkroad', 'Silkroad', 'Centro commerciale specializzato in tessuti di lusso e sete orientali. Mercanti tessili e acquirenti facoltosi si incontrano in questo vivace insediamento portuale.', 400.0, 200.0, 15.0, 'location', 'city_portoluna_capital', 12000, 60, true, true, ARRAY['commercio_tessili', 'sete_orientali', 'mercanti_lusso'], '{"level_min": 1, "reputation": {"merchants": 10}}', CURRENT_TIMESTAMP),

('settlement_spiceport', 'Spiceport', 'Porto specializzato nell''importazione e conservazione delle spezie più rare del mondo. L''aria è sempre impregnata di aromi esotici e il commercio non si ferma mai.', 420.0, 210.0, 12.0, 'location', 'city_goldweight', 10500, 55, true, true, ARRAY['importazione_spezie', 'conservazione', 'aromi_esotici'], '{"level_min": 1, "skills": {"alchemy": 15}}', CURRENT_TIMESTAMP),

('settlement_gemhaven', 'Gemhaven', 'Rifugio sicuro per gioiellieri e commercianti di gemme preziose. Ogni edificio scintilla di ricchezze e i maestri tagliatori lavorano gemme leggendarie.', 385.0, 225.0, 20.0, 'location', 'city_shipwright', 9200, 50, true, true, ARRAY['commercio_gemme', 'gioielleria_fine', 'taglio_gemme'], '{"level_min": 5, "wealth_min": 1000}', CURRENT_TIMESTAMP),

('settlement_sealane', 'Sealane', 'Insediamento di guide portuali e piloti navali che conoscono ogni corrente e scoglio dell''arcipelago. Servizi portuali e logistica navale di altissimo livello.', 440.0, 190.0, 8.0, 'location', 'city_compass', 8800, 45, true, true, ARRAY['servizi_portuali', 'pilotaggio_navale', 'logistica'], '{"level_min": 1, "skills": {"navigation": 20}}', CURRENT_TIMESTAMP),

('settlement_coinmint', 'Coinmint', 'Zecca ufficiale dell''arcipelago dove maestri monetari coniano le monete più precise e certificate del mondo. Centro di certificazione metalli preziosi.', 405.0, 235.0, 18.0, 'location', 'city_goldweight', 7600, 40, true, true, ARRAY['conio_monete', 'certificazione_metalli', 'maestri_monetari'], '{"level_min": 3, "reputation": {"bankers": 25}}', CURRENT_TIMESTAMP),

('settlement_warehouse', 'Warehouse', 'Complesso di magazzini e centri di distribuzione che gestiscono le merci di tutto l''arcipelago. Logistica commerciale e stoccaggio merci avanzati.', 415.0, 205.0, 10.0, 'location', 'city_portoluna', 6400, 35, true, true, ARRAY['stoccaggio_merci', 'distribuzione', 'logistica_commerciale'], '{"level_min": 1, "reputation": {"merchants": 15}}', CURRENT_TIMESTAMP);

-- Location Speciali (Tier 4)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('special_camera_tesoro_mondiale', 'Camera del Tesoro Mondiale', 'Vault contenente le più grandi riserve di tesori del mondo. Solo i più alti funzionari bancari e trattati internazionali permettono l''accesso a questo luogo leggendario.', 405.0, 220.0, -10.0, 'location', 'city_goldweight', 50, 5, true, true, ARRAY['vault_mondiale', 'riserve_auree', 'tesori_leggendari'], '{"level_min": 20, "reputation": {"bankers": 80}, "special_permits": ["international_treaty"]}', CURRENT_TIMESTAMP),

('special_faro_rotte_eterne', 'Faro delle Rotte Eterne', 'Faro magico che guida tutto il traffico marittimo mondiale. La sua luce magica può essere vista da qualsiasi distanza e coordina le rotte di navigazione globali.', 450.0, 180.0, 45.0, 'location', 'city_compass', 25, 8, true, true, ARRAY['faro_magico', 'navigazione_globale', 'coordinamento_rotte'], '{"level_min": 15, "skills": {"navigation": 40}, "class": ["navigator", "sea_mage"]}', CURRENT_TIMESTAMP),

('special_sala_contratti_sacri', 'Sala dei Contratti Sacri', 'Sala dove vengono firmati i più importanti accordi commerciali del mondo. I contratti qui firmati sono vincolanti magicamente e riconosciuti da tutte le nazioni.', 400.0, 200.0, 25.0, 'location', 'city_portoluna', 100, 12, true, true, ARRAY['accordi_internazionali', 'contratti_magici', 'diritto_commerciale'], '{"level_min": 10, "reputation": {"merchants": 50}, "wealth_min": 5000}', CURRENT_TIMESTAMP),

('special_giardino_monete_mondo', 'Giardino delle Monete del Mondo', 'Museo-giardino che espone le valute di tutte le terre conosciute. Ogni moneta racconta la storia economica e culturale della sua civiltà di origine.', 390.0, 210.0, 12.0, 'location', 'city_goldweight', 200, 25, true, true, ARRAY['museo_valute', 'storia_economica', 'collezione_monete'], '{"level_min": 5, "skills": {"history": 25}, "interests": ["economics", "culture"]}', CURRENT_TIMESTAMP),

('special_osservatorio_maree', 'Osservatorio delle Maree', 'Struttura avanzata per la previsione delle maree e del tempo meteorologico marino. Utilizza magia delle acque e scienza meteorologica per la sicurezza marittima.', 435.0, 185.0, 30.0, 'location', 'city_compass', 80, 15, true, true, ARRAY['previsione_maree', 'meteorologia_marina', 'sicurezza_marittima'], '{"level_min": 8, "skills": {"weather_magic": 30}, "class": ["weather_mage", "navigator"]}', CURRENT_TIMESTAMP),

('special_cripta_mercanti_leggendari', 'Cripta dei Mercanti Leggendari', 'Tomba che onora i più grandi mercanti della storia. I visitatori possono ricevere benedizioni commerciali e apprendere antichi segreti del commercio.', 410.0, 215.0, -5.0, 'location', 'city_portoluna', 20, 10, true, true, ARRAY['tomba_mercanti', 'benedizioni_commerciali', 'saggezza_antica'], '{"level_min": 12, "reputation": {"merchants": 60}, "pilgrimage": true}', CURRENT_TIMESTAMP);

-- =====================================================
-- REGIONE 2: REPUBBLICA MARINARA DI VELACORTA  
-- 6 Insediamenti Minori + 6 Location Speciali
-- =====================================================

-- Insediamenti Minori (Tier 3)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('settlement_seahawk', 'Seahawk', 'Centro di addestramento per esploratori aerei e addestratori di uccelli marini. I falchi marini addestrati qui sono i migliori messaggeri e scout del mondo.', 320.0, 150.0, 35.0, 'location', 'city_velacorta', 7800, 40, true, true, ARRAY['ricognizione_aerea', 'addestramento_uccelli', 'scout_aereo'], '{"level_min": 3, "skills": {"animal_handling": 25}}', CURRENT_TIMESTAMP),

('settlement_tidepool', 'Tidepool', 'Insediamento di specialisti delle maree che studiano e utilizzano la magia delle correnti. Esperti in navigazione costiera e magia delle acque basse.', 305.0, 135.0, 5.0, 'location', 'city_stormwatch', 6900, 35, true, true, ARRAY['ricerca_maree', 'navigazione_costiera', 'magia_maree'], '{"level_min": 5, "skills": {"water_magic": 20}}', CURRENT_TIMESTAMP),

('settlement_saltspray', 'Saltspray', 'Centro di produzione del sale marino e conservazione alimentare. I lavoratori del sale producono i conservanti più puri e le essenze marine più pregiate.', 340.0, 165.0, 8.0, 'location', 'city_deepanchor', 6200, 30, true, true, ARRAY['produzione_sale', 'conservazione_cibo', 'chimica_marina'], '{"level_min": 1, "skills": {"alchemy": 10}}', CURRENT_TIMESTAMP),

('settlement_kelp', 'Kelp', 'Insediamento di botanici marini che coltivano e studiano le alghe e piante marine. Agricoltura sottomarina e ricerca su vegetali di mare.', 315.0, 140.0, -2.0, 'location', 'city_windcutter', 5500, 28, true, true, ARRAY['botanica_marina', 'agricoltura_sottomarina', 'piante_marine'], '{"level_min": 4, "skills": {"herbalism": 20}, "abilities": ["water_breathing"]}', CURRENT_TIMESTAMP),

('settlement_coral', 'Coral', 'Centro di gestione delle barriere coralline e costruzione sottomarina. Specialisti in protezione marina e architettura acquatica.', 330.0, 125.0, -8.0, 'location', 'city_deepanchor', 4800, 25, true, true, ARRAY['gestione_coralli', 'costruzione_sottomarina', 'protezione_marina'], '{"level_min": 6, "skills": {"underwater_construction": 25}, "abilities": ["water_breathing"]}', CURRENT_TIMESTAMP),

('settlement_pearl', 'Pearl', 'Villaggio di pescatori di perle e cercatori di tesori sottomarini. I tuffatori più esperti del mondo recuperano tesori dalle profondità marine.', 325.0, 155.0, -5.0, 'location', 'city_velacorta', 4100, 22, true, true, ARRAY['pesca_perle', 'tesori_sottomarini', 'immersioni_profonde'], '{"level_min": 8, "skills": {"diving": 30}, "abilities": ["breath_hold"]}', CURRENT_TIMESTAMP);

-- Location Speciali (Tier 4)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('special_abisso_kraken_dormiente', 'Abisso del Kraken Dormiente', 'Fossa marina profondissima dove dorme un antico mostro marino. Solo i più coraggiosi esploratori osano avventurarsi in queste acque maledette e pericolose.', 300.0, 120.0, -200.0, 'location', 'city_deepanchor', 0, 3, true, false, ARRAY['mostro_marino_antico', 'profondità_estreme', 'maledizioni_antiche'], '{"level_min": 25, "skills": {"diving": 50}, "abilities": ["pressure_resistance"], "courage": 80}', CURRENT_TIMESTAMP),

('special_tempio_correnti', 'Tempio delle Correnti', 'Tempio sottomarino dedicato alle correnti marine e alla navigazione perfetta. I sacerdoti del mare benedicono i navigatori con protezione e lettura delle correnti.', 310.0, 145.0, -15.0, 'location', 'city_velacorta', 30, 10, true, true, ARRAY['tempio_sottomarino', 'benedizioni_navigazione', 'lettura_correnti'], '{"level_min": 10, "skills": {"navigation": 35}, "abilities": ["water_breathing"], "faith": ["sea_gods"]}', CURRENT_TIMESTAMP),

('special_cimitero_navi_perdute', 'Cimitero delle Navi Perdute', 'Cimitero sottomarino delle navi più famose della storia. Archeologi subacquei studiano i relitti per recuperare tesori e conoscenze perdute.', 335.0, 130.0, -25.0, 'location', 'city_deepanchor', 15, 8, true, false, ARRAY['relitti_storici', 'archeologia_sottomarina', 'tesori_perduti'], '{"level_min": 15, "skills": {"archaeology": 40, "diving": 35}, "abilities": ["water_breathing"]}', CURRENT_TIMESTAMP),

('special_laboratorio_maree_magiche', 'Laboratorio delle Maree Magiche', 'Laboratorio di ricerca che studia gli effetti magici delle maree. Maghi dell''acqua sperimentano con manipolazione delle maree e incantesimi oceanici.', 320.0, 160.0, 10.0, 'location', 'city_stormwatch', 40, 12, true, true, ARRAY['ricerca_maree_magiche', 'manipolazione_acque', 'incantesimi_oceanici'], '{"level_min": 12, "skills": {"water_magic": 40}, "class": ["water_mage"], "research_permit": true}', CURRENT_TIMESTAMP),

('special_arena_navale_eroi', 'Arena Navale degli Eroi', 'Grande arena per competizioni navali e battaglie simulate. I migliori marinai e atleti navali si sfidano in gare spettacolari davanti a folle entusiaste.', 345.0, 170.0, 15.0, 'location', 'city_windcutter', 500, 100, true, true, ARRAY['competizioni_navali', 'battaglie_simulate', 'sport_navali'], '{"level_min": 8, "skills": {"sailing": 30}, "athletic_ability": 25}', CURRENT_TIMESTAMP),

('special_archivio_rotte_segrete', 'Archivio delle Rotte Segrete', 'Archivio segreto contenente le rotte marine nascoste e intelligence marittima. Solo ufficiali di alto grado e spie navali possono accedere a questi segreti.', 315.0, 155.0, -10.0, 'location', 'city_velacorta', 10, 5, true, true, ARRAY['rotte_segrete', 'intelligence_marittima', 'informazioni_strategiche'], '{"level_min": 18, "rank": ["admiral", "naval_spy"], "security_clearance": "top_secret"}', CURRENT_TIMESTAMP);

-- =====================================================
-- REGIONE 3: ALLEANZA DEI PIRATI DI MAREAMORTA
-- 6 Insediamenti Minori + 6 Location Speciali
-- =====================================================

-- Insediamenti Minori (Tier 3)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('settlement_smugglers', 'Smugglers', 'Centro operativo per contrabbandieri professionali. Qui si organizzano le operazioni di contrabbando più audaci e si nascondono le merci più pericolose.', 220.0, 100.0, 12.0, 'location', 'city_mareamorta', 6500, 35, true, false, ARRAY['operazioni_contrabbando', 'trasporto_stealth', 'cargo_illegale'], '{"level_min": 8, "reputation": {"criminals": 30}, "criminal_contacts": true}', CURRENT_TIMESTAMP),

('settlement_treasure', 'Treasure', 'Villaggio di cacciatori di tesori e lettori di mappe del tesoro. I cercatori più esperti seguono leggende e mappe antiche per trovare tesori sepolti.', 200.0, 85.0, 18.0, 'location', 'city_blackwater', 5800, 30, true, false, ARRAY['caccia_tesori', 'lettura_mappe', 'recupero_bottino'], '{"level_min": 6, "skills": {"treasure_hunting": 25}, "map_reading": true}', CURRENT_TIMESTAMP),

('settlement_parrot', 'Parrot', 'Centro di comunicazioni segrete pirata con pappagalli messaggeri addestrati. I messaggi più importanti e segreti viaggiano attraverso questi uccelli intelligenti.', 240.0, 115.0, 15.0, 'location', 'city_reefbreak', 5200, 28, true, false, ARRAY['messaggi_segreti', 'comunicazioni_pirata', 'smuggling_informazioni'], '{"level_min": 4, "skills": {"animal_handling": 20}, "pirate_code": true}', CURRENT_TIMESTAMP),

('settlement_cutlass', 'Cutlass', 'Fucina e centro di addestramento per armi pirata. I migliori fabbri e maestri d''armi insegnano l''arte del combattimento piratesco e forgiano sciabole leggendarie.', 215.0, 120.0, 8.0, 'location', 'city_mutiny', 4600, 25, true, false, ARRAY['forgiatura_armi', 'addestramento_combattimento', 'armamenti_pirata'], '{"level_min": 5, "skills": {"weapon_crafting": 25}, "combat_training": true}', CURRENT_TIMESTAMP),

('settlement_rum', 'Rum', 'Distilleria e centro sociale pirata. Il rum più forte e gli spiriti più potenti vengono prodotti qui per mantenere alto il morale dei pirati dell''arcipelago.', 225.0, 95.0, 10.0, 'location', 'city_mareamorta', 4000, 22, true, true, ARRAY['produzione_alcool', 'morale_pirata', 'centro_sociale'], '{"level_min": 1, "skills": {"brewing": 15}, "social_standing": ["pirate"]}', CURRENT_TIMESTAMP),

('settlement_kraken', 'Kraken', 'Avamposto di cacciatori di mostri marini. I pirati più coraggiosi e folli cacciano creature leggendarie per gloria, tesori e rispetto tra i compagni.', 205.0, 105.0, 5.0, 'location', 'city_blackwater', 3400, 20, true, false, ARRAY['caccia_mostri_marini', 'creature_pericolose', 'tracking_bestie'], '{"level_min": 12, "skills": {"monster_hunting": 35}, "courage": 70}', CURRENT_TIMESTAMP);

-- Location Speciali (Tier 4)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('special_isola_tesoro_maledetto', 'Isola del Tesoro Maledetto', 'Isola contenente tesori maledetti che corrompono chi li tocca. Solo i più avari e coraggiosi osano cercare ricchezze che portano con sé antiche maledizioni.', 180.0, 80.0, 25.0, 'location', 'city_blackwater', 0, 5, true, false, ARRAY['tesori_maledetti', 'influenza_corruttiva', 'guardiani_soprannaturali'], '{"level_min": 20, "greed": 80, "curse_resistance": true, "protective_magic": ["curse_ward"]}', CURRENT_TIMESTAMP),

('special_grotta_cento_capitani', 'Grotta dei Cento Capitani', 'Grotta contenente i resti e tesori dei capitani pirata più leggendari. Un luogo sacro per i pirati dove riposano gli eroi della libertà marittima.', 210.0, 110.0, -15.0, 'location', 'city_mareamorta', 0, 8, true, true, ARRAY['resti_capitani_leggendari', 'tesori_storici', 'saggezza_pirata'], '{"level_min": 15, "reputation": {"pirates": 60}, "pirate_lineage": true}', CURRENT_TIMESTAMP),

('special_tribunale_onore_pirata', 'Tribunale dell''Onore Pirata', 'Tribunale dove i pirati risolvono le dispute secondo il codice pirata. La giustizia qui segue antiche tradizioni di onore e rispetto tra criminali.', 220.0, 100.0, 20.0, 'location', 'city_mareamorta', 50, 15, true, true, ARRAY['giustizia_pirata', 'risoluzione_dispute', 'codice_onore'], '{"level_min": 10, "reputation": {"pirates": 40}, "honor_disputes": true}', CURRENT_TIMESTAMP),

('special_fortezza_delle_nebbie', 'Fortezza delle Nebbie', 'Fortezza nascosta protetta da nebbie magiche. Solo i pirati di alto rango conoscono la sua posizione e possono attraversare la protezione magica.', 190.0, 90.0, 35.0, 'location', 'city_reefbreak', 100, 10, true, true, ARRAY['occultamento_magico', 'nebbie_protettive', 'approcci_nascosti'], '{"level_min": 18, "rank": ["pirate_captain"], "mist_magic": true, "secret_knowledge": ["fortress_location"]}', CURRENT_TIMESTAMP),

('special_mercato_nero_arcipelago', 'Mercato Nero dell''Arcipelago', 'Il più grande mercato nero del mondo conosciuto. Qui si può trovare qualsiasi oggetto proibito, rubato o magicamente pericoloso, per il giusto prezzo.', 230.0, 105.0, 8.0, 'location', 'city_mutiny', 300, 50, true, false, ARRAY['merci_proibite', 'oggetti_rubati', 'artefatti_illegali'], '{"level_min": 8, "criminal_contacts": true, "black_market_access": true}', CURRENT_TIMESTAMP),

('special_tempio_liberta_marittima', 'Tempio della Libertà Marittima', 'Tempio dedicato alla libertà marittima e alla filosofia pirata. I pirati liberi vengono qui per meditare sui principi di indipendenza e ribellione all''autorità.', 215.0, 95.0, 12.0, 'location', 'city_mareamorta', 75, 20, true, true, ARRAY['filosofia_pirata', 'indipendenza_marittima', 'ribellione_autorità'], '{"level_min": 12, "philosophy": ["maritime_freedom"], "anti_authority": true}', CURRENT_TIMESTAMP);

-- =====================================================
-- REGIONE 4: CITTÀ-STATO CULTURALE DI BELLEARTE
-- 6 Insediamenti Minori + 6 Location Speciali
-- =====================================================

-- Insediamenti Minori (Tier 3)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('settlement_marble', 'Marble', 'Centro di scultura e lavorazione del marmo. I più grandi scultori del mondo vengono qui per lavorare il marmo più puro e creare monumenti che durano per l''eternità.', 480.0, 250.0, 22.0, 'location', 'city_bellearte', 6800, 35, true, true, ARRAY['scultura_marmo', 'creazione_monumenti', 'lavorazione_pietra'], '{"level_min": 6, "skills": {"sculpting": 30}, "artistic_vision": 25}', CURRENT_TIMESTAMP),

('settlement_canvas', 'Canvas', 'Villaggio di artisti tessili e pittori su tessuto. Qui si creano le tele più belle e i tessuti artistici più pregiati, dipinti con tecniche segrete tramandate da generazioni.', 465.0, 235.0, 18.0, 'location', 'city_melodia', 6100, 32, true, true, ARRAY['arti_tessili', 'pittura_tessuto', 'materiali_artistici'], '{"level_min": 4, "skills": {"textile_arts": 25}, "color_theory": 20}', CURRENT_TIMESTAMP),

('settlement_verse', 'Verse', 'Centro di poesia, letteratura e arti scritte. I poeti più talentuosi e gli scrittori più ispirati vivono qui, creando opere che toccano l''anima e cambiano il mondo.', 490.0, 260.0, 15.0, 'location', 'city_dipinto', 5400, 30, true, true, ARRAY['poesia', 'letteratura', 'arti_scritte'], '{"level_min": 3, "skills": {"writing": 25}, "inspiration": 30}', CURRENT_TIMESTAMP),

('settlement_color', 'Color', 'Laboratorio di ricerca sui colori e produzione di pigmenti artistici. Qui si studiano i segreti del colore e si creano le tinte più vivide e durature del mondo.', 475.0, 245.0, 20.0, 'location', 'city_teatro', 4900, 28, true, true, ARRAY['ricerca_colori', 'produzione_pigmenti', 'teoria_colore'], '{"level_min": 5, "skills": {"color_theory": 30}, "chemistry": 20}', CURRENT_TIMESTAMP),

('settlement_dance', 'Dance', 'Accademia di danza e arti del movimento. I ballerini più aggraziati e i coreografi più innovativi insegnano qui l''arte di esprimere emozioni attraverso il movimento.', 485.0, 255.0, 12.0, 'location', 'city_bellearte', 4300, 25, true, true, ARRAY['danza_performativa', 'coreografia', 'arti_movimento'], '{"level_min": 2, "skills": {"dancing": 25}, "grace": 30}', CURRENT_TIMESTAMP),

('settlement_beauty', 'Beauty', 'Centro di estetica e arti della bellezza. Specialisti della bellezza creano cosmetici magici e insegnano l''arte di esaltare la bellezza naturale in tutte le sue forme.', 470.0, 240.0, 16.0, 'location', 'city_melodia', 3700, 22, true, true, ARRAY['arti_bellezza', 'cosmetici_magici', 'estetica_avanzata'], '{"level_min": 3, "skills": {"beauty_arts": 20}, "aesthetic_sense": 25}', CURRENT_TIMESTAMP);

-- Location Speciali (Tier 4)
INSERT INTO locations (id, name, description, coordinates_x, coordinates_y, coordinates_z, tier, parent_id, population, max_players, is_accessible, is_safe_zone, special_features, requirements, updated_at) VALUES
('special_galleria_meraviglie_eterne', 'Galleria delle Meraviglie Eterne', 'Galleria contenente le opere d''arte più belle mai create. Ogni opera esposta qui rappresenta il culmine dell''espressione artistica umana e ispira chiunque la contempli.', 485.0, 250.0, 25.0, 'location', 'city_bellearte', 100, 15, true, true, ARRAY['capolavori_artistici', 'opere_leggendarie', 'ispirazione_artistica'], '{"level_min": 12, "skills": {"art_appreciation": 35}, "cultural_pilgrimage": true}', CURRENT_TIMESTAMP),

('special_teatro_sogni_viventi', 'Teatro dei Sogni Viventi', 'Teatro magico dove le rappresentazioni diventano temporaneamente reali attraverso la magia. Gli spettacoli qui non sono solo visti, ma vissuti in prima persona.', 480.0, 255.0, 18.0, 'location', 'city_teatro', 200, 25, true, true, ARRAY['spettacoli_viventi', 'magia_teatrale', 'realtà_performativa'], '{"level_min": 15, "skills": {"dream_magic": 40}, "class": ["dream_mage", "reality_artist"]}', CURRENT_TIMESTAMP),

('special_giardino_ispirazioni', 'Giardino delle Ispirazioni', 'Giardino magico che ispira creatività in tutti coloro che lo visitano. Le piante qui cresciute assorbono l''energia creativa e la rilasciano a chi cerca ispirazione artistica.', 475.0, 245.0, 20.0, 'location', 'city_dipinto', 50, 12, true, true, ARRAY['ispirazione_creativa', 'energia_artistica', 'connessione_muse'], '{"level_min": 8, "creativity": 30, "artistic_calling": true}', CURRENT_TIMESTAMP),

('special_biblioteca_storie_non_scritte', 'Biblioteca delle Storie Non Scritte', 'Biblioteca contenente storie che esistono solo nell''immaginazione. I maestri narratori possono accedere a racconti mai scritti ma eternamente esistenti nel regno delle idee.', 490.0, 260.0, 22.0, 'location', 'city_bellearte', 30, 8, true, true, ARRAY['storie_immaginarie', 'racconti_eterni', 'potenziale_creativo'], '{"level_min": 18, "skills": {"storytelling": 45}, "class": ["master_storyteller"], "imagination_magic": true}', CURRENT_TIMESTAMP),

('special_osservatorio_bellezza_universale', 'Osservatorio della Bellezza Universale', 'Osservatorio dedicato allo studio della natura della bellezza e dell''estetica. Qui si studiano le leggi universali che governano ciò che consideriamo bello.', 485.0, 265.0, 30.0, 'location', 'city_teatro', 40, 10, true, true, ARRAY['teoria_bellezza', 'filosofia_estetica', 'bellezza_culturale'], '{"level_min": 20, "skills": {"aesthetic_philosophy": 50}, "wisdom": 40}', CURRENT_TIMESTAMP),

('special_cripta_grandi_maestri', 'Cripta dei Grandi Maestri', 'Tomba che onora i più grandi artisti della storia. I pellegrini artistici vengono qui per ricevere ispirazione dai maestri del passato e apprendere tecniche perdute.', 480.0, 250.0, -8.0, 'location', 'city_bellearte', 20, 12, true, true, ARRAY['maestri_storici', 'tecniche_perdute', 'saggezza_artistica'], '{"level_min": 15, "skills": {"art_history": 40}, "artistic_pilgrimage": true}', CURRENT_TIMESTAMP);
