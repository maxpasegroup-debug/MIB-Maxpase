-- CreateTable
CREATE TABLE "referral_partners" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT,
    "commission" INTEGER NOT NULL DEFAULT 30,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partner_id" TEXT NOT NULL,
    "student_email" TEXT NOT NULL,
    "test_type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "commission" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "referrals_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "referral_partners" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "referral_partners_email_key" ON "referral_partners"("email");
