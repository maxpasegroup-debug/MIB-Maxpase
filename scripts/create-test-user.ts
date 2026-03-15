/**
 * Create the test account that bypasses payments and sees all reports.
 * Email: nafi@mib2.in
 * Password: makeitbeautiful
 * Run: npx tsx scripts/create-test-user.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const TEST_EMAIL = "nafi@mib2.in";
const TEST_PASSWORD = "makeitbeautiful";
const TEST_NAME = "Test User (Bypass)";
const TEST_ROLE = "test";

async function main() {
  const hash = await bcrypt.hash(TEST_PASSWORD, 10);
  const user = await prisma.careerUser.upsert({
    where: { email: TEST_EMAIL.toLowerCase() },
    update: { password: hash, name: TEST_NAME, role: TEST_ROLE },
    create: {
      email: TEST_EMAIL.toLowerCase(),
      password: hash,
      name: TEST_NAME,
      role: TEST_ROLE,
    },
  });
  console.log("Test user created/updated:", user.email);
  console.log("  Login: email =", TEST_EMAIL, ", password =", TEST_PASSWORD);
  console.log("  This account bypasses payments and can see all reports.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
