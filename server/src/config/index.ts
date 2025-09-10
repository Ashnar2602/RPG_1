import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  // Server
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  
  // Database
  databaseUrl: string;
  redisUrl: string;
  
  // Authentication
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  bcryptRounds: number;
  
  // Rate Limiting
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  
  // Game
  gameTickRate: number;
  maxPlayersPerLocation: number;
  autoSaveInterval: number;
  sessionTimeout: number;
  
  // Logging
  logLevel: string;
  logFile: string;
  logMaxSize: string;
  logMaxFiles: number;
  
  // AI
  openaiApiKey?: string;
  claudeApiKey?: string;
  aiEnabled: boolean;
  
  // WebSocket
  wsHeartbeatInterval: number;
  wsHeartbeatTimeout: number;
  
  // Cache
  cacheTtl: number;
  cacheMaxKeys: number;
}

const config: Config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Authentication
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  
  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Game
  gameTickRate: parseInt(process.env.GAME_TICK_RATE || '60', 10),
  maxPlayersPerLocation: parseInt(process.env.MAX_PLAYERS_PER_LOCATION || '50', 10),
  autoSaveInterval: parseInt(process.env.AUTO_SAVE_INTERVAL || '30000', 10),
  sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '1800000', 10),
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'logs/app.log',
  logMaxSize: process.env.LOG_MAX_SIZE || '10mb',
  logMaxFiles: parseInt(process.env.LOG_MAX_FILES || '5', 10),
  
  // AI
  openaiApiKey: process.env.OPENAI_API_KEY,
  claudeApiKey: process.env.CLAUDE_API_KEY,
  aiEnabled: process.env.AI_ENABLED === 'true',
  
  // WebSocket
  wsHeartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL || '30000', 10),
  wsHeartbeatTimeout: parseInt(process.env.WS_HEARTBEAT_TIMEOUT || '60000', 10),
  
  // Cache
  cacheTtl: parseInt(process.env.CACHE_TTL || '3600', 10),
  cacheMaxKeys: parseInt(process.env.CACHE_MAX_KEYS || '10000', 10),
};

// Validation
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (config.jwtSecret === 'fallback-secret-key' && config.nodeEnv === 'production') {
  throw new Error('JWT_SECRET must be set in production environment');
}

export default config;
