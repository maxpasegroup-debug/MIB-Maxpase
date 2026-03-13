-- CreateTable
CREATE TABLE "question_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question_id" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "translated_text" TEXT NOT NULL,
    CONSTRAINT "question_translations_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category_id" TEXT NOT NULL,
    "sub_area" TEXT,
    "age_group" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "trait_measured" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "cultural_context" BOOLEAN NOT NULL DEFAULT false,
    "tech_context" BOOLEAN NOT NULL DEFAULT false,
    "test_type" TEXT NOT NULL,
    "display_order" INTEGER,
    "reverse_scored" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_questions" ("age_group", "category_id", "created_at", "cultural_context", "id", "question_text", "sub_area", "tech_context", "test_type", "trait_measured", "weight") SELECT "age_group", "category_id", "created_at", "cultural_context", "id", "question_text", "sub_area", "tech_context", "test_type", "trait_measured", "weight" FROM "questions";
DROP TABLE "questions";
ALTER TABLE "new_questions" RENAME TO "questions";
CREATE TABLE "new_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "stress_score" INTEGER NOT NULL,
    "confidence_score" INTEGER NOT NULL,
    "emotional_score" INTEGER NOT NULL,
    "trait_scores" TEXT,
    "ai_analysis" TEXT,
    "psychologist_notes" TEXT,
    "reviewed_by_psychologist" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "test_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_results" ("ai_analysis", "confidence_score", "emotional_score", "id", "session_id", "stress_score", "trait_scores") SELECT "ai_analysis", "confidence_score", "emotional_score", "id", "session_id", "stress_score", "trait_scores" FROM "results";
DROP TABLE "results";
ALTER TABLE "new_results" RENAME TO "results";
CREATE UNIQUE INDEX "results_session_id_key" ON "results"("session_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "question_translations_question_id_language_code_key" ON "question_translations"("question_id", "language_code");
