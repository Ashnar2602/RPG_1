import { CharacterRace, CharacterClass, ItemType, ItemRarity, LocationType, GuildRole } from '@prisma/client'

// ==========================================
// AUTH & USER TYPES
// ==========================================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  refreshToken?: string
  user?: UserProfile
  message?: string
}

export interface UserProfile {
  id: string
  email: string
  username: string
  isActive: boolean
  isPremium: boolean
  createdAt: Date
  characters: CharacterSummary[]
}

// ==========================================
// CHARACTER TYPES
// ==========================================

export interface CharacterSummary {
  id: string
  name: string
  race: CharacterRace
  characterClass: CharacterClass
  level: number
  experience: number
  currentHealth: number
  locationId?: string
  locationName?: string
}

export interface CharacterStats {
  health: number
  mana: number
  stamina: number
  strength: number
  agility: number
  intelligence: number
  vitality: number
  wisdom: number
  charisma: number
}

export interface CharacterPosition {
  locationId: string
  x: number
  y: number
  z: number
  facing: number
}

export interface CreateCharacterRequest {
  name: string
  race: CharacterRace
  characterClass: CharacterClass
}

export interface CharacterDetails extends CharacterSummary {
  baseHealth: number
  baseMana: number
  baseStamina: number
  currentMana: number
  currentStamina: number
  stats: CharacterStats
  position: CharacterPosition
  gold: number
  gems: number
  lastLogin: Date
}

// ==========================================
// INVENTORY & ITEMS
// ==========================================

export interface ItemData {
  id: string
  name: string
  description?: string
  type: ItemType
  subType?: string
  rarity: ItemRarity
  value: number
  weight: number
  stackable: boolean
  maxStack: number
  damage: number
  defense: number
  durability: number
  levelRequired: number
  classRequired?: CharacterClass
  raceRequired?: CharacterRace
}

export interface InventorySlot {
  id: string
  itemId: string
  quantity: number
  slot?: number
  durability?: number
  enchantLevel: number
  item: ItemData
}

export interface EquipmentSlot {
  id: string
  itemId: string
  slot: string
  durability: number
  enchantLevel: number
  item: ItemData
}

// ==========================================
// LOCATION & WORLD
// ==========================================

export interface LocationData {
  id: string
  name: string
  description?: string
  type: LocationType
  x: number
  y: number
  z: number
  isStartArea: boolean
  isSafeZone: boolean
  isPvpEnabled: boolean
  maxPlayers: number
  currentPlayers?: number
}

export interface WorldPosition {
  x: number
  y: number
  z: number
  facing: number
}

// ==========================================
// COMBAT TYPES
// ==========================================

export interface CombatAction {
  type: 'attack' | 'defend' | 'skill' | 'spell' | 'item'
  targetId?: string
  skillId?: string
  itemId?: string
}

export interface CombatResult {
  success: boolean
  damage?: number
  heal?: number
  critical?: boolean
  miss?: boolean
  statusEffects?: StatusEffect[]
  message: string
}

export interface StatusEffect {
  id: string
  name: string
  description: string
  duration: number
  type: 'buff' | 'debuff'
  effect: {
    stat?: string
    value: number
    percentage?: boolean
  }
}

// ==========================================
// GUILD TYPES
// ==========================================

export interface GuildData {
  id: string
  name: string
  tag: string
  description?: string
  level: number
  experience: number
  gold: number
  gems: number
  memberCount: number
  maxMembers: number
  isRecruiting: boolean
  minLevel: number
  createdAt: Date
}

export interface GuildMemberData {
  id: string
  characterId: string
  characterName: string
  characterLevel: number
  role: GuildRole
  expContributed: number
  goldContributed: number
  joinedAt: Date
  lastActive: Date
  isOnline: boolean
}

export interface CreateGuildRequest {
  name: string
  tag: string
  description?: string
}

// ==========================================
// QUEST TYPES
// ==========================================

export interface QuestData {
  id: string
  title: string
  description: string
  type: string
  level: number
  levelRequired: number
  expReward: number
  goldReward: number
  isActive: boolean
}

export interface QuestProgressData {
  id: string
  questId: string
  status: string
  progress: number
  maxProgress: number
  startedAt: Date
  completedAt?: Date
  quest: QuestData
}

// ==========================================
// CHAT TYPES
// ==========================================

export interface ChatMessage {
  id: string
  channelId: string
  channelType: string
  userId: string
  characterId?: string
  characterName?: string
  message: string
  timestamp: Date
}

export interface SendMessageRequest {
  channelId: string
  message: string
  characterId?: string
}

// ==========================================
// WEBSOCKET TYPES
// ==========================================

export interface SocketEvent {
  type: string
  data: any
  timestamp: Date
}

export interface PlayerUpdate {
  characterId: string
  position?: WorldPosition
  health?: number
  mana?: number
  stamina?: number
  status?: 'online' | 'offline' | 'away' | 'busy'
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ==========================================
// GAME EVENT TYPES
// ==========================================

export interface GameEvent {
  id: string
  type: string
  data: any
  timestamp: Date
  processed: boolean
}

export interface PlayerLoginEvent {
  userId: string
  characterId: string
  locationId: string
  timestamp: Date
}

export interface PlayerLogoutEvent {
  userId: string
  characterId: string
  sessionDuration: number
  timestamp: Date
}

export interface LevelUpEvent {
  characterId: string
  oldLevel: number
  newLevel: number
  expGained: number
  timestamp: Date
}

// ==========================================
// VALIDATION TYPES
// ==========================================

export interface ValidationError {
  field: string
  message: string
}

export interface RequestValidation {
  isValid: boolean
  errors: ValidationError[]
}

// ==========================================
// GAME CONFIGURATION
// ==========================================

export interface GameConfig {
  maxLevel: number
  expTable: number[]
  startingStats: CharacterStats
  startingGold: number
  startingLocation: string
  pvpEnabled: boolean
  guildCreationCost: number
  maxGuildMembers: number
}

// ==========================================
// UTILITY TYPES
// ==========================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>

// Express Request with User
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    username: string
  }
}
