-- CreateEnum
CREATE TYPE "HeroRole" AS ENUM ('HEALER', 'DAMAGE_DEALER', 'GUARDIAN', 'SUPPORT');

-- CreateEnum
CREATE TYPE "Element" AS ENUM ('WATER', 'FIRE', 'WIND', 'EARTH', 'ICE', 'INFERNO', 'CYCLONE', 'MUD', 'FROST', 'PLASMA', 'TEMPEST', 'SAND', 'GLACIER', 'PHOENIX', 'HURRICANE', 'ROCK', 'TSUNAMI', 'SUPERNOVA', 'WHIRLWIND', 'TITAN');

-- CreateTable
CREATE TABLE "heroes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "HeroRole" NOT NULL,
    "element" "Element" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heroes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "nextXp" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_hero_collection" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "heroId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "power" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_hero_collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "heroes_name_key" ON "heroes"("name");

-- AddForeignKey
ALTER TABLE "user_hero_collection" ADD CONSTRAINT "user_hero_collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hero_collection" ADD CONSTRAINT "user_hero_collection_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "heroes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
