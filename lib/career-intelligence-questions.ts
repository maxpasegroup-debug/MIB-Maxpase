/**
 * MIB Career Intelligence™ — Question Bank
 * 10 dimensions × 10 questions = 100 questions.
 * Each question: dimension, trait_tag, weight, reverse_scored, age_group (optional).
 * Answer scale: Strongly Disagree (1) … Strongly Agree (5).
 *
 * Positioning: Career Intelligence Assessment (premium, scientific).
 */

import type { DimensionKey } from "./career-intelligence";

export interface CareerQuestion {
  dimension: DimensionKey;
  question: string;
  trait_tag: string;
  weight: number;
  reverse_scored: boolean;
  age_group?: string;
}

/** Total questions in the Career Intelligence Assessment */
export const CAREER_INTELLIGENCE_TOTAL_QUESTIONS = 100;

/** 5-point Likert options for the assessment UI */
export const CAREER_ANSWER_OPTIONS = [
  { label: "Strongly Disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Neutral", value: 3 },
  { label: "Agree", value: 4 },
  { label: "Strongly Agree", value: 5 },
] as const;

/** Display name for the assessment (premium positioning) */
export const CAREER_ASSESSMENT_LABEL = "Career Intelligence Assessment";

// ---------------------------------------------------------------------------
// Question Bank: 100 questions (10 per dimension)
// ---------------------------------------------------------------------------

export const CAREER_QUESTION_BANK: CareerQuestion[] = [
  // ─── 1. Cognitive Ability (10) ─────────────────────────────────────────
  {
    dimension: "cognitive",
    question: "I enjoy solving complex problems that require logical thinking.",
    trait_tag: "logical_thinking",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "I quickly understand patterns in numbers or data.",
    trait_tag: "pattern_understanding",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "When faced with a challenge, I prefer to analyze it step by step.",
    trait_tag: "step_by_step_analysis",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "I enjoy puzzles, strategy games, or logical challenges.",
    trait_tag: "puzzles_strategy",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "I can easily break big problems into smaller parts.",
    trait_tag: "break_down_problems",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "I prefer tasks that involve thinking rather than repeating routine work.",
    trait_tag: "thinking_over_routine",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "I like to understand how systems or processes work.",
    trait_tag: "systems_understanding",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "I enjoy learning concepts that require deep understanding.",
    trait_tag: "deep_learning",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "I feel confident solving analytical problems.",
    trait_tag: "analytical_confidence",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "cognitive",
    question: "I like situations where I need to make strategic decisions.",
    trait_tag: "strategic_decisions",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 2. Personality Style (10) ────────────────────────────────────────
  {
    dimension: "personality",
    question: "I enjoy interacting with new people.",
    trait_tag: "interacting_new_people",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I feel comfortable expressing my ideas in groups.",
    trait_tag: "expressing_ideas_groups",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I prefer planning tasks before starting them.",
    trait_tag: "planning_before_start",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I adapt easily to new environments.",
    trait_tag: "adapt_new_environments",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I like collaborating with others on projects.",
    trait_tag: "collaborating",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I stay organized in my work.",
    trait_tag: "organized",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I remain calm during stressful situations.",
    trait_tag: "calm_under_stress",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I am open to trying new experiences.",
    trait_tag: "open_new_experiences",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I prefer clear structures and guidelines.",
    trait_tag: "clear_structures",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "personality",
    question: "I feel energized when working with teams.",
    trait_tag: "energized_teams",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 3. Motivation Drivers (10) ─────────────────────────────────────────
  {
    dimension: "motivation",
    question: "Achieving challenging goals motivates me.",
    trait_tag: "challenging_goals",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "Financial success is an important goal for me.",
    trait_tag: "financial_success",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "I enjoy work that creates a positive impact on society.",
    trait_tag: "social_impact",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "Recognition for my work motivates me.",
    trait_tag: "recognition",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "I prefer work that allows independence.",
    trait_tag: "independence",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "I enjoy competing to achieve better results.",
    trait_tag: "competition",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "I like setting ambitious personal goals.",
    trait_tag: "ambitious_goals",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "I feel motivated when learning new skills.",
    trait_tag: "learning_motivation",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "I enjoy seeing the results of my work.",
    trait_tag: "results_oriented",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "motivation",
    question: "I prefer work that challenges me intellectually.",
    trait_tag: "intellectual_challenge",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 4. Emotional Intelligence (10) ───────────────────────────────────
  {
    dimension: "emotional",
    question: "I am aware of my emotions when making decisions.",
    trait_tag: "emotional_awareness",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I understand how others feel during conversations.",
    trait_tag: "empathy",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I stay calm when facing criticism.",
    trait_tag: "calm_under_criticism",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I try to resolve conflicts peacefully.",
    trait_tag: "conflict_resolution",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I can motivate others during difficult situations.",
    trait_tag: "motivating_others",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I reflect on my mistakes and learn from them.",
    trait_tag: "reflection_learning",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I manage stress effectively.",
    trait_tag: "stress_management",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I can recognize emotional cues in people.",
    trait_tag: "emotional_cues",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I stay positive even during setbacks.",
    trait_tag: "resilience",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "emotional",
    question: "I can support others emotionally.",
    trait_tag: "emotional_support",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 5. Skills & Aptitude (10) ─────────────────────────────────────────
  {
    dimension: "skills",
    question: "I learn new skills quickly.",
    trait_tag: "quick_learner",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I am comfortable presenting ideas to others.",
    trait_tag: "presenting",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I enjoy writing or expressing ideas clearly.",
    trait_tag: "written_expression",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I can visualize designs or structures easily.",
    trait_tag: "visualization",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I enjoy solving numerical problems.",
    trait_tag: "numerical_problems",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I can explain complex ideas in simple ways.",
    trait_tag: "simplifying_complex",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I learn technical tools quickly.",
    trait_tag: "technical_learning",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I enjoy creating things from scratch.",
    trait_tag: "creating_from_scratch",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I feel confident learning new professional skills.",
    trait_tag: "professional_skills_confidence",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "skills",
    question: "I enjoy mastering difficult subjects.",
    trait_tag: "mastery_oriented",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 6. Technology Adaptability (10) ───────────────────────────────────
  {
    dimension: "technology",
    question: "I enjoy exploring new technologies.",
    trait_tag: "exploring_tech",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "I quickly learn to use new digital tools.",
    trait_tag: "digital_tools_learning",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "I am comfortable using AI tools to improve work.",
    trait_tag: "ai_comfort",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "Technology makes me more productive.",
    trait_tag: "tech_productivity",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "I like experimenting with new software or apps.",
    trait_tag: "experimenting_software",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "I stay updated with technological trends.",
    trait_tag: "tech_trends",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "I enjoy automating repetitive tasks using technology.",
    trait_tag: "automation",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "I feel comfortable learning coding or technical systems.",
    trait_tag: "coding_comfort",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "I like using technology to solve problems.",
    trait_tag: "tech_problem_solving",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "technology",
    question: "I believe technology will play a major role in my career.",
    trait_tag: "tech_career_role",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 7. Leadership Potential (10) ───────────────────────────────────────
  {
    dimension: "leadership",
    question: "I naturally take responsibility in group situations.",
    trait_tag: "taking_responsibility",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "I can guide people toward achieving goals.",
    trait_tag: "guiding_goals",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "Others often seek my advice.",
    trait_tag: "sought_advice",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "I feel confident making decisions.",
    trait_tag: "decision_confidence",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "I motivate people to work together.",
    trait_tag: "motivating_teams",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "I take initiative when problems arise.",
    trait_tag: "initiative",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "I feel comfortable leading projects.",
    trait_tag: "leading_projects",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "I inspire others with my ideas.",
    trait_tag: "inspiring_others",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "I can manage conflicts within teams.",
    trait_tag: "team_conflict_management",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "leadership",
    question: "I enjoy influencing positive change.",
    trait_tag: "influencing_change",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 8. Creativity & Innovation (10) ───────────────────────────────────
  {
    dimension: "creativity",
    question: "I enjoy coming up with creative solutions.",
    trait_tag: "creative_solutions",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I like experimenting with new ideas.",
    trait_tag: "experimenting_ideas",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I often think of different ways to solve a problem.",
    trait_tag: "multiple_approaches",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I enjoy designing or creating new things.",
    trait_tag: "designing_creating",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I like brainstorming ideas with others.",
    trait_tag: "brainstorming",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I question traditional ways of doing things.",
    trait_tag: "questioning_tradition",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I enjoy artistic or creative activities.",
    trait_tag: "artistic_activities",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I think innovation is important in every career.",
    trait_tag: "innovation_value",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I enjoy improving existing systems.",
    trait_tag: "improving_systems",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "creativity",
    question: "I feel comfortable expressing original ideas.",
    trait_tag: "original_ideas",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 9. Work Environment Preference (10) ───────────────────────────────
  {
    dimension: "work_environment",
    question: "I prefer working independently.",
    trait_tag: "independent_work",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I enjoy fast-paced environments.",
    trait_tag: "fast_paced",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I prefer structured work environments.",
    trait_tag: "structured_environment",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I enjoy flexible work conditions.",
    trait_tag: "flexible_conditions",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I prefer working on multiple projects.",
    trait_tag: "multiple_projects",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I like environments where creativity is encouraged.",
    trait_tag: "creativity_encouraged",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I prefer clear roles and responsibilities.",
    trait_tag: "clear_roles",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I enjoy environments that reward innovation.",
    trait_tag: "innovation_rewarded",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I prefer workplaces that encourage teamwork.",
    trait_tag: "teamwork_encouraged",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "work_environment",
    question: "I enjoy dynamic work cultures.",
    trait_tag: "dynamic_culture",
    weight: 1,
    reverse_scored: false,
  },

  // ─── 10. Life Values (10) ─────────────────────────────────────────────
  {
    dimension: "life_values",
    question: "Work-life balance is important to me.",
    trait_tag: "work_life_balance",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "I value financial security.",
    trait_tag: "financial_security",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "I want my work to create a positive impact.",
    trait_tag: "positive_impact",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "Personal freedom is important to me.",
    trait_tag: "personal_freedom",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "I value recognition and status.",
    trait_tag: "recognition_status",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "I want a career that aligns with my passions.",
    trait_tag: "passion_alignment",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "I value stability in life.",
    trait_tag: "stability",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "Helping others gives meaning to my work.",
    trait_tag: "helping_others",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "I value opportunities to grow and learn.",
    trait_tag: "growth_learning",
    weight: 1,
    reverse_scored: false,
  },
  {
    dimension: "life_values",
    question: "I want a career that allows creativity.",
    trait_tag: "career_creativity",
    weight: 1,
    reverse_scored: false,
  },
];

/** Get questions for a single dimension (e.g. for validation or subset) */
export function getQuestionsByDimension(dimension: DimensionKey): CareerQuestion[] {
  return CAREER_QUESTION_BANK.filter((q) => q.dimension === dimension);
}

/** Get question by index (0–99) for assessment flow */
export function getCareerQuestionByIndex(index: number): CareerQuestion | undefined {
  return CAREER_QUESTION_BANK[index];
}
