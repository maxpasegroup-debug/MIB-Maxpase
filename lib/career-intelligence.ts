/**
 * MIB Career Intelligence™ — 10D Model
 * Structured scoring system: dimensions, bands, career mapping, skill roadmaps.
 * 10 dimensions × 10 questions = 100 questions; 5-point Likert scale (1–5).
 * Question bank: @see lib/career-intelligence-questions.ts
 */

// ---------------------------------------------------------------------------
// 1. The 10 Dimensions (10D Model)
// ---------------------------------------------------------------------------

export const CAREER_DIMENSIONS = [
  { key: "cognitive", label: "Cognitive Ability", measures: "Logical thinking, analysis" },
  { key: "personality", label: "Personality Style", measures: "Behavior and interaction style" },
  { key: "motivation", label: "Motivation Drivers", measures: "What energizes the person" },
  { key: "emotional", label: "Emotional Intelligence", measures: "Self-awareness and empathy" },
  { key: "skills", label: "Skills & Aptitude", measures: "Natural skill tendencies" },
  { key: "technology", label: "Technology Adaptability", measures: "Comfort with digital tools & AI" },
  { key: "leadership", label: "Leadership Potential", measures: "Influence and decision ability" },
  { key: "creativity", label: "Creativity", measures: "Innovation and imagination" },
  { key: "work_environment", label: "Work Environment Preference", measures: "Preferred work settings" },
  { key: "life_values", label: "Life Values", measures: "Long-term priorities" },
] as const;

export type DimensionKey = (typeof CAREER_DIMENSIONS)[number]["key"];

export const DIMENSION_KEYS: DimensionKey[] = CAREER_DIMENSIONS.map((d) => d.key);

export type CareerIntelligenceScores = Record<DimensionKey, number>;

// ---------------------------------------------------------------------------
// 2. Answer scale (5-point Likert)
// ---------------------------------------------------------------------------

export const CAREER_ANSWER_SCALE = [
  { text: "Strongly Disagree", value: 1 },
  { text: "Disagree", value: 2 },
  { text: "Neutral", value: 3 },
  { text: "Agree", value: 4 },
  { text: "Strongly Agree", value: 5 },
] as const;

export const MAX_SCORE_PER_QUESTION = 5;
export const QUESTIONS_PER_DIMENSION = 10;
export const MAX_RAW_PER_DIMENSION = QUESTIONS_PER_DIMENSION * MAX_SCORE_PER_QUESTION; // 50

// ---------------------------------------------------------------------------
// 3. Raw score → 0–100
// ---------------------------------------------------------------------------

/**
 * dimension_score = (sum of question scores / max possible score) × 100
 * Max per dimension = 10 questions × 5 = 50.
 */
export function getDimensionScore(rawSum: number, questionCount: number = QUESTIONS_PER_DIMENSION): number {
  const maxPossible = questionCount * MAX_SCORE_PER_QUESTION;
  if (maxPossible <= 0) return 0;
  return Math.round((rawSum / maxPossible) * 100);
}

// ---------------------------------------------------------------------------
// 4. Score interpretation bands
// ---------------------------------------------------------------------------

export type ScoreBand = "Low" | "Emerging" | "Moderate" | "Strong" | "Exceptional";

const SCORE_BANDS: { min: number; max: number; label: ScoreBand }[] = [
  { min: 0, max: 30, label: "Low" },
  { min: 31, max: 50, label: "Emerging" },
  { min: 51, max: 70, label: "Moderate" },
  { min: 71, max: 85, label: "Strong" },
  { min: 86, max: 100, label: "Exceptional" },
];

export function getScoreInterpretation(score: number): ScoreBand {
  const band = SCORE_BANDS.find((b) => score >= b.min && score <= b.max);
  return band?.label ?? "Moderate";
}

/** e.g. "Creativity: 76 — Strong" */
export function formatDimensionResult(dimensionLabel: string, score: number): string {
  return `${dimensionLabel}: ${score} — ${getScoreInterpretation(score)}`;
}

// ---------------------------------------------------------------------------
// 5. Strength zones (top N dimensions)
// ---------------------------------------------------------------------------

export function getTopStrengths(scores: CareerIntelligenceScores, n: number = 3): { key: DimensionKey; label: string; score: number }[] {
  const withLabels = DIMENSION_KEYS.map((key) => {
    const dim = CAREER_DIMENSIONS.find((d) => d.key === key)!;
    return { key, label: dim.label, score: scores[key] ?? 0 };
  });
  return withLabels
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

// ---------------------------------------------------------------------------
// 6 & 7. Career cluster mapping matrix
// ---------------------------------------------------------------------------

export interface CareerCluster {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  growth: string;
  skills: string[];
}

const CAREER_CLUSTER_RULES: Array<{
  condition: (s: CareerIntelligenceScores) => boolean;
  cluster: CareerCluster;
}> = [
  {
    condition: (s) => (s.creativity ?? 0) > 75 && (s.technology ?? 0) > 65,
    cluster: {
      id: "product_design",
      title: "Product Designer",
      shortTitle: "Product Design",
      description: "UX/UI, design systems, user research",
      growth: "High",
      skills: ["UX research", "UI design", "Prototyping", "User psychology", "Design thinking"],
    },
  },
  {
    condition: (s) => (s.cognitive ?? 0) > 70 && (s.skills ?? 0) > 65,
    cluster: {
      id: "engineering",
      title: "Software / Systems Engineer",
      shortTitle: "Engineering",
      description: "Software, systems, innovation",
      growth: "High",
      skills: ["Programming", "Systems thinking", "Problem solving", "Technical design"],
    },
  },
  {
    condition: (s) => (s.personality ?? 0) > 70 && (s.emotional ?? 0) > 65,
    cluster: {
      id: "psychology",
      title: "Psychology & Counselling",
      shortTitle: "Psychology",
      description: "Counselling, HR, behavioural science",
      growth: "High",
      skills: ["Active listening", "Empathy", "Assessment", "Communication", "Ethics"],
    },
  },
  {
    condition: (s) => (s.leadership ?? 0) > 75 && (s.motivation ?? 0) > 70,
    cluster: {
      id: "entrepreneurship",
      title: "Startup Founder / Entrepreneurship",
      shortTitle: "Entrepreneurship",
      description: "Startups, ventures, leadership",
      growth: "Very High",
      skills: ["Strategic planning", "Leadership", "Resource management", "Risk assessment"],
    },
  },
  {
    condition: (s) => (s.creativity ?? 0) > 70 && (s.personality ?? 0) > 65,
    cluster: {
      id: "marketing",
      title: "Digital Marketing Strategist",
      shortTitle: "Digital Marketing",
      description: "Content, analytics, growth",
      growth: "High",
      skills: ["Content strategy", "Analytics", "Communication", "Creative campaigns"],
    },
  },
  {
    condition: (s) => (s.emotional ?? 0) > 65 && (s.life_values ?? 0) > 60,
    cluster: {
      id: "education",
      title: "Education & Training",
      shortTitle: "Education",
      description: "Teaching, edtech, training",
      growth: "Medium",
      skills: ["Instructional design", "Communication", "Patience", "Assessment"],
    },
  },
];

// ---------------------------------------------------------------------------
// 8. Career recommendation engine (top 3 clusters)
// ---------------------------------------------------------------------------

export function getCareerClusters(scores: CareerIntelligenceScores): CareerCluster[] {
  const matched = CAREER_CLUSTER_RULES.filter((r) => r.condition(scores)).map((r) => r.cluster);
  const seen = new Set<string>();
  const unique: CareerCluster[] = [];
  for (const c of matched) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      unique.push(c);
    }
  }
  return unique.slice(0, 3);
}

/** If no rules match, return default recommendations with skills. */
export function getCareerClustersWithDefaults(scores: CareerIntelligenceScores): CareerCluster[] {
  const clusters = getCareerClusters(scores);
  if (clusters.length > 0) return clusters;
  return [
    { id: "product_design", title: "Product Designer", shortTitle: "Product Design", description: "UX/UI, design systems", growth: "High", skills: ["UX research", "UI design", "Prototyping"] },
    { id: "marketing", title: "Digital Marketing Strategist", shortTitle: "Digital Marketing", description: "Content, analytics", growth: "High", skills: ["Content strategy", "Analytics", "Communication"] },
    { id: "entrepreneurship", title: "Startup Founder", shortTitle: "Entrepreneurship", description: "Ventures, leadership", growth: "Very High", skills: ["Strategic planning", "Leadership"] },
  ];
}

// ---------------------------------------------------------------------------
// 9. Skill roadmap (skills to develop from top clusters)
// ---------------------------------------------------------------------------

export function getSkillsToDevelop(scores: CareerIntelligenceScores, maxSkills: number = 6): string[] {
  const clusters = getCareerClustersWithDefaults(scores);
  const skills: string[] = [];
  const seen = new Set<string>();
  for (const c of clusters) {
    for (const s of c.skills) {
      if (!seen.has(s) && skills.length < maxSkills) {
        seen.add(s);
        skills.push(s);
      }
    }
  }
  return skills;
}

// ---------------------------------------------------------------------------
// 10. Confidence score (profile consistency)
// ---------------------------------------------------------------------------

export type ConfidenceLevel = "High" | "Moderate" | "Low";

/**
 * Placeholder: can be replaced with actual consistency index from response variance.
 * For now, derive from score spread (narrow spread = more consistent).
 */
export function getConfidenceLevel(scores: CareerIntelligenceScores): ConfidenceLevel {
  const values = DIMENSION_KEYS.map((k) => scores[k] ?? 0).filter((v) => v > 0);
  if (values.length < 3) return "Moderate";
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev < 12) return "High";
  if (stdDev < 20) return "Moderate";
  return "Low";
}

// ---------------------------------------------------------------------------
// 11. Default / sample scores (for demo report)
// ---------------------------------------------------------------------------

export const SAMPLE_CAREER_SCORES: CareerIntelligenceScores = {
  cognitive: 82,
  personality: 65,
  motivation: 74,
  emotional: 71,
  skills: 78,
  technology: 69,
  leadership: 80,
  creativity: 88,
  work_environment: 60,
  life_values: 73,
};
