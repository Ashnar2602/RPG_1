/*
  Warnings:

  - The values [WARRIOR,MAGE,ROGUE,CLERIC,PALADIN,BARD,MONK,BARBARIAN] on the enum `CharacterClass` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `agility` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `baseStamina` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `vitality` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `wisdom` on the `characters` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLAYER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "TraitType" AS ENUM ('RACIAL', 'CLASS', 'SELECTED', 'ACQUIRED');

-- AlterEnum
BEGIN;
CREATE TYPE "CharacterClass_new" AS ENUM ('GUERRIERO', 'MAGO', 'FURFANTE', 'PALADINO', 'ASSASSINO', 'ARCIMAGO', 'ELEMENTALISTA', 'RANGER', 'MONACO', 'WARLOCK', 'BARDO');
ALTER TABLE "characters" ALTER COLUMN "class" TYPE "CharacterClass_new" USING ("class"::text::"CharacterClass_new");
ALTER TABLE "items" ALTER COLUMN "classRequired" TYPE "CharacterClass_new" USING ("classRequired"::text::"CharacterClass_new");
ALTER TYPE "CharacterClass" RENAME TO "CharacterClass_old";
ALTER TYPE "CharacterClass_new" RENAME TO "CharacterClass";
DROP TYPE "CharacterClass_old";
COMMIT;

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "agility",
DROP COLUMN "baseStamina",
DROP COLUMN "vitality",
DROP COLUMN "wisdom",
ADD COLUMN     "alignment" TEXT NOT NULL DEFAULT 'NN',
ADD COLUMN     "background" TEXT,
ADD COLUMN     "basePower" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
ADD COLUMN     "dexterity" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "luck" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "stamina" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "willpower" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'PLAYER';

-- CreateTable
CREATE TABLE "character_traits" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "traitType" "TraitType" NOT NULL,
    "traitName" TEXT NOT NULL,
    "description" TEXT,
    "effect" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "character_traits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_avatars" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "race" "CharacterRace" NOT NULL,
    "avatarData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_avatars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_personality" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "personalityTraits" TEXT[],
    "motivations" TEXT[],
    "fears" TEXT[],
    "playstyles" TEXT[],
    "communicationStyle" TEXT[],
    "moralCode" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_personality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uiTheme" TEXT NOT NULL DEFAULT 'classic_fantasy',
    "customColors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "character_avatars_characterId_key" ON "character_avatars"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "character_personality_characterId_key" ON "character_personality"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- AddForeignKey
ALTER TABLE "character_traits" ADD CONSTRAINT "character_traits_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_avatars" ADD CONSTRAINT "character_avatars_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_personality" ADD CONSTRAINT "character_personality_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
