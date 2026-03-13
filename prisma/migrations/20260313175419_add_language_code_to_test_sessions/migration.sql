-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_test_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "category_id" TEXT NOT NULL,
    "test_type" TEXT NOT NULL,
    "language_code" TEXT NOT NULL DEFAULT 'en',
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    "score_summary" TEXT,
    CONSTRAINT "test_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "test_sessions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_test_sessions" ("category_id", "completed_at", "id", "score_summary", "started_at", "test_type", "user_id") SELECT "category_id", "completed_at", "id", "score_summary", "started_at", "test_type", "user_id" FROM "test_sessions";
DROP TABLE "test_sessions";
ALTER TABLE "new_test_sessions" RENAME TO "test_sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
