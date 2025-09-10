import { Server as SocketIOServer, Socket } from 'socket.io'
import { verifyToken } from '@/middleware/auth'
import logger from '@/utils/logger'
import { redisUtils } from '@/utils/redis'
import prisma from '@/utils/database'

// Connected users map
const connectedUsers = new Map<string, {
  socket: Socket
  userId: string
  characterId?: string
  locationId?: string
}>()

// Online users per location
const locationUsers = new Map<string, Set<string>>()

export function setupWebSocket(io: SocketIOServer) {
  // Authentication middleware for WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]
      
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      const payload = verifyToken(token)
      if (!payload) {
        return next(new Error('Invalid token'))
      }

      // Check if token is blacklisted
      const blacklisted = await redisUtils.exists(`blacklist:${token}`)
      if (blacklisted) {
        return next(new Error('Token has been revoked'))
      }

      // Attach user info to socket
      socket.data.user = {
        id: payload.id,
        email: payload.email,
        username: payload.username,
      }

      next()
    } catch (error) {
      logger.error('WebSocket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket) => {
    const user = socket.data.user
    logger.info(`User connected via WebSocket: ${user.username} (${user.id})`)

    // Store connection
    connectedUsers.set(socket.id, {
      socket,
      userId: user.id,
    })

    // Handle character selection
    socket.on('character:select', async (data) => {
      try {
        const { characterId } = data
        
        // Verify character belongs to user
        const character = await prisma.character.findFirst({
          where: {
            id: characterId,
            userId: user.id,
          },
          include: {
            location: true,
          }
        })

        if (!character) {
          socket.emit('error', { message: 'Character not found' })
          return
        }

        // Update connection info
        const userConnection = connectedUsers.get(socket.id)
        if (userConnection) {
          userConnection.characterId = characterId
          userConnection.locationId = character.locationId || undefined
        }

        // Join location room
        if (character.locationId) {
          socket.join(`location:${character.locationId}`)
          
          // Add to location users
          if (!locationUsers.has(character.locationId)) {
            locationUsers.set(character.locationId, new Set())
          }
          locationUsers.get(character.locationId)!.add(socket.id)

          // Notify other players in location
          socket.to(`location:${character.locationId}`).emit('player:joined', {
            characterId: characterId,
            characterName: character.name,
            position: {
              x: character.x,
              y: character.y,
              z: character.z,
              facing: character.facing,
            }
          })
        }

        socket.emit('character:selected', {
          characterId,
          locationId: character.locationId,
          position: {
            x: character.x,
            y: character.y,
            z: character.z,
            facing: character.facing,
          }
        })

        logger.info(`Character selected: ${character.name} (${characterId}) by ${user.username}`)

      } catch (error) {
        logger.error('Character select error:', error)
        socket.emit('error', { message: 'Failed to select character' })
      }
    })

    // Handle player movement
    socket.on('player:move', async (data) => {
      try {
        const userConnection = connectedUsers.get(socket.id)
        if (!userConnection?.characterId) {
          socket.emit('error', { message: 'No character selected' })
          return
        }

        const { x, y, z, facing } = data

        // Update character position in database
        await prisma.character.update({
          where: { id: userConnection.characterId },
          data: { x, y, z, facing, updatedAt: new Date() }
        })

        // Broadcast movement to other players in the same location
        if (userConnection.locationId) {
          socket.to(`location:${userConnection.locationId}`).emit('player:moved', {
            characterId: userConnection.characterId,
            position: { x, y, z, facing }
          })
        }

      } catch (error) {
        logger.error('Player move error:', error)
        socket.emit('error', { message: 'Failed to update position' })
      }
    })

    // Handle location change
    socket.on('player:changeLocation', async (data) => {
      try {
        const userConnection = connectedUsers.get(socket.id)
        if (!userConnection?.characterId) {
          socket.emit('error', { message: 'No character selected' })
          return
        }

        const { locationId, x, y, z } = data

        // Verify location exists
        const location = await prisma.location.findUnique({
          where: { id: locationId }
        })

        if (!location) {
          socket.emit('error', { message: 'Location not found' })
          return
        }

        // Leave old location room
        if (userConnection.locationId) {
          socket.leave(`location:${userConnection.locationId}`)
          
          // Remove from location users
          const oldLocationUsers = locationUsers.get(userConnection.locationId)
          if (oldLocationUsers) {
            oldLocationUsers.delete(socket.id)
            if (oldLocationUsers.size === 0) {
              locationUsers.delete(userConnection.locationId)
            }
          }

          // Notify players in old location
          socket.to(`location:${userConnection.locationId}`).emit('player:left', {
            characterId: userConnection.characterId
          })
        }

        // Update character location in database
        await prisma.character.update({
          where: { id: userConnection.characterId },
          data: {
            locationId,
            x: x || location.x,
            y: y || location.y,
            z: z || location.z,
            updatedAt: new Date()
          }
        })

        // Join new location room
        socket.join(`location:${locationId}`)
        userConnection.locationId = locationId

        // Add to new location users
        if (!locationUsers.has(locationId)) {
          locationUsers.set(locationId, new Set())
        }
        locationUsers.get(locationId)!.add(socket.id)

        // Get character info
        const character = await prisma.character.findUnique({
          where: { id: userConnection.characterId },
          select: { name: true, x: true, y: true, z: true, facing: true }
        })

        // Notify players in new location
        socket.to(`location:${locationId}`).emit('player:joined', {
          characterId: userConnection.characterId,
          characterName: character?.name,
          position: {
            x: character?.x || location.x,
            y: character?.y || location.y,
            z: character?.z || location.z,
            facing: character?.facing || 0,
          }
        })

        socket.emit('location:changed', {
          locationId,
          location: {
            id: location.id,
            name: location.name,
            type: location.type,
            x: location.x,
            y: location.y,
            z: location.z,
          },
          position: {
            x: character?.x || location.x,
            y: character?.y || location.y,
            z: character?.z || location.z,
            facing: character?.facing || 0,
          }
        })

      } catch (error) {
        logger.error('Location change error:', error)
        socket.emit('error', { message: 'Failed to change location' })
      }
    })

    // Handle chat messages
    socket.on('chat:message', async (data) => {
      try {
        const userConnection = connectedUsers.get(socket.id)
        if (!userConnection?.characterId) {
          socket.emit('error', { message: 'No character selected' })
          return
        }

        const { message, channelType = 'LOCAL' } = data

        if (!message || message.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' })
          return
        }

        if (message.length > 500) {
          socket.emit('error', { message: 'Message too long' })
          return
        }

        // Get character info
        const character = await prisma.character.findUnique({
          where: { id: userConnection.characterId },
          select: { name: true }
        })

        // Create chat message
        const chatChannel = await prisma.chatChannel.findFirst({
          where: { type: channelType as any }
        })

        if (chatChannel) {
          await prisma.chatMessage.create({
            data: {
              channelId: chatChannel.id,
              userId: user.id,
              characterId: userConnection.characterId,
              message: message.trim(),
            }
          })
        }

        const messageData = {
          characterId: userConnection.characterId,
          characterName: character?.name,
          message: message.trim(),
          timestamp: new Date().toISOString(),
          channelType,
        }

        // Broadcast message based on channel type
        switch (channelType) {
          case 'LOCAL':
            if (userConnection.locationId) {
              io.to(`location:${userConnection.locationId}`).emit('chat:message', messageData)
            }
            break
          case 'GLOBAL':
            io.emit('chat:message', messageData)
            break
          default:
            socket.emit('chat:message', messageData)
        }

      } catch (error) {
        logger.error('Chat message error:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      const userConnection = connectedUsers.get(socket.id)
      
      if (userConnection) {
        // Remove from location
        if (userConnection.locationId) {
          const locationUsersSet = locationUsers.get(userConnection.locationId)
          if (locationUsersSet) {
            locationUsersSet.delete(socket.id)
            if (locationUsersSet.size === 0) {
              locationUsers.delete(userConnection.locationId)
            }
          }

          // Notify other players
          if (userConnection.characterId) {
            socket.to(`location:${userConnection.locationId}`).emit('player:left', {
              characterId: userConnection.characterId
            })
          }
        }

        connectedUsers.delete(socket.id)
        logger.info(`User disconnected: ${user.username} (${user.id})`)
      }
    })

    // Send initial connection success
    socket.emit('connected', {
      message: 'Connected to RPG server',
      userId: user.id,
      username: user.username,
    })
  })

  logger.info('WebSocket server initialized')
}

// Get online players count
export function getOnlinePlayersCount(): number {
  return connectedUsers.size
}

// Get players in location
export function getPlayersInLocation(locationId: string): number {
  return locationUsers.get(locationId)?.size || 0
}

// Broadcast to all connected users
export function broadcastToAll(event: string, data: any): void {
  connectedUsers.forEach(({ socket }) => {
    socket.emit(event, data)
  })
}

// Broadcast to location
export function broadcastToLocation(locationId: string, event: string, data: any): void {
  const locationUsersSet = locationUsers.get(locationId)
  if (locationUsersSet) {
    locationUsersSet.forEach((socketId) => {
      const userConnection = connectedUsers.get(socketId)
      if (userConnection) {
        userConnection.socket.emit(event, data)
      }
    })
  }
}
