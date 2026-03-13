/**
 * Seeds Career Intelligence: career_clusters and career_roadmaps.
 * Run after main seed: npx tsx prisma/seed-career.ts
 * Or invoked from seed.ts.
 */
import { PrismaClient } from "@prisma/client";
import { generateCareerRoadmap } from "../lib/careerRoadmap";

const prisma = new PrismaClient();

const CLUSTERS_TO_SEED: { name: string; description: string; exampleRoles: string[]; growthOutlook: string }[] = [
  { name: "Product Design", description: "UX/UI, design systems, user research", exampleRoles: ["UI/UX Designer", "Product Designer", "Interaction Designer"], growthOutlook: "High" },
  { name: "Engineering", description: "Software, systems, innovation", exampleRoles: ["Software Engineer", "Systems Engineer", "Data Engineer"], growthOutlook: "High" },
  { name: "Psychology & Counseling", description: "Counselling, HR, behavioural science", exampleRoles: ["Counsellor", "HR Specialist", "Behavioural Analyst"], growthOutlook: "High" },
  { name: "Entrepreneurship", description: "Startups, ventures, leadership", exampleRoles: ["Startup Founder", "Business Owner", "Venture Lead"], growthOutlook: "Very High" },
  { name: "Digital Marketing", description: "Content, analytics, growth", exampleRoles: ["Digital Marketing Strategist", "Content Lead", "Growth Marketer"], growthOutlook: "High" },
  { name: "Finance", description: "Analysis, risk, financial strategy", exampleRoles: ["Financial Analyst", "Risk Analyst", "Investment Associate"], growthOutlook: "High" },
  { name: "Counseling", description: "Support, guidance, empathy-driven roles", exampleRoles: ["Career Counsellor", "School Counsellor", "Wellness Coach"], growthOutlook: "High" },
  { name: "Media & Design", description: "Visual storytelling, creative media", exampleRoles: ["Graphic Designer", "Visual Designer", "Media Producer"], growthOutlook: "High" },
  { name: "Education & Training", description: "Teaching, edtech, training", exampleRoles: ["Teacher", "Trainer", "EdTech Specialist"], growthOutlook: "Medium" },
];

export async function seedCareerIntelligence() {
  const existing = await prisma.careerCluster.count();
  if (existing >= CLUSTERS_TO_SEED.length) {
    console.log("Career clusters already seeded; skipping.");
    return;
  }

  console.log("Seeding career clusters and roadmaps...");

  for (const c of CLUSTERS_TO_SEED) {
    let cluster = await prisma.careerCluster.findFirst({ where: { name: c.name } });
    if (!cluster) {
      cluster = await prisma.careerCluster.create({
        data: {
          name: c.name,
          description: c.description,
          exampleRoles: JSON.stringify(c.exampleRoles),
          growthOutlook: c.growthOutlook,
        },
      });
    } else {
      await prisma.careerCluster.update({
        where: { id: cluster.id },
        data: {
          description: c.description,
          exampleRoles: JSON.stringify(c.exampleRoles),
          growthOutlook: c.growthOutlook,
        },
      });
    }

    const steps = generateCareerRoadmap(c.name);
    const existingSteps = await prisma.careerRoadmap.count({ where: { clusterId: cluster.id } });
    if (existingSteps >= steps.length) continue;

    await prisma.careerRoadmap.deleteMany({ where: { clusterId: cluster.id } });
    for (const s of steps) {
      await prisma.careerRoadmap.create({
        data: {
          clusterId: cluster.id,
          step: s.step,
          title: s.title,
          description: s.description ?? "",
          skills: JSON.stringify(s.skills ?? []),
        },
      });
    }
  }

  console.log("Career Intelligence seed complete.");
}

if (require.main === module) {
  seedCareerIntelligence()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
