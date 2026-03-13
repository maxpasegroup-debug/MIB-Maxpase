-- CreateTable
CREATE TABLE "test_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trigger_trait" TEXT NOT NULL,
    "trigger_condition" TEXT NOT NULL,
    "recommended_category" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "test_recommendations_recommended_category_fkey" FOREIGN KEY ("recommended_category") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
