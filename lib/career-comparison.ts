/**
 * MIB Career Intelligence™ — Career comparison & outlook metadata
 * Used for Compare Your Career Options, Career Outlook, and Skill Gap.
 */

export type DemandLevel = "Low" | "Medium" | "High" | "Very High" | "Growing rapidly";
export type ImpactLevel = "Low" | "Medium" | "High";

export interface CareerComparisonMeta {
  id: string;
  name: string;
  description: string;
  growthPotential: DemandLevel;
  skillDifficulty: "Low" | "Medium" | "High";
  futureDemand: DemandLevel;
  salaryRange: string; // e.g. "₹6L – ₹25L"
  aiImpact: ImpactLevel;
  industryGrowth: string; // e.g. "High"
  /** Skills used for skill-gap analysis; status derived from profile */
  skills: string[];
}

const toId = (name: string) =>
  name.toLowerCase().replace(/\s*&\s*/g, "_").replace(/\s+/g, "_");

export const CAREER_COMPARISON_META: CareerComparisonMeta[] = [
  {
    id: "product_design",
    name: "Product Designer",
    description: "UX/UI, design systems, user research",
    growthPotential: "High",
    skillDifficulty: "Medium",
    futureDemand: "Very High",
    salaryRange: "₹6L – ₹25L",
    aiImpact: "Low",
    industryGrowth: "High",
    skills: ["Design Thinking", "UX Research", "UI Tools", "Communication", "Prototyping"],
  },
  {
    id: "digital_marketing",
    name: "Digital Marketing Strategist",
    description: "Content, analytics, growth marketing",
    growthPotential: "High",
    skillDifficulty: "Medium",
    futureDemand: "Very High",
    salaryRange: "₹5L – ₹22L",
    aiImpact: "Medium",
    industryGrowth: "High",
    skills: ["Content Strategy", "Analytics", "Communication", "Creative Campaigns", "SEO"],
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneur",
    description: "Startups, ventures, leadership",
    growthPotential: "Very High",
    skillDifficulty: "High",
    futureDemand: "High",
    salaryRange: "₹0 – ₹50L+",
    aiImpact: "Low",
    industryGrowth: "Very High",
    skills: ["Strategic Planning", "Leadership", "Resource Management", "Risk Assessment", "Sales"],
  },
  {
    id: "engineering",
    name: "Software Engineer",
    description: "Software, systems, innovation",
    growthPotential: "High",
    skillDifficulty: "High",
    futureDemand: "Very High",
    salaryRange: "₹8L – ₹35L",
    aiImpact: "Medium",
    industryGrowth: "High",
    skills: ["Programming", "Systems Thinking", "Problem Solving", "Technical Design", "APIs"],
  },
  {
    id: "psychology_counseling",
    name: "Psychology & Counseling",
    description: "Counselling, HR, behavioural science",
    growthPotential: "High",
    skillDifficulty: "Medium",
    futureDemand: "High",
    salaryRange: "₹4L – ₹18L",
    aiImpact: "Low",
    industryGrowth: "High",
    skills: ["Active Listening", "Empathy", "Assessment", "Communication", "Ethics"],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Analysis, risk, financial strategy",
    growthPotential: "High",
    skillDifficulty: "High",
    futureDemand: "High",
    salaryRange: "₹6L – ₹28L",
    aiImpact: "Medium",
    industryGrowth: "Medium",
    skills: ["Financial Modelling", "Data Analysis", "Excel & Tools", "Risk Assessment"],
  },
  {
    id: "education",
    name: "Education & EdTech",
    description: "Teaching, edtech, training",
    growthPotential: "Medium",
    skillDifficulty: "Medium",
    futureDemand: "High",
    salaryRange: "₹3L – ₹15L",
    aiImpact: "Medium",
    industryGrowth: "High",
    skills: ["Instructional Design", "Communication", "Patience", "Assessment"],
  },
  {
    id: "media_design",
    name: "Media & Design",
    description: "Visual storytelling, creative media",
    growthPotential: "High",
    skillDifficulty: "Medium",
    futureDemand: "High",
    salaryRange: "₹4L – ₹20L",
    aiImpact: "Low",
    industryGrowth: "High",
    skills: ["Visual Design", "Storytelling", "Branding", "Design Tools", "Communication"],
  },
  {
    id: "counseling",
    name: "Counseling",
    description: "Support, guidance, empathy-driven roles",
    growthPotential: "High",
    skillDifficulty: "Medium",
    futureDemand: "High",
    salaryRange: "₹3L – ₹14L",
    aiImpact: "Low",
    industryGrowth: "High",
    skills: ["Empathy", "Active Listening", "Crisis Support", "Communication", "Ethics"],
  },
];

export function getCareerComparisonMeta(careerNameOrId: string): CareerComparisonMeta | undefined {
  const id = toId(careerNameOrId);
  return CAREER_COMPARISON_META.find(
    (c) => c.id === id || toId(c.name) === id
  );
}

export function getComparisonMetaForCareers(careerNames: string[]): CareerComparisonMeta[] {
  const result: CareerComparisonMeta[] = [];
  for (const name of careerNames) {
    const meta = getCareerComparisonMeta(name);
    if (meta && !result.find((r) => r.id === meta.id)) result.push(meta);
  }
  return result;
}

/** Derive skill gap status from user's strength labels (e.g. "Creativity" → strong for design). */
export type SkillStatus = "Strong" | "Moderate" | "Beginner" | "Needed";

export function getSkillGapStatus(
  skill: string,
  topStrengthLabels: string[]
): SkillStatus {
  const s = skill.toLowerCase();
  if (topStrengthLabels.some((l) => l.toLowerCase().includes("creativ") && (s.includes("design") || s.includes("creative")))) return "Strong";
  if (topStrengthLabels.some((l) => l.toLowerCase().includes("leadership") && (s.includes("leadership") || s.includes("management")))) return "Strong";
  if (topStrengthLabels.some((l) => l.toLowerCase().includes("communicat") && s.includes("communicat"))) return "Strong";
  if (s.includes("research") || s.includes("analytics")) return "Moderate";
  if (s.includes("tools") || s.includes("technical") || s.includes("programming")) return "Beginner";
  return "Needed";
}
