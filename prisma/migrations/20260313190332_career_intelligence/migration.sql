/*
  Warnings:

  - You are about to drop the column `cluster_name` on the `career_clusters` table. All the data in the column will be lost.
  - You are about to drop the column `dimension_rules` on the `career_clusters` table. All the data in the column will be lost.
  - You are about to drop the column `external_id` on the `career_clusters` table. All the data in the column will be lost.
  - You are about to drop the column `career_cluster` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `career_roadmaps` table. All the data in the column will be lost.
  - Added the required column `name` to the `career_clusters` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `career_clusters` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cluster_id` to the `career_roadmaps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `step` to the `career_roadmaps` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `career_roadmaps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `skills` on table `career_roadmaps` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "career_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "education" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "career_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "career_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "career_scores_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "career_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "career_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "cluster_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    CONSTRAINT "career_recommendations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "career_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "career_recommendations_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "career_clusters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "career_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "ai_summary" TEXT,
    "primary_cluster" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "career_reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "career_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_career_clusters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "example_roles" TEXT NOT NULL,
    "growth_outlook" TEXT NOT NULL
);
INSERT INTO "new_career_clusters" ("description", "example_roles", "growth_outlook", "id") SELECT "description", "example_roles", "growth_outlook", "id" FROM "career_clusters";
DROP TABLE "career_clusters";
ALTER TABLE "new_career_clusters" RENAME TO "career_clusters";
CREATE TABLE "new_career_roadmaps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cluster_id" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    CONSTRAINT "career_roadmaps_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "career_clusters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_career_roadmaps" ("description", "id", "skills", "title") SELECT "description", "id", "skills", "title" FROM "career_roadmaps";
DROP TABLE "career_roadmaps";
ALTER TABLE "new_career_roadmaps" RENAME TO "career_roadmaps";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "career_scores_session_id_dimension_key" ON "career_scores"("session_id", "dimension");

-- CreateIndex
CREATE UNIQUE INDEX "career_recommendations_session_id_rank_key" ON "career_recommendations"("session_id", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "career_reports_session_id_key" ON "career_reports"("session_id");
