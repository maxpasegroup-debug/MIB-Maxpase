-- CreateTable
CREATE TABLE "psychologists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "languages" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "profile_photo" TEXT,
    "bio" TEXT,
    "consultation_fee" INTEGER NOT NULL,
    "availability" TEXT
);
