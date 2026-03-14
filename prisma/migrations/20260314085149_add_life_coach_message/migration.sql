-- CreateTable
CREATE TABLE "life_coach_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "habits" TEXT,
    "date" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "life_coach_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "career_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "life_coach_messages_user_id_date_key" ON "life_coach_messages"("user_id", "date");
