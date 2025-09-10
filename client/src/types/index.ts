// ====================
// USER & AUTHENTICATION TYPES
// ====================

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  role: 'player' | 'moderator' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

// ====================
// CHARACTER TYPES
// ====================

export interface CharacterStats {
  strength: number;
  intelligence: number;
  dexterity: number;
  constitution: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  experienceToNext: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: CharacterStats;
  availableStatPoints: number;
  currentLocationId: string;
  createdAt: string;
  lastPlayed: string;
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  primaryStat: keyof CharacterStats;
  baseStats: CharacterStats;
  statGrowth: CharacterStats;
}

export interface CharacterState {
  characters: Character[];
  activeCharacter: Character | null;
  classes: CharacterClass[];
  loading: boolean;
  error: string | null;
}

// ====================
// WORLD & LOCATION TYPES  
// ====================

export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'town' | 'dungeon' | 'wilderness' | 'special';
  x: number;
  y: number;
  minLevel: number;
  maxLevel: number;
  isAccessible: boolean;
  connectedLocations: string[];
  playerCount?: number;
  features?: string[];
}

export interface Region {
  id: string;
  name: string;
  description: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  theme: string;
  locations: string[];
}

export interface LocationConnection {
  from: string;
  to: string;
  travelTime: number;
  cost?: number;
  requirements?: {
    minLevel?: number;
    items?: string[];
    quests?: string[];
  };
}

export interface WorldState {
  currentLocation: Location | null;
  locations: Location[];
  regions: Region[];
  connections: LocationConnection[];
  mapData: {
    zoom: 1 | 4 | 16 | 64;
    centerX: number;
    centerY: number;
  };
  loading: boolean;
  error: string | null;
}

// ====================
// CHAT TYPES
// ====================

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'action' | 'system' | 'whisper';
  timestamp: string;
  isRead: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'global' | 'location' | 'guild' | 'party' | 'private';
  isActive: boolean;
  participants?: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface ChatState {
  channels: ChatChannel[];
  activeChannelId: string | null;
  messages: { [channelId: string]: ChatMessage[] };
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

// ====================
// QUEST TYPES
// ====================

export interface QuestObjective {
  id: string;
  description: string;
  type: 'kill' | 'collect' | 'deliver' | 'talk' | 'explore';
  target?: string;
  current: number;
  required: number;
  isCompleted: boolean;
}

export interface QuestReward {
  experience?: number;
  gold?: number;
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  giverId: string;
  giverName: string;
  giverLocationId: string;
  level: number;
  objectives: QuestObjective[];
  rewards: QuestReward;
  status: 'available' | 'accepted' | 'completed' | 'failed';
  isTracked: boolean;
  acceptedAt?: string;
  completedAt?: string;
  timeLimit?: number;
}

export interface QuestState {
  availableQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  trackedQuestIds: string[];
  loading: boolean;
  error: string | null;
}

// ====================
// GUILD TYPES
// ====================

export interface GuildMember {
  id: string;
  userId: string;
  username: string;
  characterName: string;
  rank: 'member' | 'officer' | 'leader';
  joinedAt: string;
  lastActive: string;
  contributionPoints: number;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  tag: string;
  leaderId: string;
  memberCount: number;
  maxMembers: number;
  level: number;
  experience: number;
  treasury: number;
  isPublic: boolean;
  requirements?: {
    minLevel?: number;
    applicationRequired?: boolean;
  };
  createdAt: string;
  members?: GuildMember[];
}

export interface GuildState {
  currentGuild: Guild | null;
  availableGuilds: Guild[];
  guildMembers: GuildMember[];
  applications: any[];
  loading: boolean;
  error: string | null;
}

// ====================
// UI TYPES
// ====================

export interface UIState {
  sidebarCollapsed: boolean;
  chatCollapsed: boolean;
  activePanel: 'character' | 'inventory' | 'quests' | 'guild' | 'map' | null;
  notifications: Notification[];
  isLoading: boolean;
  modalStack: string[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
}

// ====================
// API RESPONSE TYPES
// ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ====================
// WEBSOCKET TYPES
// ====================

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface GameEvent extends WebSocketMessage {
  type: 'character_update' | 'location_change' | 'chat_message' | 'quest_update' | 'guild_update';
}

// ====================
// FORM TYPES
// ====================

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export interface FormState {
  isSubmitting: boolean;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
}

// ====================
// ROUTER TYPES
// ====================

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  requireAuth?: boolean;
  requireCharacter?: boolean;
  allowedRoles?: User['role'][];
}

// ====================
// UTILITY TYPES
// ====================

export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
