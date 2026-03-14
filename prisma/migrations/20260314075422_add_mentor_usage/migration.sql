-- CreateTable
CREATE TABLE "mentor_usage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "date" TEXT NOT NULL,
    CONSTRAINT "mentor_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "career_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "mentor_usage_user_id_date_key" ON "mentor_usage"("user_id", "date");
