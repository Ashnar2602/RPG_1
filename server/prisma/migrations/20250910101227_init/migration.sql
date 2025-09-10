-- CreateEnum
CREATE TYPE "CharacterRace" AS ENUM ('HUMAN', 'ELF', 'DWARF', 'GNOME', 'ORC', 'TROLL', 'LIZARDMAN', 'FISHMAN', 'AERATHI', 'GUOLGARN', 'ZARKAAN');

-- CreateEnum
CREATE TYPE "CharacterClass" AS ENUM ('WARRIOR', 'MAGE', 'ROGUE', 'CLERIC', 'RANGER', 'PALADIN', 'WARLOCK', 'BARD', 'MONK', 'BARBARIAN');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('TOWN', 'CITY', 'VILLAGE', 'DUNGEON', 'WILDERNESS', 'CAVE', 'FOREST', 'MOUNTAIN', 'DESERT', 'SWAMP', 'RUINS', 'TEMPLE');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('WEAPON', 'ARMOR', 'ACCESSORY', 'CONSUMABLE', 'MATERIAL', 'QUEST', 'CURRENCY', 'MISC');

-- CreateEnum
CREATE TYPE "ItemRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC');

-- CreateEnum
CREATE TYPE "EquipmentSlot" AS ENUM ('HEAD', 'CHEST', 'LEGS', 'FEET', 'HANDS', 'MAIN_HAND', 'OFF_HAND', 'RING_1', 'RING_2', 'NECKLACE', 'BELT', 'CLOAK');

-- CreateEnum
CREATE TYPE "CombatActionType" AS ENUM ('ATTACK', 'DEFEND', 'SKILL', 'SPELL', 'HEAL', 'BUFF', 'DEBUFF', 'FLEE');

-- CreateEnum
CREATE TYPE "NPCType" AS ENUM ('MERCHANT', 'GUARD', 'QUEST_GIVER', 'MONSTER', 'BOSS', 'CRAFTER', 'TRAINER');

-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('KILL', 'COLLECT', 'DELIVERY', 'EXPLORATION', 'STORY', 'DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED', 'TURNED_IN');

-- CreateEnum
CREATE TYPE "GuildRole" AS ENUM ('MEMBER', 'OFFICER', 'VICE_LEADER', 'LEADER');

-- CreateEnum
CREATE TYPE "FriendStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('GLOBAL', 'LOCAL', 'GUILD', 'PARTY', 'WHISPER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PLAYER_LOGIN', 'PLAYER_LOGOUT', 'PLAYER_LEVEL_UP', 'PLAYER_DEATH', 'GUILD_CREATED', 'GUILD_DISBANDED', 'QUEST_COMPLETED', 'ITEM_CRAFTED', 'COMBAT_START', 'COMBAT_END');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "race" "CharacterRace" NOT NULL,
    "class" "CharacterClass" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "baseHealth" INTEGER NOT NULL DEFAULT 100,
    "baseMana" INTEGER NOT NULL DEFAULT 50,
    "baseStamina" INTEGER NOT NULL DEFAULT 100,
    "strength" INTEGER NOT NULL DEFAULT 10,
    "agility" INTEGER NOT NULL DEFAULT 10,
    "intelligence" INTEGER NOT NULL DEFAULT 10,
    "vitality" INTEGER NOT NULL DEFAULT 10,
    "wisdom" INTEGER NOT NULL DEFAULT 10,
    "charisma" INTEGER NOT NULL DEFAULT 10,
    "currentHealth" INTEGER NOT NULL DEFAULT 100,
    "currentMana" INTEGER NOT NULL DEFAULT 50,
    "currentStamina" INTEGER NOT NULL DEFAULT 100,
    "locationId" TEXT,
    "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "z" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "facing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 100,
    "gems" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "LocationType" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isStartArea" BOOLEAN NOT NULL DEFAULT false,
    "isSafeZone" BOOLEAN NOT NULL DEFAULT true,
    "isPvpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "maxPlayers" INTEGER NOT NULL DEFAULT 50,
    "parentId" TEXT,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spawn_points" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "respawnTime" INTEGER NOT NULL DEFAULT 300,
    "lastSpawn" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "spawn_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ItemType" NOT NULL,
    "subType" TEXT,
    "rarity" "ItemRarity" NOT NULL DEFAULT 'COMMON',
    "value" INTEGER NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "maxStack" INTEGER NOT NULL DEFAULT 1,
    "damage" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "durability" INTEGER NOT NULL DEFAULT 100,
    "levelRequired" INTEGER NOT NULL DEFAULT 1,
    "classRequired" "CharacterClass",
    "raceRequired" "CharacterRace",

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "slot" INTEGER,
    "durability" INTEGER,
    "enchantLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "slot" "EquipmentSlot" NOT NULL,
    "durability" INTEGER NOT NULL DEFAULT 100,
    "enchantLevel" INTEGER NOT NULL DEFAULT 0,
    "equippedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combat_logs" (
    "id" TEXT NOT NULL,
    "attackerId" TEXT,
    "defenderId" TEXT,
    "type" "CombatActionType" NOT NULL,
    "damage" INTEGER NOT NULL DEFAULT 0,
    "heal" INTEGER NOT NULL DEFAULT 0,
    "critical" BOOLEAN NOT NULL DEFAULT false,
    "miss" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "combat_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "npcs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "NPCType" NOT NULL,
    "race" "CharacterRace" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "health" INTEGER NOT NULL DEFAULT 100,
    "damage" INTEGER NOT NULL DEFAULT 10,
    "defense" INTEGER NOT NULL DEFAULT 5,
    "locationId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "facing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAggressive" BOOLEAN NOT NULL DEFAULT false,
    "patrolRadius" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "goldDrop" INTEGER NOT NULL DEFAULT 0,
    "expDrop" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "npcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "QuestType" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "levelRequired" INTEGER NOT NULL DEFAULT 1,
    "prerequisiteQuestId" TEXT,
    "expReward" INTEGER NOT NULL DEFAULT 0,
    "goldReward" INTEGER NOT NULL DEFAULT 0,
    "giveNPCId" TEXT,
    "turnInNPCId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_progress" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" "QuestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "maxProgress" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "quest_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" VARCHAR(5) NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "gems" INTEGER NOT NULL DEFAULT 0,
    "isRecruiting" BOOLEAN NOT NULL DEFAULT true,
    "minLevel" INTEGER NOT NULL DEFAULT 1,
    "maxMembers" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_members" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "role" "GuildRole" NOT NULL DEFAULT 'MEMBER',
    "expContributed" INTEGER NOT NULL DEFAULT 0,
    "goldContributed" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "status" "FriendStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_events" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "data" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "game_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "characters_name_key" ON "characters"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_characterId_slot_key" ON "inventory_items"("characterId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_characterId_slot_key" ON "equipment"("characterId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "quest_progress_characterId_questId_key" ON "quest_progress"("characterId", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_name_key" ON "guilds"("name");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_tag_key" ON "guilds"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "guild_members_characterId_key" ON "guild_members"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "guild_members_userId_key" ON "guild_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "friends_userId_friendId_key" ON "friends"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "game_config_key_key" ON "game_config"("key");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spawn_points" ADD CONSTRAINT "spawn_points_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combat_logs" ADD CONSTRAINT "combat_logs_attackerId_fkey" FOREIGN KEY ("attackerId") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_prerequisiteQuestId_fkey" FOREIGN KEY ("prerequisiteQuestId") REFERENCES "quests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_giveNPCId_fkey" FOREIGN KEY ("giveNPCId") REFERENCES "npcs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "chat_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
