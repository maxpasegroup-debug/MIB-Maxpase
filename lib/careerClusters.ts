/**
 * MIB Career Intelligence™ — Career Cluster Mapping Engine
 * Maps 10D scores into recommended career domains.
 * Returns top 3 matching clusters with name, description, example_roles, growth_outlook.
 */

import type { CareerIntelligenceScores } from "./career-intelligence";

export interface CareerClusterMatch {
  id: string;
  name: string;
  description: string;
  dimension_rules: Record<string, number>;
  example_roles: string[];
  growth_outlook: string;
  skills: string[];
}

/** Minimum thresholds per dimension for each cluster (for DB/storage). */
type DimensionRules = Partial<Record<keyof CareerIntelligenceScores, number>>;

interface ClusterDef {
  id: string;
  name: string;
  description: string;
  dimension_rules: DimensionRules;
  example_roles: string[];
  growth_outlook: string;
  skills: string[];
  condition: (scores: CareerIntelligenceScores) => boolean;
}

const CLUSTERS: ClusterDef[] = [
  {
    id: "product_design",
    name: "Product Design",
    description: "UX/UI, design systems, user research",
    dimension_rules: { creativity: 75, technology: 65 },
    example_roles: ["UI/UX Designer", "Product Designer", "Interaction Designer"],
    growth_outlook: "High",
    skills: ["UX research", "UI design", "Prototyping", "User psychology", "Design thinking"],
    condition: (s) => (s.creativity ?? 0) > 75 && (s.technology ?? 0) > 65,
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Software, systems, innovation",
    dimension_rules: { cognitive: 75, skills: 70 },
    example_roles: ["Software Engineer", "Systems Engineer", "Data Engineer"],
    growth_outlook: "High",
    skills: ["Programming", "Systems thinking", "Problem solving", "Technical design"],
    condition: (s) => (s.cognitive ?? 0) > 75 && (s.skills ?? 0) > 70,
  },
  {
    id: "psychology_counseling",
    name: "Psychology & Counseling",
    description: "Counselling, HR, behavioural science",
    dimension_rules: { emotional: 75, personality: 65 },
    example_roles: ["Counsellor", "HR Specialist", "Behavioural Analyst"],
    growth_outlook: "High",
    skills: ["Active listening", "Empathy", "Assessment", "Communication", "Ethics"],
    condition: (s) => (s.emotional ?? 0) > 75 && (s.personality ?? 0) > 65,
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    description: "Startups, ventures, leadership",
    dimension_rules: { leadership: 70, motivation: 70 },
    example_roles: ["Startup Founder", "Business Owner", "Venture Lead"],
    growth_outlook: "Very High",
    skills: ["Strategic planning", "Leadership", "Resource management", "Risk assessment"],
    condition: (s) => (s.leadership ?? 0) > 70 && (s.motivation ?? 0) > 70,
  },
  {
    id: "digital_marketing",
    name: "Digital Marketing",
    description: "Content, analytics, growth",
    dimension_rules: { creativity: 65, personality: 60 },
    example_roles: ["Digital Marketing Strategist", "Content Lead", "Growth Marketer"],
    growth_outlook: "High",
    skills: ["Content strategy", "Analytics", "Communication", "Creative campaigns"],
    condition: (s) => (s.creativity ?? 0) > 65 && (s.personality ?? 0) > 60,
  },
  {
    id: "finance",
    name: "Finance",
    description: "Analysis, risk, financial strategy",
    dimension_rules: { cognitive: 70, motivation: 65 },
    example_roles: ["Financial Analyst", "Risk Analyst", "Investment Associate"],
    growth_outlook: "High",
    skills: ["Financial modelling", "Data analysis", "Risk assessment", "Excel & tools"],
    condition: (s) => (s.cognitive ?? 0) > 70 && (s.motivation ?? 0) > 65,
  },
  {
    id: "counseling",
    name: "Counseling",
    description: "Support, guidance, empathy-driven roles",
    dimension_rules: { emotional: 70, personality: 65 },
    example_roles: ["Career Counsellor", "School Counsellor", "Wellness Coach"],
    growth_outlook: "High",
    skills: ["Empathy", "Active listening", "Crisis support", "Communication"],
    condition: (s) => (s.emotional ?? 0) > 70 && (s.personality ?? 0) > 65,
  },
  {
    id: "media_design",
    name: "Media & Design",
    description: "Visual storytelling, creative media",
    dimension_rules: { creativity: 72, skills: 65 },
    example_roles: ["Graphic Designer", "Visual Designer", "Media Producer"],
    growth_outlook: "High",
    skills: ["Visual design", "Storytelling", "Branding", "Design tools"],
    condition: (s) => (s.creativity ?? 0) > 72 && (s.skills ?? 0) > 65,
  },
  {
    id: "education",
    name: "Education & Training",
    description: "Teaching, edtech, training",
    dimension_rules: { emotional: 65, life_values: 60 },
    example_roles: ["Teacher", "Trainer", "EdTech Specialist"],
    growth_outlook: "Medium",
    skills: ["Instructional design", "Communication", "Patience", "Assessment"],
    condition: (s) => (s.emotional ?? 0) > 65 && (s.life_values ?? 0) > 60,
  },
];

/** Score each cluster by how well the profile matches (sum of weighted dimension scores). */
function clusterScore(scores: CareerIntelligenceScores, def: ClusterDef): number {
  if (!def.condition(scores)) return 0;
  const dims = Object.keys(def.dimension_rules) as (keyof CareerIntelligenceScores)[];
  let sum = 0;
  for (const d of dims) {
    const min = def.dimension_rules[d] ?? 0;
    const value = scores[d] ?? 0;
    if (value >= min) sum += value;
  }
  return sum;
}

/**
 * Map Career Intelligence 10D scores into recommended career clusters.
 * Returns top 3 matching clusters.
 */
export function getCareerClusters(scores: CareerIntelligenceScores): CareerClusterMatch[] {
  const withScores = CLUSTERS.map((def) => ({
    def,
    score: clusterScore(scores, def),
  }));
  const sorted = withScores
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = sorted.slice(0, 3).map(({ def }) => ({
    id: def.id,
    name: def.name,
    description: def.description,
    dimension_rules: def.dimension_rules as Record<string, number>,
    example_roles: def.example_roles,
    growth_outlook: def.growth_outlook,
    skills: def.skills,
  }));

  if (top.length > 0) return top;

  // Defaults when no rule matches: use top dimensions to suggest clusters
  const fallbacks: CareerClusterMatch[] = [
    {
      id: "product_design",
      name: "Product Design",
      description: "UX/UI, design systems, user research",
      dimension_rules: { creativity: 75, technology: 65 },
      example_roles: ["UI/UX Designer", "Product Designer", "Interaction Designer"],
      growth_outlook: "High",
      skills: ["UX research", "UI design", "Prototyping", "User psychology", "Design thinking"],
    },
    {
      id: "digital_marketing",
      name: "Digital Marketing",
      description: "Content, analytics, growth",
      dimension_rules: { creativity: 65, personality: 60 },
      example_roles: ["Digital Marketing Strategist", "Content Lead", "Growth Marketer"],
      growth_outlook: "High",
      skills: ["Content strategy", "Analytics", "Communication", "Creative campaigns"],
    },
    {
      id: "entrepreneurship",
      name: "Entrepreneurship",
      description: "Startups, ventures, leadership",
      dimension_rules: { leadership: 70, motivation: 70 },
      example_roles: ["Startup Founder", "Business Owner", "Venture Lead"],
      growth_outlook: "Very High",
      skills: ["Strategic planning", "Leadership", "Resource management", "Risk assessment"],
    },
  ];
  return fallbacks.slice(0, 3);
}
