-- CreateTable
CREATE TABLE "career_clusters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cluster_name" TEXT NOT NULL,
    "description" TEXT,
    "dimension_rules" TEXT NOT NULL,
    "example_roles" TEXT NOT NULL,
    "growth_outlook" TEXT NOT NULL,
    "external_id" TEXT
);

-- CreateTable
CREATE TABLE "career_roadmaps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "career_cluster" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "skills" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "career_clusters_external_id_key" ON "career_clusters"("external_id");
