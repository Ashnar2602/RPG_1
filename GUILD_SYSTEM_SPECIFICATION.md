# GUILD SYSTEM - Specifica Completa
## Sistema Organizzazioni Giocatori MMO

### 📋 OVERVIEW
Sistema completo per organizzazioni di giocatori (Guild/Clan) in RPG MMO. Supporta hierarchy management, diplomazia base, progetti collettivi e comunicazione interna. Foundation per future espansioni territoriali e war system.

---

## 🎯 REQUISITI FUNZIONALI

### Guild Core Features
- **Creazione Guild**: Nome unico, tag, descrizione, leadership
- **Membership Management**: Inviti, applicazioni, kick/leave, ruoli
- **Hierarchy System**: Leader, Officer, Member, Recruit roles
- **Guild Communication**: Chat dedicata, announcements, message board
- **Collective Projects**: Guild hall upgrades, shared research
- **Treasury Management**: Guild bank, contributions, expenses
- **Diplomacy**: Alleanze, rivalità, neutralità con altre guild

### Guild Progression
- **Guild Experience**: Guadagnata tramite attività membri
- **Guild Levels**: Unlock nuove features e benefits
- **Member Benefits**: Bonus basati su guild level e ruolo
- **Achievements**: Guild-wide goals e recognition
- **Territory Control**: (Post-MVP) Controllo città/regioni

---

## 🏗️ ARCHITETTURA DATI

### Guild Structure
```typescript
interface Guild {
  id: string;
  name: string;
  tag: string; // 2-5 caratteri, unique
  description: string;
  motd: string; // Message of the day
  
  // Leadership
  leader_id: string;
  founded_date: Date;
  
  // Settings
  settings: GuildSettings;
  
  // Progression
  guild_experience: number;
  guild_level: number;
  
  // Treasury
  treasury: GuildTreasury;
  
  // Statistics
  stats: GuildStats;
  
  // Status
  is_active: boolean;
  last_activity: Date;
}

interface GuildSettings {
  recruitment_policy: 'open' | 'invite_only' | 'application_required' | 'closed';
  min_level_requirement: number;
  max_members: number;
  
  permissions: {
    invite_members: GuildRole[];
    kick_members: GuildRole[];
    edit_description: GuildRole[];
    edit_motd: GuildRole[];
    manage_treasury: GuildRole[];
    manage_ranks: GuildRole[];
    declare_war: GuildRole[];
    form_alliance: GuildRole[];
  };
  
  auto_kick_settings: {
    enabled: boolean;
    inactive_days: number;
    min_level_exemption: number;
  };
  
  contribution_requirements: {
    weekly_minimum: number; // gold contribution
    activity_minimum: number; // hours played
  };
}

enum GuildRole {
  LEADER = 'leader',
  OFFICER = 'officer',
  VETERAN = 'veteran',
  MEMBER = 'member', 
  RECRUIT = 'recruit'
}

interface GuildTreasury {
  gold: number;
  resources: Map<string, number>; // materials, gems, etc.
  
  weekly_income: number;
  weekly_expenses: number;
  
  tax_rate: number; // percentage of member earnings
  contribution_tracking: Map<string, ContributionRecord>; // member_id -> contributions
}

interface ContributionRecord {
  total_gold_contributed: number;
  total_resources_contributed: Map<string, number>;
  last_contribution_date: Date;
  weekly_contribution: number;
  lifetime_contribution_rank: number;
}

interface GuildStats {
  total_members: number;
  active_members_7d: number;
  average_member_level: number;
  total_member_playtime: number;
  
  // Activities
  total_quests_completed: number;
  total_bosses_defeated: number;
  total_pvp_victories: number;
  
  // Rankings
  server_rank: number;
  power_score: number;
  wealth_score: number;
}
```

### Member Management
```typescript
interface GuildMember {
  guild_id: string;
  character_id: string;
  character_name: string;
  character_level: number;
  character_class: string;
  
  // Guild Status
  role: GuildRole;
  joined_date: Date;
  promoted_date?: Date;
  promoted_by?: string;
  
  // Activity
  last_online: Date;
  guild_activity_score: number;
  
  // Contributions
  contributions: ContributionRecord;
  
  // Permissions (custom overrides)
  custom_permissions?: CustomPermissions;
  
  // Notes
  officer_notes: string;
  public_note: string;
}

interface CustomPermissions {
  can_invite: boolean;
  can_kick_recruits: boolean;
  can_access_guild_bank: boolean;
  bank_withdrawal_limit: number;
  can_edit_notes: boolean;
}
```

### Guild Relationships
```typescript
interface GuildRelationship {
  guild_id_1: string;
  guild_id_2: string;
  relationship_type: RelationshipType;
  
  established_date: Date;
  established_by_1: string; // character_id who proposed
  established_by_2: string; // character_id who accepted
  
  terms?: RelationshipTerms;
  expires_at?: Date;
  
  is_active: boolean;
  last_updated: Date;
}

enum RelationshipType {
  ALLIANCE = 'alliance',
  NAP = 'non_aggression_pact', // non-aggression pact
  RIVALRY = 'rivalry',
  WAR = 'war', // for future PvP systems
  NEUTRAL = 'neutral'
}

interface RelationshipTerms {
  mutual_defense: boolean;
  resource_sharing: boolean;
  territory_sharing: boolean;
  trade_benefits: boolean;
  
  restrictions: string[];
  obligations: string[];
  
  auto_renewal: boolean;
  termination_notice_days: number;
}
```

---

## 🗄️ DATABASE SCHEMA

```sql
-- Guilds table
CREATE TABLE guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  tag VARCHAR(5) UNIQUE NOT NULL,
  description TEXT,
  motd TEXT,
  
  -- Leadership
  leader_id UUID NOT NULL REFERENCES characters(id),
  founded_date TIMESTAMP DEFAULT NOW(),
  
  -- Settings
  settings JSONB NOT NULL DEFAULT '{}',
  
  -- Progression
  guild_experience BIGINT DEFAULT 0,
  guild_level INTEGER DEFAULT 1,
  
  -- Treasury
  treasury JSONB NOT NULL DEFAULT '{"gold": 0, "resources": {}}',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_activity TIMESTAMP DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT guild_tag_format CHECK (tag ~ '^[A-Z0-9]{2,5}$'),
  CONSTRAINT guild_name_length CHECK (char_length(name) >= 3)
);

-- Guild members
CREATE TABLE guild_members (
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  
  -- Role and status
  role VARCHAR(20) DEFAULT 'recruit',
  joined_date TIMESTAMP DEFAULT NOW(),
  promoted_date TIMESTAMP,
  promoted_by UUID REFERENCES characters(id),
  
  -- Activity tracking
  last_online TIMESTAMP DEFAULT NOW(),
  guild_activity_score INTEGER DEFAULT 0,
  
  -- Contributions
  contributions JSONB DEFAULT '{"total_gold": 0, "total_resources": {}, "weekly_gold": 0}',
  
  -- Custom permissions
  custom_permissions JSONB,
  
  -- Notes
  officer_notes TEXT,
  public_note TEXT,
  
  PRIMARY KEY (guild_id, character_id),
  CONSTRAINT valid_guild_role CHECK (role IN ('leader', 'officer', 'veteran', 'member', 'recruit'))
);

-- Guild applications (for invite_only/application_required guilds)
CREATE TABLE guild_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  
  application_message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  
  applied_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES characters(id),
  resolution_message TEXT,
  
  CONSTRAINT valid_application_status CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  UNIQUE(guild_id, character_id) -- prevent duplicate applications
);

-- Guild invitations
CREATE TABLE guild_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES characters(id),
  
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  
  invited_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  resolved_at TIMESTAMP,
  
  CONSTRAINT valid_invitation_status CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  UNIQUE(guild_id, character_id) -- prevent duplicate invitations
);

-- Guild relationships (alliances, wars, etc.)
CREATE TABLE guild_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id_1 UUID REFERENCES guilds(id) ON DELETE CASCADE,
  guild_id_2 UUID REFERENCES guilds(id) ON DELETE CASCADE,
  
  relationship_type VARCHAR(30) NOT NULL,
  terms JSONB,
  
  established_date TIMESTAMP DEFAULT NOW(),
  established_by_1 UUID REFERENCES characters(id),
  established_by_2 UUID REFERENCES characters(id),
  
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT different_guilds CHECK (guild_id_1 != guild_id_2),
  CONSTRAINT valid_relationship_type CHECK (relationship_type IN ('alliance', 'non_aggression_pact', 'rivalry', 'war', 'neutral')),
  UNIQUE(guild_id_1, guild_id_2) -- prevent duplicate relationships
);

-- Guild events and activity log
CREATE TABLE guild_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  
  event_type VARCHAR(50) NOT NULL,
  actor_id UUID REFERENCES characters(id), -- who performed the action
  target_id UUID REFERENCES characters(id), -- target of action (for kicks, promotions, etc.)
  
  event_data JSONB,
  description TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Index for guild activity feeds
  CONSTRAINT valid_event_type CHECK (event_type IN (
    'member_joined', 'member_left', 'member_kicked', 'member_promoted', 'member_demoted',
    'leadership_changed', 'settings_updated', 'treasury_contribution', 'treasury_withdrawal',
    'alliance_formed', 'alliance_ended', 'war_declared', 'war_ended',
    'guild_created', 'guild_disbanded', 'guild_level_up'
  ))
);

-- Guild projects (shared goals/construction)
CREATE TABLE guild_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  
  project_type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Requirements and progress
  requirements JSONB NOT NULL, -- resources, gold, member contributions needed
  current_progress JSONB DEFAULT '{}',
  
  -- Timeline
  started_at TIMESTAMP DEFAULT NOW(),
  estimated_completion TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Permissions
  started_by UUID REFERENCES characters(id),
  can_contribute_roles VARCHAR(20)[] DEFAULT '{"member", "veteran", "officer", "leader"}',
  
  -- Rewards
  completion_rewards JSONB,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  CONSTRAINT valid_project_type CHECK (project_type IN (
    'guild_hall_upgrade', 'shared_research', 'monument', 'defensive_structure', 'custom'
  ))
);

-- Indexes for performance
CREATE INDEX idx_guilds_active ON guilds(is_active, last_activity);
CREATE INDEX idx_guild_members_guild ON guild_members(guild_id);
CREATE INDEX idx_guild_members_character ON guild_members(character_id);
CREATE INDEX idx_guild_members_role ON guild_members(guild_id, role);
CREATE INDEX idx_guild_applications_status ON guild_applications(guild_id, status);
CREATE INDEX idx_guild_invitations_pending ON guild_invitations(character_id, status, expires_at);
CREATE INDEX idx_guild_events_guild_time ON guild_events(guild_id, created_at DESC);
CREATE INDEX idx_guild_relationships_active ON guild_relationships(guild_id_1, guild_id_2, is_active);
```

---

## 🔌 API ENDPOINTS

### Guild Management
```typescript
// Guild CRUD operations
GET    /api/guilds                          // Search/list guilds (public)
POST   /api/guilds                          // Create new guild
GET    /api/guilds/:id                      // Get guild details (public info)
PUT    /api/guilds/:id                      // Update guild settings (officers+)
DELETE /api/guilds/:id                      // Disband guild (leader only)

// Member management
GET    /api/guilds/:id/members              // List guild members
POST   /api/guilds/:id/invite               // Invite character to guild
POST   /api/guilds/:id/applications         // Apply to join guild
PUT    /api/guilds/:id/members/:charId      // Promote/demote member
DELETE /api/guilds/:id/members/:charId      // Kick member

// Personal guild operations
GET    /api/characters/:id/guild            // Get character's guild info
POST   /api/characters/:id/guild/leave      // Leave guild
PUT    /api/characters/:id/guild/note       // Update public note

// Applications and invitations
GET    /api/guilds/:id/applications         // List pending applications (officers+)
PUT    /api/guilds/:id/applications/:appId  // Approve/reject application
GET    /api/characters/:id/invitations      // List pending invitations
PUT    /api/characters/:id/invitations/:invId // Accept/decline invitation
```

### Guild Treasury & Projects
```typescript
// Treasury management
GET    /api/guilds/:id/treasury             // View treasury (members+)
POST   /api/guilds/:id/treasury/contribute  // Contribute to treasury
POST   /api/guilds/:id/treasury/withdraw    // Withdraw from treasury (officers+)
GET    /api/guilds/:id/treasury/history     // Transaction history

// Guild projects
GET    /api/guilds/:id/projects             // List guild projects
POST   /api/guilds/:id/projects             // Start new project (officers+)
POST   /api/guilds/:id/projects/:projId/contribute // Contribute to project
GET    /api/guilds/:id/projects/:projId     // Get project details
```

### Guild Relationships
```typescript
// Diplomacy
GET    /api/guilds/:id/relationships        // List guild relationships
POST   /api/guilds/:id/relationships        // Propose new relationship
PUT    /api/guilds/:id/relationships/:relId // Accept/reject relationship proposal
DELETE /api/guilds/:id/relationships/:relId // End relationship

// Alliance-specific endpoints
GET    /api/guilds/:id/allies               // List allied guilds
POST   /api/guilds/:id/allies/:allyId       // Specific alliance actions
```

### Guild Events & Communication
```typescript
// Activity and events
GET    /api/guilds/:id/events               // Guild activity feed
GET    /api/guilds/:id/events/stats         // Guild statistics

// Communication (integrates with chat system)
GET    /api/guilds/:id/announcements        // Officer announcements
POST   /api/guilds/:id/announcements        // Create announcement (officers+)
PUT    /api/guilds/:id/motd                 // Update message of the day
```

---

## 🎮 INTEGRAZIONE GAMEPLAY

### Character Integration
```typescript
// When character is created/loaded
class CharacterGuildIntegration {
  async loadCharacterGuildData(characterId: string): Promise<CharacterGuildInfo | null> {
    const membership = await GuildMember.findByCharacter(characterId);
    if (!membership) return null;
    
    const guild = await Guild.findById(membership.guild_id);
    const guildBenefits = await this.calculateGuildBenefits(guild, membership);
    
    return {
      guild: guild,
      membership: membership,
      benefits: guildBenefits,
      permissions: this.calculatePermissions(membership.role, membership.custom_permissions)
    };
  }
  
  // Calculate benefits based on guild level and member role
  calculateGuildBenefits(guild: Guild, membership: GuildMember): GuildBenefits {
    const baseBenefits = GUILD_LEVEL_BENEFITS[guild.guild_level];
    const roleBenefits = ROLE_BENEFITS[membership.role];
    
    return {
      experience_bonus: baseBenefits.experience_bonus + roleBenefits.experience_bonus,
      gold_bonus: baseBenefits.gold_bonus + roleBenefits.gold_bonus,
      special_access: [...baseBenefits.special_access, ...roleBenefits.special_access],
      shop_discounts: Math.max(baseBenefits.shop_discounts, roleBenefits.shop_discounts)
    };
  }
}

// Guild level benefits table
const GUILD_LEVEL_BENEFITS = {
  1: { experience_bonus: 0, gold_bonus: 0, special_access: [], shop_discounts: 0 },
  2: { experience_bonus: 2, gold_bonus: 5, special_access: ['guild_hall'], shop_discounts: 2 },
  3: { experience_bonus: 5, gold_bonus: 10, special_access: ['guild_hall', 'guild_vault'], shop_discounts: 5 },
  4: { experience_bonus: 8, gold_bonus: 15, special_access: ['guild_hall', 'guild_vault', 'guild_research'], shop_discounts: 8 },
  5: { experience_bonus: 12, gold_bonus: 20, special_access: ['guild_hall', 'guild_vault', 'guild_research', 'guild_dungeon'], shop_discounts: 10 }
};

const ROLE_BENEFITS = {
  recruit: { experience_bonus: 0, gold_bonus: 0, special_access: [], shop_discounts: 0 },
  member: { experience_bonus: 1, gold_bonus: 2, special_access: [], shop_discounts: 1 },
  veteran: { experience_bonus: 2, gold_bonus: 5, special_access: ['veteran_quarters'], shop_discounts: 2 },
  officer: { experience_bonus: 3, gold_bonus: 8, special_access: ['veteran_quarters', 'officer_lounge'], shop_discounts: 3 },
  leader: { experience_bonus: 5, gold_bonus: 12, special_access: ['veteran_quarters', 'officer_lounge', 'leader_chamber'], shop_discounts: 5 }
};
```

### Activity Tracking
```typescript
// Track member activity for guild progression
class GuildActivityTracker {
  async recordActivity(characterId: string, activityType: string, value: number) {
    const membership = await GuildMember.findByCharacter(characterId);
    if (!membership) return;
    
    // Update individual activity score
    await this.updateMemberActivity(membership, activityType, value);
    
    // Contribute to guild experience
    const guildExpGain = this.calculateGuildExpGain(activityType, value, membership.role);
    await this.addGuildExperience(membership.guild_id, guildExpGain);
    
    // Check for guild level up
    await this.checkGuildLevelUp(membership.guild_id);
  }
  
  calculateGuildExpGain(activityType: string, value: number, memberRole: GuildRole): number {
    const baseExpMap = {
      'quest_completed': 10,
      'boss_defeated': 25,
      'pvp_victory': 15,
      'item_crafted': 5,
      'resource_gathered': 2
    };
    
    const roleMultiplier = {
      'recruit': 0.5,
      'member': 1.0,
      'veteran': 1.2,
      'officer': 1.3,
      'leader': 1.5
    };
    
    const baseExp = baseExpMap[activityType] || 1;
    return Math.floor(baseExp * value * roleMultiplier[memberRole]);
  }
  
  async checkGuildLevelUp(guildId: string) {
    const guild = await Guild.findById(guildId);
    const requiredExp = this.calculateRequiredExperience(guild.guild_level + 1);
    
    if (guild.guild_experience >= requiredExp) {
      await this.levelUpGuild(guild);
    }
  }
  
  calculateRequiredExperience(level: number): number {
    // Exponential curve for guild leveling
    return Math.floor(1000 * Math.pow(level, 2.2));
  }
}
```

### Guild Projects System
```typescript
interface GuildProject {
  id: string;
  guild_id: string;
  project_type: ProjectType;
  name: string;
  description: string;
  
  requirements: ProjectRequirements;
  current_progress: ProjectProgress;
  
  started_at: Date;
  estimated_completion: Date;
  completed_at?: Date;
  
  completion_rewards: ProjectRewards;
  is_active: boolean;
}

enum ProjectType {
  GUILD_HALL_UPGRADE = 'guild_hall_upgrade',
  SHARED_RESEARCH = 'shared_research',
  MONUMENT = 'monument',
  DEFENSIVE_STRUCTURE = 'defensive_structure',
  CUSTOM = 'custom'
}

interface ProjectRequirements {
  gold_cost: number;
  resources_needed: Map<string, number>; // resource_type -> amount
  member_hours_required: number; // total member contribution hours
  min_guild_level: number;
  special_items?: string[]; // rare items needed
}

interface ProjectProgress {
  gold_contributed: number;
  resources_contributed: Map<string, number>;
  member_hours_contributed: number;
  contributors: Map<string, ContributorData>; // character_id -> contribution
}

interface ContributorData {
  gold_contributed: number;
  resources_contributed: Map<string, number>;
  hours_contributed: number;
  last_contribution: Date;
}

// Project management system
class GuildProjectManager {
  async contributeToProject(projectId: string, characterId: string, contribution: ProjectContribution): Promise<ContributionResult> {
    const project = await GuildProject.findById(projectId);
    const membership = await GuildMember.findByCharacter(characterId);
    
    // Validate contribution
    const validation = await this.validateContribution(project, membership, contribution);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    // Process contribution
    await this.processContribution(project, characterId, contribution);
    
    // Check if project is completed
    if (this.isProjectCompleted(project)) {
      await this.completeProject(project);
    }
    
    // Record guild event
    await GuildEvent.create({
      guild_id: project.guild_id,
      event_type: 'project_contribution',
      actor_id: characterId,
      description: `${membership.character_name} contributed to ${project.name}`,
      event_data: contribution
    });
    
    return { success: true, project: project };
  }
  
  async completeProject(project: GuildProject) {
    project.completed_at = new Date();
    project.is_active = false;
    
    // Apply project rewards to guild
    await this.applyProjectRewards(project);
    
    // Notify all guild members
    await this.notifyProjectCompletion(project);
    
    // Record completion event
    await GuildEvent.create({
      guild_id: project.guild_id,
      event_type: 'project_completed',
      description: `Guild project "${project.name}" has been completed!`,
      event_data: { rewards: project.completion_rewards }
    });
  }
}
```

---

## 🎨 CLIENT INTERFACE

### Guild Management UI Components
```typescript
// Main guild interface
interface GuildInterface {
  current_guild?: Guild;
  member_list: GuildMember[];
  guild_events: GuildEvent[];
  pending_applications: GuildApplication[];
  pending_invitations: GuildInvitation[];
  guild_projects: GuildProject[];
  user_permissions: GuildPermissions;
}

// Guild member list component
interface GuildMemberListProps {
  members: GuildMember[];
  current_user_role: GuildRole;
  on_promote: (memberId: string, newRole: GuildRole) => void;
  on_kick: (memberId: string, reason: string) => void;
  on_note_edit: (memberId: string, note: string) => void;
}

// Guild creation form
interface GuildCreationForm {
  name: string;
  tag: string;
  description: string;
  recruitment_policy: RecruitmentPolicy;
  min_level_requirement: number;
}

// Guild search and application
interface GuildSearchProps {
  search_filters: {
    name_pattern: string;
    min_members: number;
    max_members: number;
    recruitment_open: boolean;
    min_guild_level: number;
  };
  on_guild_select: (guild: Guild) => void;
  on_apply: (guildId: string, message: string) => void;
}
```

### Guild Chat Integration
```typescript
// Guild chat integrates with main chat system
interface GuildChatFeatures {
  // Standard chat features
  send_message: (content: string) => void;
  
  // Guild-specific features
  send_announcement: (content: string) => void; // officers only
  update_motd: (motd: string) => void; // officers only
  
  // Member tagging and notifications
  mention_member: (memberName: string) => void;
  mention_role: (role: GuildRole) => void; // @officers, @everyone
  
  // Integration with guild events
  show_activity_feed: boolean;
  show_member_joins_leaves: boolean;
  show_promotions_demotions: boolean;
}

// Guild-specific chat commands
const GUILD_CHAT_COMMANDS = {
  '/gmotd [message]': 'Update guild message of the day (officers+)',
  '/gannounce [message]': 'Send announcement to all members (officers+)',
  '/gwho': 'List online guild members',
  '/ginvite [character]': 'Invite character to guild',
  '/gkick [character] [reason]': 'Kick member from guild (officers+)',
  '/gpromote [character]': 'Promote guild member (officers+)',
  '/gdemote [character]': 'Demote guild member (officers+)',
  '/ginfo': 'Show guild information',
  '/gbank': 'Show guild treasury information',
  '/gcontribute [amount]': 'Contribute gold to guild treasury'
};
```

---

## 🛡️ SICUREZZA E VALIDAZIONE

### Permission System
```typescript
class GuildPermissionManager {
  // Check if character can perform action
  async hasPermission(characterId: string, guildId: string, action: GuildAction): Promise<boolean> {
    const membership = await GuildMember.findByGuildAndCharacter(guildId, characterId);
    if (!membership) return false;
    
    const guild = await Guild.findById(guildId);
    const requiredRoles = guild.settings.permissions[action];
    
    // Check role-based permissions
    if (requiredRoles.includes(membership.role)) {
      return true;
    }
    
    // Check custom permissions
    if (membership.custom_permissions) {
      const customPermission = this.getCustomPermissionForAction(action);
      if (customPermission && membership.custom_permissions[customPermission]) {
        return true;
      }
    }
    
    return false;
  }
  
  // Validate guild creation parameters
  validateGuildCreation(data: GuildCreationData): ValidationResult {
    const errors: string[] = [];
    
    // Name validation
    if (data.name.length < 3 || data.name.length > 50) {
      errors.push('Guild name must be between 3 and 50 characters');
    }
    
    if (!/^[a-zA-Z0-9 ]+$/.test(data.name)) {
      errors.push('Guild name can only contain letters, numbers, and spaces');
    }
    
    // Tag validation
    if (data.tag.length < 2 || data.tag.length > 5) {
      errors.push('Guild tag must be between 2 and 5 characters');
    }
    
    if (!/^[A-Z0-9]+$/.test(data.tag)) {
      errors.push('Guild tag can only contain uppercase letters and numbers');
    }
    
    // Check for reserved names/tags
    if (RESERVED_GUILD_NAMES.includes(data.name.toLowerCase())) {
      errors.push('Guild name is reserved');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}

// Reserved names that can't be used for guilds
const RESERVED_GUILD_NAMES = [
  'admin', 'administrator', 'moderator', 'system', 'staff', 'support',
  'guild', 'clan', 'team', 'group', 'null', 'undefined', 'test'
];
```

### Anti-Abuse Measures
```typescript
interface GuildAntiAbuse {
  // Guild creation limits
  max_guilds_per_user: 1; // can only lead one guild at a time
  creation_cooldown_hours: 24; // after leaving/being kicked
  min_character_level: 10; // to create guild
  
  // Invitation spam prevention
  max_invites_per_day: 10;
  invite_cooldown_minutes: 5; // between invites to same character
  
  // Application spam prevention
  max_applications_per_day: 5;
  application_cooldown_hours: 24; // after rejection
  
  // Leadership changes
  leadership_transfer_cooldown_days: 7; // after receiving leadership
  min_membership_days_for_leadership: 30; // to be eligible for leadership
  
  // Treasury protection
  max_withdrawal_per_day_by_role: {
    officer: 1000, // gold
    veteran: 0,
    member: 0,
    recruit: 0
  };
  
  // Guild disbanding protection
  disbanding_confirmation_period_hours: 48; // grace period before actual disbanding
  min_inactive_days_auto_disband: 90; // auto-disband inactive guilds
}

// Activity monitoring for suspicious behavior
class GuildAbuseMonitor {
  async checkSuspiciousActivity(guildId: string): Promise<SuspiciousActivity[]> {
    const issues: SuspiciousActivity[] = [];
    
    // Check for rapid membership turnover
    const recentKicks = await GuildEvent.countRecentEvents(guildId, 'member_kicked', 24);
    if (recentKicks > 10) {
      issues.push({
        type: 'excessive_kicking',
        severity: 'high',
        details: `${recentKicks} members kicked in 24 hours`
      });
    }
    
    // Check for treasury drainage
    const recentWithdrawals = await this.getTreasuryWithdrawals(guildId, 24);
    const totalWithdrawn = recentWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    if (totalWithdrawn > 10000) {
      issues.push({
        type: 'excessive_treasury_withdrawal',
        severity: 'medium',
        details: `${totalWithdrawn} gold withdrawn in 24 hours`
      });
    }
    
    return issues;
  }
}
```

---

## 📊 ANALYTICS E METRICS

### Guild Health Metrics
```typescript
interface GuildAnalytics {
  // Membership metrics
  member_retention_rate: number; // % still active after 30 days
  average_member_tenure: number; // days
  recruitment_success_rate: number; // % of invites accepted
  
  // Activity metrics
  daily_active_members: number;
  weekly_active_members: number;
  average_session_length: number;
  
  // Progression metrics
  guild_level_progression_rate: number; // exp gained per day
  project_completion_rate: number; // % of started projects completed
  
  // Financial metrics
  treasury_growth_rate: number; // gold per week
  member_contribution_average: number; // gold per member per week
  
  // Social metrics
  chat_activity_level: number; // messages per day
  internal_conflict_indicators: number; // kicks, demotions, etc.
}

// Guild ranking system
class GuildRankingSystem {
  async calculateGuildPowerScore(guild: Guild): Promise<number> {
    const weights = {
      guild_level: 100,
      member_count: 10,
      average_member_level: 5,
      treasury_value: 0.1,
      recent_activity: 50,
      project_completions: 25
    };
    
    const stats = await this.getGuildStats(guild.id);
    
    const powerScore = 
      (guild.guild_level * weights.guild_level) +
      (stats.total_members * weights.member_count) +
      (stats.average_member_level * weights.average_member_level) +
      (guild.treasury.gold * weights.treasury_value) +
      (stats.weekly_activity_score * weights.recent_activity) +
      (stats.completed_projects * weights.project_completions);
    
    return Math.floor(powerScore);
  }
  
  async updateServerRankings() {
    const allGuilds = await Guild.findActive();
    const guildScores = await Promise.all(
      allGuilds.map(async guild => ({
        guild_id: guild.id,
        power_score: await this.calculateGuildPowerScore(guild)
      }))
    );
    
    // Sort by power score and update ranks
    guildScores.sort((a, b) => b.power_score - a.power_score);
    
    for (let i = 0; i < guildScores.length; i++) {
      await Guild.updateRank(guildScores[i].guild_id, i + 1, guildScores[i].power_score);
    }
  }
}
```

---

## 🚀 IMPLEMENTAZIONE ROADMAP

### Week 2 Priority (MVP Foundation)
1. **Core database schema** - Guild, members, applications tables
2. **Basic CRUD operations** - Create, join, leave guild
3. **Simple permission system** - Leader, officer, member roles
4. **Guild chat channel integration** - Basic guild chat functionality
5. **Member list UI** - View guild members and basic info

### Week 4 Priority (Enhanced Features)
1. **Application system** - Apply to join, approve/reject
2. **Guild treasury** - Basic contribution and withdrawal
3. **Guild events log** - Activity feed for guild actions
4. **Role management** - Promote/demote members
5. **Guild search** - Find and apply to guilds

### Post-MVP (Month 2+)
1. **Guild projects system** - Collaborative goals and construction
2. **Diplomacy system** - Alliances and rivalries
3. **Advanced permissions** - Custom role permissions
4. **Guild benefits** - Level-based bonuses for members
5. **Territory control** - Guild-owned locations and resources

---

**Priorità Implementazione**: ALTA per Week 2  
**Dipendenze**: Chat system (guild chat), character system  
**Ready for Development**: ✅ Completamente specificato
