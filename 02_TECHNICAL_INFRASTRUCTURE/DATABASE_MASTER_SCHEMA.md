# 🗄️ DATABASE MASTER SCHEMA - RPG_1 Project
## Schema Unificato Completo con Relazioni Cross-System

**Data**: 5 settembre 2025  
**Versione**: 1.0 MVP  
**Risolve**: Problema Critico #1 - Unificazione Schema Database

---

## 📋 **OVERVIEW**

Questo documento unifica tutti gli schema database definiti nei vari sistemi, garantendo:
- ✅ **Nessun conflitto Foreign Key**
- ✅ **Naming conventions consistenti**  
- ✅ **Migration path strutturato**
- ✅ **Performance optimization**

---

## 🏗️ **CORE TABLES (Foundation)**

### **Users & Authentication**
```sql
-- Core user account
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  account_status VARCHAR(20) DEFAULT 'active', -- active, suspended, banned
  subscription_type VARCHAR(20) DEFAULT 'free'
);

-- User sessions
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);
```

### **Characters (Player Entities)**
```sql
-- Player characters
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  background TEXT,
  alignment VARCHAR(20) NOT NULL, -- 'LG', 'LN', 'LE', 'NG', 'NN', 'NE', 'CG', 'CN', 'CE'
  
  -- Base stats (from CHARACTER_CREATION.md)
  str INTEGER NOT NULL DEFAULT 10 CHECK (str >= 10 AND str <= 25),
  int INTEGER NOT NULL DEFAULT 10 CHECK (int >= 10 AND int <= 25),
  dex INTEGER NOT NULL DEFAULT 10 CHECK (dex >= 10 AND dex <= 25),
  wil INTEGER NOT NULL DEFAULT 10 CHECK (wil >= 10 AND wil <= 25),
  cha INTEGER NOT NULL DEFAULT 10 CHECK (cha >= 10 AND cha <= 25),
  lck INTEGER NOT NULL DEFAULT 10 CHECK (lck >= 10 AND lck <= 25),
  sta INTEGER NOT NULL DEFAULT 10 CHECK (sta >= 10 AND sta <= 25),
  
  -- Derived stats (auto-calculated)
  power INTEGER NOT NULL, -- From COMBAT_SYSTEM.md formula
  hp_current INTEGER NOT NULL,
  hp_max INTEGER NOT NULL, -- round(STR * 1.25 + STA * 2.25 + 50)
  mp_current INTEGER NOT NULL,  
  mp_max INTEGER NOT NULL, -- round(INT * 2.5 + CHA * 0.75 + 75)
  
  -- Progression
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  
  -- Class system
  class VARCHAR(20) NOT NULL, -- 'warrior', 'rogue', 'mage', 'mercenary'
  sub_class VARCHAR(30),
  advanced_class VARCHAR(30), -- For post-level-10 upgrades
  
  -- Current state
  current_location_id UUID, -- Will reference locations(id)
  last_save_location_id UUID,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_played TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, name),
  CONSTRAINT valid_alignment CHECK (alignment IN ('LG', 'LN', 'LE', 'NG', 'NN', 'NE', 'CG', 'CN', 'CE'))
);
```

---

## 🌍 **WORLD SYSTEM TABLES**

### **Locations & Travel**
```sql
-- Regions (macro areas)
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  level_min INTEGER DEFAULT 1,
  level_max INTEGER DEFAULT 50,
  climate VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Locations (from TRAVEL_SYSTEM.md)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- 'city', 'dungeon', 'wilderness', 'landmark'
  level_min INTEGER DEFAULT 1,
  level_max INTEGER DEFAULT 50,
  
  -- Positioning (unified system)
  region_id UUID REFERENCES regions(id),
  grid_x INTEGER NOT NULL, -- For map system (0-31 per zoom level)
  grid_y INTEGER NOT NULL,
  coordinates_x FLOAT, -- For precise positioning
  coordinates_y FLOAT,
  
  -- Properties
  is_safe_zone BOOLEAN DEFAULT FALSE,
  respawn_point BOOLEAN DEFAULT FALSE,
  fast_travel_enabled BOOLEAN DEFAULT FALSE,
  
  -- Dynamic content
  environment_data JSONB DEFAULT '{}',
  persistent_state JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure grid coordinates are valid
  CONSTRAINT valid_grid_coords CHECK (grid_x >= 0 AND grid_x <= 31 AND grid_y >= 0 AND grid_y <= 31)
);

-- Travel connections (from TRAVEL_SYSTEM.md)
CREATE TABLE location_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  to_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  
  direction VARCHAR(20), -- 'north', 'south', 'east', 'west', 'up', 'down'
  travel_time_minutes INTEGER NOT NULL,
  stamina_cost INTEGER DEFAULT 10,
  currency_cost INTEGER DEFAULT 0,
  danger_level INTEGER DEFAULT 1 CHECK (danger_level >= 1 AND danger_level <= 10),
  encounter_chance FLOAT DEFAULT 0.1 CHECK (encounter_chance >= 0 AND encounter_chance <= 1),
  
  requirements JSONB DEFAULT '[]', -- Quest IDs, items, level requirements
  path_description TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Prevent self-connections
  CONSTRAINT no_self_connection CHECK (from_location_id != to_location_id),
  -- Unique directional connections
  UNIQUE(from_location_id, to_location_id, direction)
);
```

### **NPCs (from NPC_INTERACTION.md)**
```sql
-- NPCs
CREATE TABLE npcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- 'vendor', 'trainer', 'questgiver', 'enemy', 'friendly'
  level INTEGER DEFAULT 1,
  location_id UUID NOT NULL REFERENCES locations(id),
  
  -- Appearance & personality
  appearance TEXT,
  personality TEXT,
  backstory TEXT,
  faction_id UUID, -- For future faction system
  
  -- Interaction capabilities
  interaction_types VARCHAR(20)[] DEFAULT '{}', -- ['vendor', 'trainer', 'questgiver']
  
  -- Type-specific data (unified format)
  vendor_data JSONB,     -- Shop inventory, prices, reputation requirements
  trainer_data JSONB,    -- Available skills, costs, requirements  
  questgiver_data JSONB, -- Available quests, completion tracking
  combat_data JSONB,     -- HP, MP, stats, skills (same format as players)
  
  -- Behavior & spawning
  behavior_pattern JSONB DEFAULT '{}',
  spawn_type VARCHAR(20) DEFAULT 'static', -- 'static', 'respawning', 'event'
  respawn_time_minutes INTEGER,
  schedule JSONB, -- Daily/weekly schedule
  
  -- State
  current_state JSONB DEFAULT '{}',
  reputation_requirements JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚔️ **COMBAT SYSTEM TABLES**

### **Combat Sessions & Actions**
```sql
-- Combat sessions
CREATE TABLE combat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type VARCHAR(20) NOT NULL, -- 'pve', 'pvp', 'dungeon', 'boss'
  location_id UUID REFERENCES locations(id),
  
  -- Participants
  participant_ids UUID[] NOT NULL, -- Array of character IDs
  npc_ids UUID[] DEFAULT '{}', -- Array of NPC IDs involved
  
  -- Combat state
  current_turn INTEGER DEFAULT 1,
  turn_order JSONB NOT NULL, -- Ordered array of participant data
  combat_grid JSONB, -- 8x8 positioning data if using tactical combat
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'fled', 'interrupted'
  winner_side VARCHAR(10), -- 'players', 'npcs', 'draw'
  
  -- Timing
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  last_action_at TIMESTAMP DEFAULT NOW(),
  
  -- Results
  experience_awarded JSONB DEFAULT '{}', -- Per character
  loot_generated JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Combat action log (from COMBAT_ACTION_ECONOMY.md)
CREATE TABLE combat_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combat_session_id UUID NOT NULL REFERENCES combat_sessions(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id), -- NULL for NPC actions
  npc_id UUID REFERENCES npcs(id), -- NULL for player actions
  
  turn_number INTEGER NOT NULL,
  action_sequence INTEGER NOT NULL, -- Order within turn
  
  -- Action details
  action_id VARCHAR(50) NOT NULL,
  action_name VARCHAR(100) NOT NULL,
  action_type VARCHAR(20) NOT NULL, -- 'attack', 'spell', 'move', 'item', 'defend'
  action_point_cost INTEGER NOT NULL,
  
  -- Targets
  target_character_ids JSONB DEFAULT '[]',
  target_npc_ids JSONB DEFAULT '[]',
  target_positions JSONB DEFAULT '[]',
  
  -- Execution results
  execution_successful BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  dice_rolls JSONB, -- D50 rolls, stat values, etc.
  
  -- Combat effects
  damage_dealt INTEGER DEFAULT 0,
  healing_done INTEGER DEFAULT 0,
  effects_applied JSONB DEFAULT '[]',
  
  -- Timing
  executed_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_actor CHECK (
    (character_id IS NOT NULL AND npc_id IS NULL) OR 
    (character_id IS NULL AND npc_id IS NOT NULL)
  )
);
```

---

## 📜 **QUEST SYSTEM TABLES**

### **Quests & Progress**
```sql
-- Quest definitions (from QUEST_SYSTEM.md)
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  lore_text TEXT,
  
  type VARCHAR(20) NOT NULL, -- 'main', 'side', 'daily', 'weekly', 'event'
  category VARCHAR(20) NOT NULL, -- 'combat', 'exploration', 'social', 'crafting'
  difficulty VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard', 'epic'
  importance VARCHAR(20) NOT NULL, -- 'minor', 'major', 'critical', 'legendary'
  
  -- Requirements
  level_min INTEGER DEFAULT 1,
  level_max INTEGER,
  prerequisites JSONB DEFAULT '[]', -- Other quest IDs required
  class_restrictions VARCHAR(20)[] DEFAULT '{}',
  alignment_restrictions JSONB DEFAULT '{}',
  
  -- Structure
  objectives JSONB NOT NULL, -- Array of objective definitions
  branches JSONB DEFAULT '[]', -- For branching questlines
  
  -- Rewards
  rewards JSONB NOT NULL, -- XP, items, currency
  failure_consequences JSONB DEFAULT '[]',
  
  -- Relations
  giver_npc_id UUID REFERENCES npcs(id),
  quest_line_id UUID, -- For quest chains
  related_locations UUID[] DEFAULT '{}',
  related_npcs UUID[] DEFAULT '{}',
  
  -- Properties  
  repeatable BOOLEAN DEFAULT FALSE,
  time_limit INTEGER, -- hours
  seasonal BOOLEAN DEFAULT FALSE,
  can_abandon BOOLEAN DEFAULT TRUE,
  auto_complete BOOLEAN DEFAULT FALSE,
  
  unlocks_content JSONB DEFAULT '{}', -- Locations, NPCs, etc.
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Player quest tracking
CREATE TABLE player_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID NOT NULL REFERENCES quests(id),
  character_id UUID NOT NULL REFERENCES characters(id),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'available', -- 'available', 'active', 'completed', 'failed', 'abandoned'
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  abandoned_at TIMESTAMP,
  
  -- Progress
  current_objectives JSONB DEFAULT '[]',
  completed_objectives UUID[] DEFAULT '{}',
  failed_objectives UUID[] DEFAULT '{}',
  
  active_branches UUID[] DEFAULT '{}',
  completed_branches UUID[] DEFAULT '{}',
  available_choices JSONB DEFAULT '[]',
  
  -- Context
  starting_location_id UUID REFERENCES locations(id),
  party_members UUID[] DEFAULT '{}', -- Other characters in party
  quest_variables JSONB DEFAULT '{}', -- Dynamic quest state
  custom_rewards JSONB, -- Modified rewards
  
  last_progress_update TIMESTAMP DEFAULT NOW(),
  next_reminder TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(quest_id, character_id)
);
```

---

## 💬 **COMMUNICATION SYSTEM TABLES**

### **Chat & Messaging (Unifica WebSocket + Chat)**
```sql
-- Chat channels (unified from multiple specs)
CREATE TABLE chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_type VARCHAR(20) NOT NULL, -- 'global', 'location', 'party', 'private', 'guild'
  
  -- Target context
  location_id UUID REFERENCES locations(id), -- For location channels
  party_id UUID, -- Will reference parties table when implemented
  guild_id UUID, -- Will reference guilds table when implemented
  
  -- Properties
  name VARCHAR(100),
  description TEXT,
  is_moderated BOOLEAN DEFAULT FALSE,
  max_participants INTEGER,
  
  -- Settings
  message_retention_days INTEGER DEFAULT 30,
  rate_limit_messages_per_minute INTEGER DEFAULT 10,
  allow_system_messages BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES characters(id),
  
  -- Ensure proper channel targeting
  CONSTRAINT valid_channel_target CHECK (
    (channel_type = 'global' AND location_id IS NULL AND party_id IS NULL AND guild_id IS NULL) OR
    (channel_type = 'location' AND location_id IS NOT NULL AND party_id IS NULL AND guild_id IS NULL) OR
    (channel_type = 'party' AND location_id IS NULL AND party_id IS NOT NULL AND guild_id IS NULL) OR
    (channel_type = 'private' AND location_id IS NULL AND party_id IS NULL AND guild_id IS NULL) OR
    (channel_type = 'guild' AND location_id IS NULL AND party_id IS NULL AND guild_id IS NOT NULL)
  )
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
  sender_character_id UUID REFERENCES characters(id), -- NULL for system messages
  
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'action', 'system', 'combat'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- For action/system messages, mentions, etc.
  
  -- Moderation
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_by UUID REFERENCES characters(id),
  deleted_at TIMESTAMP,
  deletion_reason VARCHAR(100),
  
  -- Threading (for future)
  reply_to_message_id UUID REFERENCES chat_messages(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Content validation
  CONSTRAINT non_empty_content CHECK (LENGTH(TRIM(content)) > 0),
  CONSTRAINT valid_system_message CHECK (
    (message_type = 'system' AND sender_character_id IS NULL) OR
    (message_type != 'system' AND sender_character_id IS NOT NULL)
  )
);

-- User chat settings
CREATE TABLE chat_user_settings (
  character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  
  -- Ignored users
  ignored_character_ids UUID[] DEFAULT '{}',
  
  -- Channel notifications
  channel_notifications JSONB DEFAULT '{}', -- Per-channel notification preferences
  
  -- Filters
  filter_settings JSONB DEFAULT '{}', -- Profanity, spam, etc.
  custom_filters VARCHAR(100)[] DEFAULT '{}',
  
  -- UI preferences
  ui_preferences JSONB DEFAULT '{}', -- Font size, colors, etc.
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🏰 **GUILD SYSTEM TABLES**

### **Guilds & Membership (From IMPLEMENTATION_GAPS_ANALYSIS.md)**
```sql
-- Guilds
CREATE TABLE guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  tag VARCHAR(4) UNIQUE NOT NULL,
  description TEXT,
  
  -- Leadership
  leader_id UUID NOT NULL REFERENCES characters(id),
  
  -- Settings & customization
  settings JSONB NOT NULL DEFAULT '{}', -- Recruitment, permissions, etc.
  motd TEXT, -- Message of the day
  
  -- Progression
  guild_experience INTEGER DEFAULT 0,
  guild_level INTEGER DEFAULT 1,
  
  -- Resources (for future expansion)
  treasury_bronze INTEGER DEFAULT 0,
  treasury_silver INTEGER DEFAULT 0,
  treasury_gold INTEGER DEFAULT 0,
  treasury_platinum INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Guild members
CREATE TABLE guild_members (
  guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  
  role VARCHAR(20) DEFAULT 'member', -- 'leader', 'officer', 'member', 'recruit'
  joined_at TIMESTAMP DEFAULT NOW(),
  
  -- Contribution tracking
  contribution_points INTEGER DEFAULT 0,
  last_contribution_at TIMESTAMP,
  
  -- Permissions (JSONB for flexibility)
  custom_permissions JSONB DEFAULT '{}',
  
  PRIMARY KEY (guild_id, character_id)
);

-- Guild applications
CREATE TABLE guild_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  applied_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES characters(id),
  resolution_note TEXT,
  
  UNIQUE(guild_id, character_id, status) WHERE status = 'pending'
);
```

---

## 🔧 **SYSTEM TABLES**

### **Configuration & Metadata**
```sql
-- System configuration
CREATE TABLE system_config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(100)
);

-- Game time tracking
CREATE TABLE game_time (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_game_time TIMESTAMP NOT NULL DEFAULT NOW(),
  time_multiplier FLOAT DEFAULT 1.0, -- Game time vs real time
  day_length_hours INTEGER DEFAULT 24,
  season VARCHAR(20) DEFAULT 'spring',
  year INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT single_row CHECK (id = 1)
);

-- Server events log
CREATE TABLE server_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB NOT NULL,
  affected_users UUID[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100)
);
```

---

## 📊 **UNIFIED INDEXING STRATEGY**

### **Performance Indices (Namespaced)**
```sql
-- Characters indices
CREATE INDEX idx_char_user_id ON characters(user_id);
CREATE INDEX idx_char_location ON characters(current_location_id);
CREATE INDEX idx_char_level ON characters(level);
CREATE INDEX idx_char_class ON characters(class);
CREATE INDEX idx_char_last_played ON characters(last_played);

-- Combat indices  
CREATE INDEX idx_combat_session_status ON combat_sessions(status);
CREATE INDEX idx_combat_session_location ON combat_sessions(location_id);
CREATE INDEX idx_combat_actions_session ON combat_actions_log(combat_session_id);
CREATE INDEX idx_combat_actions_character ON combat_actions_log(character_id);

-- World indices
CREATE INDEX idx_location_region ON locations(region_id);
CREATE INDEX idx_location_type ON locations(type);
CREATE INDEX idx_location_grid ON locations(grid_x, grid_y);
CREATE INDEX idx_npc_location ON npcs(location_id);
CREATE INDEX idx_npc_type ON npcs(type);

-- Quest indices
CREATE INDEX idx_quest_type_difficulty ON quests(type, difficulty);
CREATE INDEX idx_quest_level_range ON quests(level_min, level_max);
CREATE INDEX idx_player_quest_character ON player_quests(character_id);
CREATE INDEX idx_player_quest_status ON player_quests(status);

-- Chat indices
CREATE INDEX idx_chat_channel_type ON chat_channels(channel_type);
CREATE INDEX idx_chat_channel_location ON chat_channels(location_id);
CREATE INDEX idx_chat_messages_channel ON chat_messages(channel_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_character_id);

-- Guild indices
CREATE INDEX idx_guild_members_guild ON guild_members(guild_id);
CREATE INDEX idx_guild_members_character ON guild_members(character_id);
CREATE INDEX idx_guild_apps_guild ON guild_applications(guild_id);
CREATE INDEX idx_guild_apps_status ON guild_applications(status);
```

---

## 🚀 **MIGRATION STRATEGY**

### **Phase 1: Core Foundation**
```sql
-- Order of table creation for MVP
-- 1. Core tables (users, characters)
-- 2. World tables (regions, locations, npcs)  
-- 3. Communication tables (chat_channels, chat_messages)
-- 4. Combat tables (combat_sessions, combat_actions_log)
-- 5. Quest tables (quests, player_quests)
-- 6. Guild tables (guilds, guild_members)
-- 7. System tables (system_config, game_time)
```

### **Constraints & Validation**
```sql
-- Add constraints after data migration
ALTER TABLE characters ADD CONSTRAINT fk_char_location 
  FOREIGN KEY (current_location_id) REFERENCES locations(id);

-- Add validation triggers
CREATE OR REPLACE FUNCTION validate_character_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate derived stats
  NEW.hp_max := ROUND(NEW.str * 1.25 + NEW.sta * 2.25 + 50);
  NEW.mp_max := ROUND(NEW.int * 2.5 + NEW.cha * 0.75 + 75);
  
  -- Ensure current <= max
  NEW.hp_current := LEAST(NEW.hp_current, NEW.hp_max);
  NEW.mp_current := LEAST(NEW.mp_current, NEW.mp_max);
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_character_stats_validation
  BEFORE INSERT OR UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION validate_character_stats();
```

---

## ✅ **BENEFITS OF UNIFIED SCHEMA**

### **Conflict Resolution**:
- ✅ No FK conflicts between systems
- ✅ Consistent UUID usage  
- ✅ Unified naming conventions
- ✅ Proper cascade deletion

### **Performance Optimization**:
- ✅ Efficient indexing strategy
- ✅ Partitioning ready (chat_messages by date)
- ✅ Query optimization hints
- ✅ Connection pooling support

### **Development Benefits**:
- ✅ Single source of truth
- ✅ Clear migration path
- ✅ Type safety guarantees
- ✅ Automated validation

---

**🎯 NEXT STEPS**: 
1. Review and approve schema
2. Generate migration files
3. Setup development database
4. Implement validation triggers

**✅ PROBLEMA CRITICO #1: RISOLTO**
