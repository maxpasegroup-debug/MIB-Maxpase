-- CreateTable
CREATE TABLE "career_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_career_10d_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "user_name" TEXT,
    "user_email" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "career_10d_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "career_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_career_10d_sessions" ("created_at", "id", "user_email", "user_name") SELECT "created_at", "id", "user_email", "user_name" FROM "career_10d_sessions";
DROP TABLE "career_10d_sessions";
ALTER TABLE "new_career_10d_sessions" RENAME TO "career_10d_sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "career_users_email_key" ON "career_users"("email");
