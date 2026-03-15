/**
 * Career Identity Engine — maps 10D scores to a career archetype identity.
 * Used for the "Career Identity Moment" before the paywall.
 * Does not modify scoring logic; only derives identity from existing scores.
 */

import type { Career10DScores } from "./careerDimensions";

export type CareerIdentity = {
  archetype: string;
  description: string;
};

type ArchetypeDef = {
  name: string;
  description: string;
  score: (s: Career10DScores) => number;
};

/** Minimum required archetypes (saved to Career10DReport.identityName / identityDescription). */
const ARCHETYPES: ArchetypeDef[] = [
  {
    name: "Strategic Architect",
    description:
      "Strategic Architects combine logical thinking with systems design. They thrive in environments where complex systems must be designed, optimized, or reinvented.",
    score: (s) =>
      (s.technology > 75 ? 2 : s.technology > 60 ? 1 : 0) +
      (s.analytical > 70 ? 2 : s.analytical > 55 ? 1 : 0) +
      (s.practical > 65 ? 1 : 0),
  },
  {
    name: "Creative Explorer",
    description:
      "Creative Explorers blend imagination with curiosity. They excel at exploring new ideas and turning them into tangible outcomes.",
    score: (s) =>
      (s.creativity > 75 ? 2 : s.creativity > 60 ? 1 : 0) +
      (s.entrepreneurial > 65 ? 1 : 0) +
      (s.social > 60 ? 1 : 0),
  },
  {
    name: "Analytical Builder",
    description:
      "Analytical Builders love patterns, data, and structure. They thrive in research, analysis, and roles that require precision and building frameworks.",
    score: (s) =>
      (s.analytical > 75 ? 2 : s.analytical > 60 ? 1 : 0) +
      (s.learning > 70 ? 2 : s.learning > 55 ? 1 : 0) +
      (s.technology > 60 ? 1 : 0),
  },
  {
    name: "Visionary Leader",
    description:
      "Visionary Leaders see the big picture and rally people around it. They combine purpose with the ability to influence and guide teams.",
    score: (s) =>
      (s.leadership > 75 ? 2 : s.leadership > 60 ? 1 : 0) +
      (s.purpose > 70 ? 2 : s.purpose > 55 ? 1 : 0) +
      (s.social > 60 ? 1 : 0),
  },
  {
    name: "Social Influencer",
    description:
      "Social Influencers create impact through people. They build trust, foster collaboration, and drive change through relationships.",
    score: (s) =>
      (s.social > 75 ? 2 : s.social > 60 ? 1 : 0) +
      (s.leadership > 65 ? 1 : 0) +
      (s.purpose > 55 ? 1 : 0),
  },
  {
    name: "Tech Innovator",
    description:
      "Tech Innovators combine technology with innovation. They excel at leveraging tools and systems to create new solutions and drive change.",
    score: (s) =>
      (s.technology > 72 ? 2 : s.technology > 58 ? 1 : 0) +
      (s.analytical > 70 ? 2 : s.analytical > 55 ? 1 : 0) +
      (s.creativity > 55 ? 1 : 0),
  },
  {
    name: "Practical Operator",
    description:
      "Practical Operators turn complexity into clear, actionable solutions. They excel in implementation and getting things done.",
    score: (s) =>
      (s.practical > 75 ? 2 : s.practical > 60 ? 1 : 0) +
      (s.analytical > 65 ? 1 : 0) +
      (s.technology > 55 ? 1 : 0),
  },
  {
    name: "Entrepreneurial Pioneer",
    description:
      "Entrepreneurial Pioneers take initiative and own outcomes. They combine risk-taking with leadership and execution.",
    score: (s) =>
      (s.entrepreneurial > 75 ? 2 : s.entrepreneurial > 60 ? 1 : 0) +
      (s.risk > 68 ? 2 : s.risk > 52 ? 1 : 0) +
      (s.leadership > 62 ? 1 : 0),
  },
  {
    name: "Learning Specialist",
    description:
      "Learning Specialists structure information and growth. They thrive in roles that require synthesizing ideas, learning systems, and building capability.",
    score: (s) =>
      (s.learning > 75 ? 2 : s.learning > 60 ? 1 : 0) +
      (s.analytical > 65 ? 1 : 0) +
      (s.creativity > 55 ? 1 : 0),
  },
  {
    name: "Purpose Driven Leader",
    description:
      "Purpose Driven Leaders align their work with meaning. They combine purpose with action to create lasting change and inspire others.",
    score: (s) =>
      (s.purpose > 75 ? 2 : s.purpose > 60 ? 1 : 0) +
      (s.leadership > 65 ? 1 : 0) +
      (s.social > 60 ? 1 : 0),
  },
];

/**
 * Returns the best-matching career archetype and its description.
 */
export function generateCareerIdentity(scores: Career10DScores): CareerIdentity {
  let best = ARCHETYPES[0];
  let bestScore = best.score(scores);

  for (let i = 1; i < ARCHETYPES.length; i++) {
    const candidate = ARCHETYPES[i];
    const s = candidate.score(scores);
    if (s > bestScore) {
      bestScore = s;
      best = candidate;
    }
  }

  return {
    archetype: best.name,
    description: best.description,
  };
}
