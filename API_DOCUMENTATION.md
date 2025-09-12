# 📡 API Documentation - L'Esperimento di Ashnar

## 🔗 Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## 🔐 Autenticazione

### JWT Token System
Tutte le route protette richiedono un header di autorizzazione:

```http
Authorization: Bearer <jwt-token>
```

### Token Format
```json
{
  "userId": "string",
  "username": "string", 
  "role": "PLAYER" | "ADMIN",
  "iat": number,
  "exp": number
}
```

---

## 🔑 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "PLAYER",
      "createdAt": "datetime"
    },
    "token": "jwt-string"
  }
}
```

**Error Responses:**
- `400`: Validation errors (username taken, invalid email, etc.)
- `500`: Server error

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "PLAYER"
    },
    "token": "jwt-string"
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `401`: Authentication failed
- `429`: Too many attempts (rate limited)

### Refresh Token
```http
POST /auth/refresh
```

**Headers:**
```http
Authorization: Bearer <current-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-string"
  }
}
```

### Password Recovery
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "email": "string",
  "tempPassword": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully. Login with your temporary password."
}
```

**Error Responses:**
- `400`: Email not found or invalid
- `500`: Server error

### Update Temporary Password
```http
POST /auth/update-temp-password
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentTempPassword": "string",
  "newPassword": "string"
}
```

**Password Requirements:**
- At least 8 characters long
- At least one lowercase letter (a-z)
- At least one uppercase letter (A-Z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400`: Validation errors or incorrect temporary password
- `401`: Authentication required

### Logout
```http
POST /auth/logout
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 Character Management Endpoints

### Get User Characters
```http
GET /characters
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "uuid",
        "name": "string",
        "race": "string",
        "class": "string",
        "level": number,
        "alignment": "string",
        "stats": {
          "strength": number,
          "dexterity": number,
          "constitution": number,
          "intelligence": number,
          "wisdom": number,
          "charisma": number
        },
        "location": {
          "id": "uuid",
          "name": "string"
        },
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### Create Character
```http
POST /characters
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "raceId": "uuid",
  "classId": "uuid", 
  "alignment": "LAWFUL_GOOD" | "NEUTRAL_GOOD" | "CHAOTIC_GOOD" | "LAWFUL_NEUTRAL" | "NEUTRAL" | "CHAOTIC_NEUTRAL" | "LAWFUL_EVIL" | "NEUTRAL_EVIL" | "CHAOTIC_EVIL",
  "stats": {
    "strength": number,
    "dexterity": number,
    "constitution": number,
    "intelligence": number,
    "wisdom": number,
    "charisma": number
  },
  "traits": ["string"] // optional
}
```

**Validation Rules:**
- `name`: 3-20 characters, alphanumeric + spaces
- `stats`: Total sum must equal 15 + racial bonuses
- `alignment`: Must be valid alignment enum

**Response (201):**
```json
{
  "success": true,
  "message": "Character created successfully",
  "data": {
    "character": {
      "id": "uuid",
      "name": "string",
      "race": "string",
      "class": "string",
      "level": 1,
      "alignment": "string",
      "stats": {
        "strength": number,
        "dexterity": number,
        "constitution": number,
        "intelligence": number,
        "wisdom": number,
        "charisma": number
      },
      "hp": number,
      "mp": number,
      "location": {
        "id": "uuid",
        "name": "string"
      },
      "inventory": [],
      "createdAt": "datetime"
    }
  }
}
```

**Error Responses:**
- `400`: Validation errors, character limit reached
- `401`: Unauthorized
- `422`: Invalid stats distribution

### Get Character Details
```http
GET /characters/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "character": {
      "id": "uuid",
      "name": "string",
      "race": {
        "id": "uuid",
        "name": "string",
        "bonuses": {
          "strength": number,
          "dexterity": number,
          "constitution": number,
          "intelligence": number,
          "wisdom": number,
          "charisma": number
        }
      },
      "class": {
        "id": "uuid",
        "name": "string",
        "hitDie": number,
        "startingItems": ["string"]
      },
      "level": number,
      "experience": number,
      "alignment": "string",
      "stats": {
        "strength": number,
        "dexterity": number,
        "constitution": number,
        "intelligence": number,
        "wisdom": number,
        "charisma": number
      },
      "hp": number,
      "maxHp": number,
      "mp": number,
      "maxMp": number,
      "location": {
        "id": "uuid",
        "name": "string",
        "description": "string"
      },
      "inventory": [
        {
          "id": "uuid",
          "name": "string",
          "type": "string",
          "quantity": number
        }
      ],
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### Update Character
```http
PUT /characters/:id
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string", // optional
  "alignment": "string", // optional
  "locationId": "uuid" // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Character updated successfully",
  "data": {
    "character": {
      // updated character object
    }
  }
}
```

### Delete Character
```http
DELETE /characters/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Character deleted successfully"
}
```

**Error Responses:**
- `404`: Character not found
- `403`: Cannot delete character belonging to another user

---

## 🎮 Game Data Endpoints

### Get Available Races
```http
GET /game/races
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "races": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "bonuses": {
          "strength": number,
          "dexterity": number,
          "constitution": number,
          "intelligence": number,
          "wisdom": number,
          "charisma": number
        },
        "traits": ["string"],
        "lifespan": number,
        "size": "SMALL" | "MEDIUM" | "LARGE"
      }
    ]
  }
}
```

### Get Available Classes
```http
GET /game/classes
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "hitDie": number,
        "primaryStat": "string",
        "startingItems": ["string"],
        "abilities": ["string"]
      }
    ]
  }
}
```

### Get Locations
```http
GET /game/locations
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "type": "CITY" | "DUNGEON" | "WILDERNESS" | "SPECIAL",
        "discovered": boolean,
        "connections": [
          {
            "id": "uuid",
            "name": "string",
            "travelTime": number
          }
        ]
      }
    ]
  }
}
```

### Get Items Database
```http
GET /game/items
```

**Query Parameters:**
- `type`: Filter by item type (weapon, armor, consumable, etc.)
- `page`: Pagination page number
- `limit`: Items per page

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "type": "WEAPON" | "ARMOR" | "CONSUMABLE" | "MISC",
        "rarity": "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY",
        "value": number,
        "properties": {
          "damage": number, // for weapons
          "defense": number, // for armor
          "effects": ["string"] // for consumables
        }
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

---

## ⚔️ Combat System (Future)

### Start Battle
```http
POST /combat/start
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "characterId": "uuid",
  "targetType": "NPC" | "PLAYER",
  "targetId": "uuid"
}
```

### Get Battle State
```http
GET /combat/battle/:battleId
```

### Perform Action
```http
POST /combat/battle/:battleId/action
```

**Request Body:**
```json
{
  "action": "ATTACK" | "DEFEND" | "CAST_SPELL" | "USE_ITEM",
  "target": "uuid", // optional
  "itemId": "uuid", // for USE_ITEM
  "spellId": "uuid" // for CAST_SPELL
}
```

---

## 💬 Chat System (Future)

### Send Message
```http
POST /chat/message
```

**Request Body:**
```json
{
  "channel": "GLOBAL" | "LOCAL" | "GUILD" | "PRIVATE",
  "message": "string",
  "targetUserId": "uuid" // for private messages
}
```

### Get Messages
```http
GET /chat/messages
```

**Query Parameters:**
- `channel`: Channel type
- `limit`: Number of messages
- `before`: Message ID for pagination

---

## 🛡️ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // optional additional details
  }
}
```

### Common Error Codes

#### Authentication Errors
- `AUTH_REQUIRED`: Missing or invalid token
- `AUTH_EXPIRED`: Token expired
- `AUTH_INVALID`: Invalid credentials
- `RATE_LIMITED`: Too many requests

#### Validation Errors
- `VALIDATION_ERROR`: Request validation failed
- `MISSING_FIELD`: Required field missing
- `INVALID_FORMAT`: Field format invalid
- `CONSTRAINT_VIOLATION`: Database constraint violated

#### Resource Errors
- `NOT_FOUND`: Resource not found
- `ALREADY_EXISTS`: Resource already exists
- `FORBIDDEN`: Insufficient permissions
- `LIMIT_REACHED`: Resource limit exceeded

#### Server Errors
- `INTERNAL_ERROR`: Unexpected server error
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable
- `DATABASE_ERROR`: Database connection or query error

---

## 📊 Rate Limiting

### Limits per Endpoint

| Endpoint Group | Requests per Minute | Window |
|---------------|-------------------|---------|
| Authentication | 5 attempts | 15 minutes |
| Character CRUD | 30 requests | 1 minute |
| Game Data | 100 requests | 1 minute |
| Chat (Future) | 60 messages | 1 minute |

### Rate Limit Headers
```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 29
X-RateLimit-Reset: 1640995200
```

---

## 🔧 Development & Testing

### Health Check
```http
GET /health
```

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "datetime",
  "version": "1.0.0",
  "database": "connected",
  "uptime": number
}
```

### API Documentation
```http
GET /docs
```
Returns this documentation in interactive format.

---

## 📈 Metrics & Monitoring

### Performance Targets
- **Response Time**: <200ms for CRUD operations
- **Availability**: 99.9% uptime
- **Throughput**: 1000+ requests per minute
- **Concurrent Users**: 500+ simultaneous connections

### Monitoring Endpoints
- `/metrics`: Prometheus metrics
- `/health`: Health check
- `/status`: Detailed system status

---

## 🚀 Future API Expansions

### Planned Endpoints
- **Guild System**: `/guilds/*`
- **Quest System**: `/quests/*`
- **Trading System**: `/trade/*`
- **Events System**: `/events/*`
- **Admin Tools**: `/admin/*`

### WebSocket Events
- Real-time chat messages
- Battle state updates
- Player location changes
- System notifications

---

## 🔒 Security Considerations

### Best Practices
- Always use HTTPS in production
- Validate all input data
- Sanitize user-generated content
- Implement proper CORS policies
- Use parameterized queries for database access
- Log security events for monitoring

### Token Security
- JWT tokens expire after 7 days
- Refresh tokens before expiration
- Logout invalidates tokens server-side
- Use secure, random JWT secrets

### Data Protection
- Passwords hashed with bcryptjs
- Sensitive data encrypted at rest
- PII data handling compliance
- Regular security audits

---

Questa documentazione API fornisce tutto il necessario per integrare e utilizzare il backend del sistema RPG. Per ulteriori dettagli tecnici, consultare la [Technical Guide](./TECHNICAL_GUIDE.md).
