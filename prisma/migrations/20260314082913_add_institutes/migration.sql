-- CreateTable
CREATE TABLE "institutes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "institute_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institute_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "age" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "institute_students_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "institute_tests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institute_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "session_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "institute_tests_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "institute_tests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "institute_students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "institute_tests_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "career_10d_sessions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "institutes_email_key" ON "institutes"("email");
