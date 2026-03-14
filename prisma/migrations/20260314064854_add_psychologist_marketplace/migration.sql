-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT,
    "psychologist_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "psychologists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_psychologists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "languages" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "profile_photo" TEXT,
    "bio" TEXT,
    "consultation_fee" INTEGER NOT NULL,
    "availability" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_psychologists" ("availability", "bio", "consultation_fee", "experience_years", "id", "languages", "name", "profile_photo", "rating", "specialization") SELECT "availability", "bio", "consultation_fee", "experience_years", "id", "languages", "name", "profile_photo", "rating", "specialization" FROM "psychologists";
DROP TABLE "psychologists";
ALTER TABLE "new_psychologists" RENAME TO "psychologists";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
