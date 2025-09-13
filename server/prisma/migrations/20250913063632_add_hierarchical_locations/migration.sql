/*
  Warnings:

  - You are about to drop the column `locationId` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `isPvpEnabled` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `isSafeZone` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `isStartArea` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `maxPlayers` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `z` on the `locations` table. All the data in the column will be lost.
  - Added the required column `tier` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LocationTier" AS ENUM ('continent', 'region', 'city', 'location');

-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_locationId_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_parentId_fkey";

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "locationId",
ADD COLUMN     "current_location_id" TEXT;

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "isPvpEnabled",
DROP COLUMN "isSafeZone",
DROP COLUMN "isStartArea",
DROP COLUMN "maxPlayers",
DROP COLUMN "parentId",
DROP COLUMN "type",
DROP COLUMN "x",
DROP COLUMN "y",
DROP COLUMN "z",
ADD COLUMN     "coordinates_x" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "coordinates_y" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "coordinates_z" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_accessible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_discovered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_known" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_pvp_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_safe_zone" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_start_area" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lore_connections" JSONB,
ADD COLUMN     "max_players" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "population" INTEGER,
ADD COLUMN     "requirements" JSONB,
ADD COLUMN     "special_features" TEXT[],
ADD COLUMN     "tier" "LocationTier" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "LocationType";

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
