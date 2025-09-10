# REACT CLIENT ARCHITECTURE
## Technical Specification Document

### 🎯 **OVERVIEW**
Comprehensive React frontend architecture for the RPG MMO game, integrating with the Express/WebSocket backend and implementing all game features with responsive design.

---

## 📋 **PROJECT STRUCTURE**

```
src/client/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── sounds/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Generic components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   └── game/            # Game-specific components
│   ├── pages/               # Route pages
│   │   ├── auth/            # Authentication pages
│   │   ├── character/       # Character management
│   │   ├── game/            # Main game pages
│   │   └── guild/           # Guild management
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API and WebSocket services
│   ├── store/               # Redux store and slices
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # Global styles and themes
│   └── App.tsx              # Main App component
└── package.json
```

---

## 🏗️ **TECHNOLOGY STACK**

### **Core Framework:**
- **React 18.2** with TypeScript
- **Vite** for build tooling (faster than CRA)
- **React Router 6.8** for navigation

### **State Management:**
- **Redux Toolkit** for global state
- **RTK Query** for server state and caching
- **React Hook Form** for form state

### **UI Framework:**
- **Tailwind CSS 3.4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Hot Toast** for notifications

### **Real-time Communication:**
- **Socket.IO Client 4.7** for WebSocket
- **React Query** for server synchronization

### **Game-specific:**
- **React DnD** for drag & drop (inventory)
- **React Spring** for game animations
- **Leaflet** for interactive map
- **Howler.js** for audio

### **Development Tools:**
- **ESLint** + **Prettier** for code quality
- **Husky** for git hooks
- **Jest** + **React Testing Library**

---

## 🎨 **UI DESIGN SYSTEM**

### **Color Palette (Cosmic Fantasy)**
```scss
// Primary Colors
$cosmic-purple: #6B46C1;    // Main purple
$cosmic-blue: #1E40AF;      // Deep blue
$cosmic-cyan: #0891B2;      // Bright cyan
$cosmic-teal: #0D9488;      // Teal accent

// Secondary Colors  
$cosmic-gold: #F59E0B;      // Gold highlights
$cosmic-silver: #9CA3AF;   // Silver text
$cosmic-rose: #EC4899;      // Rose accent
$cosmic-emerald: #10B981;   // Success green

// Neutrals
$cosmic-dark: #111827;      // Dark background
$cosmic-gray: #374151;      // Medium gray
$cosmic-light: #F9FAFB;     // Light text
```

### **Typography:**
- **Headers:** Inter Bold (24px, 20px, 18px)
- **Body:** Inter Regular (16px, 14px)
- **Monospace:** JetBrains Mono (code, stats)

### **Responsive Breakpoints:**
- **Mobile:** 375px - 767px
- **Tablet:** 768px - 1023px  
- **Laptop:** 1024px - 1365px
- **Desktop:** 1366px+

---

## 🧩 **COMPONENT ARCHITECTURE**

### **1. Layout Components**

#### **AppLayout.tsx**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}

// Main application wrapper with:
// - Header navigation
// - Sidebar (collapsible)
// - Main content area
// - Footer
```

#### **GameLayout.tsx**
```typescript
interface GameLayoutProps {
  children: React.ReactNode;
  showChat?: boolean;
  showMiniMap?: boolean;
}

// Game-specific layout with:
// - Character info panel
// - Chat window (resizable)
// - Mini-map
// - Game content area
```

### **2. Authentication Components**

#### **LoginForm.tsx**
```typescript
interface LoginFormProps {
  onSuccess: (user: User, token: string) => void;
  onError: (error: string) => void;
}

// Features:
// - Username/email input
// - Password input with visibility toggle
// - Remember me checkbox
// - Form validation
// - Loading states
```

#### **RegisterForm.tsx**
```typescript
interface RegisterFormProps {
  onSuccess: (user: User) => void;
  onError: (error: string) => void;
}

// Features:
// - Multi-step form
// - Real-time validation
// - Password strength meter
// - Terms acceptance
```

### **3. Character System Components**

#### **CharacterCreator.tsx**
```typescript
interface CharacterCreatorProps {
  onComplete: (character: Character) => void;
  onCancel: () => void;
}

// Features:
// - Step wizard (Name → Class → Stats → Review)
// - Stat point allocation with visual feedback
// - Class selection with descriptions
// - Preview character stats
// - Validation at each step
```

#### **CharacterCard.tsx**
```typescript
interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

// Features:
// - Character portrait placeholder
// - Name, level, class display
// - Last played timestamp
// - Quick stats overview
// - Action buttons (select, delete)
```

#### **StatsPanel.tsx**
```typescript
interface StatsPanelProps {
  character: Character;
  showDetailed?: boolean;
}

// Features:
// - Base stats (STR, INT, DEX, etc.) with bars
// - Health/Mana bars with animations
// - Derived stats calculations
// - Progress to next level
// - Expandable detailed view
```

### **4. Interactive Map Components**

#### **WorldMap.tsx**
```typescript
interface WorldMapProps {
  centerX?: number;
  centerY?: number;
  zoom?: 1 | 4 | 16 | 64;
  onLocationSelect: (location: Location) => void;
  onTravelRequest: (locationId: string) => void;
}

// Features:
// - 32x32 grid system
// - 4-level zoom (1x→4x→16x→64x)
// - Location markers with tooltips
// - Player position indicator
// - Travel path visualization
// - Connection lines between locations
```

#### **LocationCard.tsx**
```typescript
interface LocationCardProps {
  location: Location;
  playerCount?: number;
  canTravel?: boolean;
  onTravel: () => void;
}

// Features:
// - Location name and type
// - Level range indicator
// - Player count
// - Description
// - Travel button with cost
```

### **5. Chat System Components**

#### **ChatWindow.tsx**
```typescript
interface ChatWindowProps {
  isCollapsed?: boolean;
  onToggle: () => void;
  defaultChannel?: string;
}

// Features:
// - Resizable window
// - Multiple tabs (Global, Location, Guild, Private)
// - Message history with scrolling
// - Auto-scroll to bottom
// - Notification badges
```

#### **MessageList.tsx**
```typescript
interface MessageListProps {
  messages: ChatMessage[];
  loading?: boolean;
  onLoadMore: () => void;
}

// Features:
// - Virtual scrolling for performance
// - Message grouping by sender
// - Timestamp formatting
// - Message type styling (text, action, system)
// - Load more on scroll
```

#### **MessageInput.tsx**
```typescript
interface MessageInputProps {
  channelId: string;
  onSend: (content: string, type: MessageType) => void;
  disabled?: boolean;
}

// Features:
// - Multi-line text input
// - Character count indicator
// - Emoji support
// - Message type selector (/say, /action, /whisper)
// - Rate limiting feedback
```

### **6. Quest System Components**

#### **QuestLog.tsx**
```typescript
interface QuestLogProps {
  quests: Quest[];
  filter?: QuestFilter;
  onQuestSelect: (quest: Quest) => void;
}

// Features:
// - Collapsible categories (Active, Available, Completed)
// - Search and filter options
// - Quest importance indicators
// - Progress bars
// - Sorting options
```

#### **QuestDetail.tsx**
```typescript
interface QuestDetailProps {
  quest: Quest;
  onAccept: () => void;
  onAbandon: () => void;
  onTrackToggle: () => void;
}

// Features:
// - Quest title and description
// - Objective checklist
// - Rewards preview
// - Giver information with location
// - Progress tracking
// - Action buttons
```

### **7. Guild System Components**

#### **GuildBrowser.tsx**
```typescript
interface GuildBrowserProps {
  onJoinRequest: (guildId: string) => void;
  onCreateNew: () => void;
}

// Features:
// - Search and filter guilds
// - Guild cards with member count, level
// - Pagination
// - Sort options
// - Create new guild button
```

#### **GuildPanel.tsx**
```typescript
interface GuildPanelProps {
  guild: Guild;
  currentMember?: GuildMember;
  onAction: (action: GuildAction) => void;
}

// Features:
// - Guild information display
// - Member list with roles
// - Guild chat integration
// - Management tools (officers+)
// - Treasury and contributions
```

---

## 🔌 **WEBSOCKET INTEGRATION**

### **WebSocket Service**
```typescript
class GameSocketService {
  private socket: Socket | null = null;
  
  connect(token: string): Promise<void>
  disconnect(): void
  
  // Chat events
  sendMessage(channelId: string, content: string): void
  onMessage(callback: (message: ChatMessage) => void): void
  
  // Game events  
  requestTravel(locationId: string): void
  onLocationChanged(callback: (location: Location) => void): void
  
  // Character events
  onStatsUpdate(callback: (stats: CharacterStats) => void): void
  
  // Guild events
  onGuildUpdate(callback: (guild: Guild) => void): void
}
```

### **Real-time State Synchronization**
- **Redux middleware** for WebSocket event handling
- **Automatic reconnection** with exponential backoff
- **Event queuing** during disconnection
- **State reconciliation** on reconnection

---

## 📊 **STATE MANAGEMENT**

### **Redux Store Structure**
```typescript
interface RootState {
  auth: AuthState;
  character: CharacterState;
  world: WorldState;
  chat: ChatState;
  quests: QuestState;
  guilds: GuildState;
  ui: UIState;
}
```

### **Auth Slice**
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### **Character Slice**
```typescript
interface CharacterState {
  characters: Character[];
  activeCharacter: Character | null;
  stats: CharacterStats | null;
  loading: boolean;
  error: string | null;
}
```

### **World Slice**
```typescript
interface WorldState {
  currentLocation: Location | null;
  mapData: {
    locations: Location[];
    connections: LocationConnection[];
    regions: Region[];
  };
  zoom: 1 | 4 | 16 | 64;
  center: { x: number; y: number };
  loading: boolean;
}
```

### **Chat Slice**
```typescript
interface ChatState {
  channels: ChatChannel[];
  activeChannel: string | null;
  messages: { [channelId: string]: ChatMessage[] };
  unreadCounts: { [channelId: string]: number };
  isConnected: boolean;
}
```

---

## 🎮 **KEY FEATURES IMPLEMENTATION**

### **1. Character Creation Wizard**
- **Multi-step form** with validation
- **Real-time stat calculation** preview
- **Class selection** with detailed descriptions
- **Stat allocation** with drag & drop or +/- buttons
- **Preview modal** before final creation

### **2. Interactive Map System**
- **Canvas-based rendering** for performance
- **Smooth zoom transitions** with animations
- **Location clustering** at low zoom levels
- **Path-finding visualization** for travel
- **Real-time player positions** (if visible)

### **3. Real-time Chat Interface**
- **Channel switching** with smooth transitions
- **Message threading** (future feature)
- **Emote support** and custom reactions
- **Moderation tools** (for authorized users)
- **Private message** interface

### **4. Quest Management**
- **Progress tracking** with visual indicators
- **Objective reminders** in UI
- **Auto-update** from server events
- **Quest sharing** between party members
- **Reward preview** animations

### **5. Guild Management Interface**
- **Member management** with role-based UI
- **Guild chat integration**
- **Treasury management** (leaders/officers)
- **Event scheduling** (future feature)
- **Guild advancement** tracking

---

## 📱 **RESPONSIVE DESIGN STRATEGY**

### **Mobile (375px - 767px):**
- **Bottom navigation** tabs
- **Collapsible panels** for space saving
- **Touch-optimized** interactions
- **Simplified map** interface
- **Chat overlay** modal

### **Tablet (768px - 1023px):**
- **Sidebar navigation** with icons
- **Split-screen** chat and game
- **Resizable panels**
- **Touch and mouse** support
- **Map with basic controls**

### **Desktop (1024px+):**
- **Full sidebar** with labels
- **Multi-panel** layout
- **Advanced map** controls
- **Keyboard shortcuts**
- **Multiple windows** support

---

## ⚡ **PERFORMANCE OPTIMIZATIONS**

### **Code Splitting:**
- **Route-based** splitting
- **Component lazy loading**
- **Feature-based** chunks
- **Vendor chunk** optimization

### **Rendering Optimizations:**
- **React.memo** for expensive components
- **useMemo** for complex calculations
- **Virtual scrolling** for large lists
- **Canvas rendering** for map

### **Network Optimizations:**
- **API response caching** with React Query
- **WebSocket message** batching
- **Image optimization** and lazy loading
- **Service worker** for offline support

### **Bundle Optimizations:**
- **Tree shaking** for unused code
- **Compression** (gzip/brotli)
- **Asset optimization** (images, fonts)
- **CDN delivery** for static assets

---

## 🧪 **TESTING STRATEGY**

### **Unit Testing:**
- **Component testing** with React Testing Library
- **Hook testing** with custom utilities
- **Service testing** with mocked dependencies
- **Utility function** testing

### **Integration Testing:**
- **API integration** with MSW (Mock Service Worker)
- **WebSocket integration** with mock server
- **Redux integration** testing
- **Navigation flow** testing

### **E2E Testing:**
- **User journey** testing with Playwright
- **Cross-browser** compatibility
- **Mobile device** testing
- **Performance** regression testing

---

## 🚀 **DEPLOYMENT STRATEGY**

### **Build Process:**
```bash
npm run build:client  # Vite production build
npm run test:ci       # Run all tests
npm run lint:check    # Code quality check
npm run type:check    # TypeScript validation
```

### **Environment Configuration:**
```typescript
// Environment variables
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0-mvp
```

### **Production Optimizations:**
- **Service worker** registration
- **Error boundary** implementation
- **Performance monitoring** integration
- **Analytics** tracking setup

---

## 📋 **IMPLEMENTATION ROADMAP**

### **Phase 1: Foundation (Days 1-3)**
1. ✅ **Project setup** with Vite + TypeScript
2. ✅ **Basic routing** and layout structure
3. ✅ **Authentication** system integration
4. ✅ **Redux store** configuration
5. ✅ **WebSocket service** setup

### **Phase 2: Core Features (Days 4-7)**
1. ✅ **Character creation** wizard
2. ✅ **Character selection** and management
3. ✅ **Basic game layout** with panels
4. ✅ **Chat system** integration
5. ✅ **World map** basic implementation

### **Phase 3: Game Features (Days 8-12)**
1. ✅ **Quest system** UI and logic
2. ✅ **Guild system** interface
3. ✅ **Advanced map** features
4. ✅ **Real-time updates** optimization
5. ✅ **Mobile responsiveness**

### **Phase 4: Polish & Testing (Days 13-15)**
1. ✅ **UI/UX refinements**
2. ✅ **Performance optimizations**
3. ✅ **Testing suite** completion
4. ✅ **Documentation** finalization
5. ✅ **Production deployment**

---

## 🎯 **SUCCESS METRICS**

### **Performance Targets:**
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3s

### **User Experience Targets:**
- **WebSocket connection:** < 500ms
- **Page transitions:** < 200ms
- **Chat message delivery:** < 100ms
- **Map zoom/pan:** 60fps smooth

### **Compatibility Targets:**
- **Modern browsers:** Chrome 90+, Firefox 88+, Safari 14+
- **Mobile devices:** iOS 14+, Android 10+
- **Screen readers:** WCAG 2.1 AA compliance
- **Network conditions:** Works on 3G+ connections

---

## 🔄 **INTEGRATION WITH BACKEND**

### **API Integration:**
- **RESTful endpoints** for CRUD operations
- **WebSocket events** for real-time updates
- **Authentication headers** for all requests
- **Error handling** with user-friendly messages

### **Data Synchronization:**
- **Optimistic updates** for better UX
- **Conflict resolution** for concurrent edits
- **Offline support** with queue system
- **Cache invalidation** strategies

---

This comprehensive technical specification provides the complete roadmap for implementing the React frontend. Should we proceed with the implementation based on this architecture?
