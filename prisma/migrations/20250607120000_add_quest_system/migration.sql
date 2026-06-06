-- AlterTable
ALTER TABLE "users" ADD COLUMN "gold" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "daily_quest_progress" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "date" TEXT NOT NULL,
    "mission1Completed" BOOLEAN NOT NULL DEFAULT false,
    "mission1Claimed" BOOLEAN NOT NULL DEFAULT false,
    "mission2Completed" BOOLEAN NOT NULL DEFAULT false,
    "mission2Claimed" BOOLEAN NOT NULL DEFAULT false,
    "mission3Completed" BOOLEAN NOT NULL DEFAULT false,
    "mission3Claimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_quest_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idle_quests" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idle_quests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_quest_progress_userId_date_key" ON "daily_quest_progress"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "idle_quests_userId_key" ON "idle_quests"("userId");

-- AddForeignKey
ALTER TABLE "daily_quest_progress" ADD CONSTRAINT "daily_quest_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idle_quests" ADD CONSTRAINT "idle_quests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
