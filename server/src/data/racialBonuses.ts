// Racial bonuses and traits data for character creation
export interface RacialBonus {
  race_id: string;
  display_name: string;
  stat_bonuses: {
    strength?: number;
    intelligence?: number;
    dexterity?: number;
    willpower?: number;
    charisma?: number;
    luck?: number;
    stamina?: number;
  };
  racial_trait: {
    name: string;
    description: string;
    effect: string;
    mechanical_bonus: string;
  };
  lore_summary: string;
  preferred_classes: string[];
  homeland: string;
}

export const RACIAL_BONUSES: Record<string, RacialBonus> = {
  HUMAN: {
    race_id: "HUMAN",
    display_name: "Umano",
    stat_bonuses: {
      charisma: 2,
      strength: 1,
      intelligence: 1,
      luck: 1
    },
    racial_trait: {
      name: "Adattabilità",
      description: "La versatilità umana permette apprendimento accelerato",
      effect: "+10% XP guadagnato",
      mechanical_bonus: "xp_multiplier: 1.1"
    },
    lore_summary: "Versatili ed equilibrati, capaci di eccellere in qualsiasi campo",
    preferred_classes: ["GUERRIERO", "MAGO", "FURFANTE"],
    homeland: "Vari continenti"
  },

  ELF: {
    race_id: "ELF",
    display_name: "Elfo",
    stat_bonuses: {
      intelligence: 2,
      dexterity: 2,
      willpower: 1
    },
    racial_trait: {
      name: "Vista Elfica",
      description: "Percezione superiore per combattimento a distanza",
      effect: "+15% precisione armi a distanza",
      mechanical_bonus: "ranged_accuracy: 1.15"
    },
    lore_summary: "Maestri della magia e del tiro con l'arco, longevi e saggi",
    preferred_classes: ["MAGO", "FURFANTE"],
    homeland: "Foreste antiche, regni magici"
  },

  DWARF: {
    race_id: "DWARF",
    display_name: "Nano",
    stat_bonuses: {
      strength: 3,
      stamina: 2
    },
    racial_trait: {
      name: "Costituzione Ferrea",
      description: "Resistenza naturale a sostanze tossiche e malattie",
      effect: "+20% resistenza a veleni e malattie",
      mechanical_bonus: "poison_resistance: 1.2, disease_resistance: 1.2"
    },
    lore_summary: "Fabbri leggendari e combattenti instancabili",
    preferred_classes: ["GUERRIERO"],
    homeland: "Montagne, città sotterranee"
  },

  ORC: {
    race_id: "ORC",
    display_name: "Orco",
    stat_bonuses: {
      strength: 4,
      stamina: 1
    },
    racial_trait: {
      name: "Furia Orchesca",
      description: "Il dolore scatena ferocia devastante",
      effect: "+25% danno quando sotto 30% HP",
      mechanical_bonus: "conditional_damage: {condition: 'hp_below_30_percent', multiplier: 1.25}"
    },
    lore_summary: "Forza devastante, cultura guerriera tribale",
    preferred_classes: ["GUERRIERO"],
    homeland: "Steppe, montagne selvagge"
  },

  TROLL: {
    race_id: "TROLL",
    display_name: "Troll",
    stat_bonuses: {
      stamina: 3,
      strength: 1,
      willpower: 1
    },
    racial_trait: {
      name: "Rigenerazione",
      description: "Capacità di guarigione accelerata naturale",
      effect: "+2 HP per turno durante combattimento",
      mechanical_bonus: "combat_regen: 2"
    },
    lore_summary: "Difficili da uccidere, adattabili agli ambienti più ostili",
    preferred_classes: ["GUERRIERO"],
    homeland: "Caverne, montagne ghiacciate"
  },

  GNOME: {
    race_id: "GNOME",
    display_name: "Gnomo",
    stat_bonuses: {
      intelligence: 3,
      charisma: 1,
      luck: 1
    },
    racial_trait: {
      name: "Genio Inventivo",
      description: "Talento naturale per creazioni magico-meccaniche",
      effect: "+20% efficacia crafting magico",
      mechanical_bonus: "magical_crafting: 1.2"
    },
    lore_summary: "Inventori brillanti, maghi specializzati in artefatti",
    preferred_classes: ["MAGO"],
    homeland: "Colline, laboratori sotterranei"
  },

  AERATHI: {
    race_id: "AERATHI",
    display_name: "Aerathi",
    stat_bonuses: {
      dexterity: 2,
      willpower: 2,
      luck: 1
    },
    racial_trait: {
      name: "Volo Planato",
      description: "Può planare dolcemente per brevi distanze",
      effect: "Capacità di volo planato limitato",
      mechanical_bonus: "special_movement: 'glide', fall_damage_reduction: 0.5"
    },
    lore_summary: "Abitanti delle vette più alte, connessi ai venti",
    preferred_classes: ["FURFANTE", "MAGO"],
    homeland: "Montagne volanti, picchi inaccessibili"  
  },

  GUOLGARN: {
    race_id: "GUOLGARN",
    display_name: "Guolgarn",
    stat_bonuses: {
      strength: 2,
      stamina: 1,
      willpower: 1,
      intelligence: 1
    },
    racial_trait: {
      name: "Vista Sotterranea",
      description: "Visione perfetta anche nella più completa oscurità",
      effect: "Visione al buio completa",
      mechanical_bonus: "darkvision: true, darkness_penalty: 0"
    },
    lore_summary: "Cultura sotterranea antica, resistenti e misteriosi",
    preferred_classes: ["GUERRIERO", "MAGO"],
    homeland: "Abissi sotterranei, città nelle profondità"
  },

  ZARKAAN: {
    race_id: "ZARKAAN",
    display_name: "Zar'kaan",
    stat_bonuses: {
      intelligence: 2,
      charisma: 1,
      willpower: 1,
      luck: 1
    },
    racial_trait: {
      name: "Resistenza Desertica",
      description: "Adattamento perfetto agli ambienti più aridi e caldi",
      effect: "Immunità al caldo estremo",
      mechanical_bonus: "heat_immunity: true, desert_survival: 2.0"
    },
    lore_summary: "Maestri della magia delle sabbie, artigiani leggendari",
    preferred_classes: ["MAGO"],
    homeland: "Deserti delle ceneri, oasi magiche"
  },

  FISHMAN: {
    race_id: "FISHMAN",
    display_name: "Uomo Pesce",
    stat_bonuses: {
      stamina: 2,
      dexterity: 2,
      willpower: 1
    },
    racial_trait: {
      name: "Respirazione Acquatica",
      description: "Può respirare sia aria che acqua senza limitazioni",
      effect: "Respirazione subacquea illimitata",
      mechanical_bonus: "underwater_breathing: true, swim_speed: 2.0"
    },
    lore_summary: "Dominio totale degli ambienti acquatici, cultura abissale",
    preferred_classes: ["GUERRIERO", "FURFANTE"],
    homeland: "Oceani profondi, città sommerse"
  },

  LIZARDMAN: {
    race_id: "LIZARDMAN",
    display_name: "Uomo Lucertola",
    stat_bonuses: {
      dexterity: 2,
      stamina: 1,
      willpower: 1,
      intelligence: 1
    },
    racial_trait: {
      name: "Mimetismo Ambientale",
      description: "Capacità naturale di mimetizzarsi negli ambienti naturali",
      effect: "+25% efficacia stealth in ambienti naturali",
      mechanical_bonus: "natural_stealth: 1.25"
    },
    lore_summary: "Esperti del mimetismo, signori delle paludi e acque tropicali",
    preferred_classes: ["FURFANTE", "GUERRIERO"],
    homeland: "Paludi, coste tropicali, arcipelaghi"
  }
};

// Class traits data
export interface ClassTrait {
  name: string;
  description: string;
  effect: string;
}

export const CLASS_TRAITS: Record<string, ClassTrait[]> = {
  GUERRIERO: [
    {
      name: "Padronanza Armi",
      description: "Esperienza con armi da mischia",
      effect: "+10% danno con armi da mischia"
    },
    {
      name: "Difesa Solida", 
      description: "Uso esperto dello scudo",
      effect: "+15% resistenza quando usa scudo"
    }
  ],

  MAGO: [
    {
      name: "Condotto Arcano",
      description: "Gestione efficiente dell'energia magica",
      effect: "-15% costo MP per incantesimi"
    },
    {
      name: "Concentrazione",
      description: "Focus mentale superiore",
      effect: "+20% precisione incantesimi"
    }
  ],

  FURFANTE: [
    {
      name: "Colpo Furtivo",
      description: "Attacchi devastanti dalle ombre",
      effect: "+30% probabilità critico da stealth"
    },
    {
      name: "Passo Silenzioso",
      description: "Movimento furtivo naturale",
      effect: "+25% efficacia stealth"
    }
  ]
};

// Selectable traits list
export interface SelectableTrait {
  id: string;
  name: string;
  description: string;
  effect: string;
}

export const SELECTABLE_TRAITS: SelectableTrait[] = [
  {
    id: "resistente",
    name: "Resistente",
    description: "Costituzione superiore alla media",
    effect: "+5% HP massimi"
  },
  {
    id: "mani_veloci",
    name: "Mani Veloci", 
    description: "Destrezza nel manipolare oggetti",
    effect: "-10% tempo uso oggetti"
  },
  {
    id: "tiratore_scelto",
    name: "Tiratore Scelto",
    description: "Precisione eccellente a distanza",
    effect: "+5% precisione armi a distanza"
  },
  {
    id: "baluardo",
    name: "Baluardo",
    description: "Maestria nella difesa con scudo",
    effect: "+5% difesa quando scudo equipaggiato"
  },
  {
    id: "recupero_rapido",
    name: "Recupero Rapido",
    description: "Guarigione accelerata naturale",
    effect: "+10% rigenerazione fuori combattimento"
  },
  {
    id: "furtivo",
    name: "Furtivo",
    description: "Talento naturale per nascondersi",
    effect: "+10% efficacia stealth"
  },
  {
    id: "lama_affilata",
    name: "Lama Affilata",
    description: "Colpi precisi e letali",
    effect: "+5% probabilità critico"
  },
  {
    id: "ingegnoso",
    name: "Ingegnoso",
    description: "Trova risorse dove altri falliscono",
    effect: "+10% drop rate risorse"
  },
  {
    id: "alchimista",
    name: "Alchimista",
    description: "Conoscenza delle proprietà alchemiche",
    effect: "+10% efficacia pozioni"
  },
  {
    id: "domatore",
    name: "Domatore",
    description: "Affinità con creature cavalcabili",
    effect: "+10% capacità cavalcatura"
  },
  {
    id: "presa_salda",
    name: "Presa Salda",
    description: "Forza superiore per trasportare",
    effect: "+5% capacità di carico"
  },
  {
    id: "apprendista_veloce",
    name: "Apprendista Veloce",
    description: "Apprendimento accelerato dall'esperienza",
    effect: "+5% guadagno XP"
  },
  {
    id: "portafortuna",
    name: "Portafortuna",
    description: "La fortuna sorride spesso",
    effect: "+3% bonus Fortuna generale"
  },
  {
    id: "tocco_curativo",
    name: "Tocco Curativo",
    description: "Talento naturale per curare",
    effect: "+10% efficacia cure"
  },
  {
    id: "specialista_trappole",
    name: "Specialista Trappole",
    description: "Maestria con trappole e congegni",
    effect: "+15% danno/efficacia trappole"
  },
  {
    id: "economista",
    name: "Economista",
    description: "Gestione efficiente dell'energia magica",
    effect: "-10% costo MP incantesimi"
  },
  {
    id: "occhio_falco",
    name: "Occhio di Falco",
    description: "Vista superiore per individuare dettagli",
    effect: "+15% range visivo"
  }, 
  {
    id: "nervi_saldi",
    name: "Nervi Saldi",
    description: "Resistenza mentale agli attacchi psichici",
    effect: "+10% resistenza effetti mentali"
  },
  {
    id: "esploratore",
    name: "Esploratore",
    description: "Movimento veloce su ogni terreno",
    effect: "+20% velocità movimento"
  },
  {
    id: "diplomatico",
    name: "Diplomatico",
    description: "Carisma naturale nelle trattative",
    effect: "+15% successo in negoziazioni"
  }
];
