-- CreateTable
CREATE TABLE "institute_analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institute_id" TEXT NOT NULL,
    "total_students" INTEGER NOT NULL,
    "active_trainees" INTEGER NOT NULL,
    "avg_readiness" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "institute_analytics_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_performance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "readiness" REAL NOT NULL,
    "accuracy" REAL NOT NULL,
    "speed" REAL NOT NULL,
    "weak_topics" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "student_performance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "institute_students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "student_performance_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "institute_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institute_id" TEXT NOT NULL,
    "report_data" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "institute_reports_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
