-- CreateTable
CREATE TABLE "career_10d_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_name" TEXT,
    "user_email" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "career_10d_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "creativity" INTEGER NOT NULL DEFAULT 0,
    "analytical" INTEGER NOT NULL DEFAULT 0,
    "leadership" INTEGER NOT NULL DEFAULT 0,
    "social" INTEGER NOT NULL DEFAULT 0,
    "technology" INTEGER NOT NULL DEFAULT 0,
    "entrepreneurial" INTEGER NOT NULL DEFAULT 0,
    "practical" INTEGER NOT NULL DEFAULT 0,
    "learning" INTEGER NOT NULL DEFAULT 0,
    "risk" INTEGER NOT NULL DEFAULT 0,
    "purpose" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "career_10d_scores_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "career_10d_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "career_10d_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "cluster" TEXT NOT NULL,
    "ai_report" TEXT NOT NULL,
    CONSTRAINT "career_10d_reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "career_10d_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "career_10d_scores_session_id_key" ON "career_10d_scores"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "career_10d_reports_session_id_key" ON "career_10d_reports"("session_id");
