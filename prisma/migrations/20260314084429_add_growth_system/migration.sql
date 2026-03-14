-- CreateTable
CREATE TABLE "growth_missions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_missions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" DATETIME,
    CONSTRAINT "user_missions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "career_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_missions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "growth_missions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_growth" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_active" DATETIME,
    CONSTRAINT "user_growth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "career_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_growth_user_id_key" ON "user_growth"("user_id");
