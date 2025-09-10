import { createClient } from 'redis'
import logger from '@/utils/logger'
import config from '@/config'

// Create Redis client
const redis = createClient({
  url: config.redisUrl,
})

// Handle Redis connection events
redis.on('connect', () => {
  logger.info('Redis client connected')
})

redis.on('ready', () => {
  logger.info('Redis client ready')
})

redis.on('error', (err) => {
  logger.error('Redis client error:', err)
})

redis.on('end', () => {
  logger.info('Redis client disconnected')
})

// Connect to Redis
const connectRedis = async () => {
  try {
    await redis.connect()
    logger.info('Connected to Redis successfully')
  } catch (error) {
    logger.error('Failed to connect to Redis:', error)
    throw error
  }
}

// Redis utility functions
export const redisUtils = {
  // Set key with TTL
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await redis.setEx(key, ttl, value)
      } else {
        await redis.set(key, value)
      }
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error)
      throw error
    }
  },

  // Get key
  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key)
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error)
      throw error
    }
  },

  // Delete key
  async del(key: string): Promise<number> {
    try {
      return await redis.del(key)
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error)
      throw error
    }
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error)
      throw error
    }
  },

  // Set expiry for existing key
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await redis.expire(key, seconds)
      return result === 1
    } catch (error) {
      logger.error(`Redis EXPIRE error for key ${key}:`, error)
      throw error
    }
  },

  // Increment counter
  async incr(key: string): Promise<number> {
    try {
      return await redis.incr(key)
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error)
      throw error
    }
  },

  // Hash operations
  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      return await redis.hSet(key, field, value)
    } catch (error) {
      logger.error(`Redis HSET error for key ${key}:`, error)
      throw error
    }
  },

  async hget(key: string, field: string): Promise<string | undefined> {
    try {
      return await redis.hGet(key, field)
    } catch (error) {
      logger.error(`Redis HGET error for key ${key}:`, error)
      throw error
    }
  },

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await redis.hGetAll(key)
    } catch (error) {
      logger.error(`Redis HGETALL error for key ${key}:`, error)
      throw error
    }
  },

  // List operations
  async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await redis.lPush(key, values)
    } catch (error) {
      logger.error(`Redis LPUSH error for key ${key}:`, error)
      throw error
    }
  },

  async rpop(key: string): Promise<string | null> {
    try {
      return await redis.rPop(key)
    } catch (error) {
      logger.error(`Redis RPOP error for key ${key}:`, error)
      throw error
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Disconnecting from Redis...')
  await redis.disconnect()
})

export { redis, connectRedis }
export default redis
