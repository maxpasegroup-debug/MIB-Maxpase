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

const ARCHETYPES: ArchetypeDef[] = [
  {
    name: "Strategic Builder",
    description:
      "Strategic Builders combine logical thinking with curiosity. They thrive in environments where systems must be designed, optimized, or reinvented.",
    score: (s) =>
      (s.technology > 75 ? 2 : s.technology > 60 ? 1 : 0) +
      (s.analytical > 70 ? 2 : s.analytical > 55 ? 1 : 0) +
      (s.practical > 65 ? 1 : 0),
  },
  {
    name: "Creative Innovator",
    description:
      "Creative Innovators blend imagination with execution. They excel at turning novel ideas into tangible outcomes and inspiring others.",
    score: (s) =>
      (s.creativity > 75 ? 2 : s.creativity > 60 ? 1 : 0) +
      (s.entrepreneurial > 65 ? 1 : 0) +
      (s.social > 60 ? 1 : 0),
  },
  {
    name: "Analytical Explorer",
    description:
      "Analytical Explorers love patterns, data, and deep inquiry. They thrive in research, analysis, and roles that require precision and curiosity.",
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
    name: "Practical Problem Solver",
    description:
      "Practical Problem Solvers turn complexity into clear, actionable solutions. They excel in implementation and getting things done.",
    score: (s) =>
      (s.practical > 75 ? 2 : s.practical > 60 ? 1 : 0) +
      (s.analytical > 65 ? 1 : 0) +
      (s.technology > 55 ? 1 : 0),
  },
  {
    name: "Social Catalyst",
    description:
      "Social Catalysts create impact through people. They build trust, foster collaboration, and drive change through relationships.",
    score: (s) =>
      (s.social > 75 ? 2 : s.social > 60 ? 1 : 0) +
      (s.leadership > 65 ? 1 : 0) +
      (s.purpose > 55 ? 1 : 0),
  },
  {
    name: "Knowledge Architect",
    description:
      "Knowledge Architects structure information and learning. They thrive in roles that require synthesizing ideas and building frameworks.",
    score: (s) =>
      (s.learning > 75 ? 2 : s.learning > 60 ? 1 : 0) +
      (s.analytical > 65 ? 1 : 0) +
      (s.creativity > 55 ? 1 : 0),
  },
  {
    name: "Adaptive Explorer",
    description:
      "Adaptive Explorers thrive in change and uncertainty. They learn quickly, take calculated risks, and pivot when needed.",
    score: (s) =>
      (s.learning > 70 ? 2 : s.learning > 55 ? 1 : 0) +
      (s.risk > 65 ? 2 : s.risk > 50 ? 1 : 0) +
      (s.creativity > 55 ? 1 : 0),
  },
  {
    name: "System Thinker",
    description:
      "System Thinkers see how parts connect into wholes. They excel at optimization, process design, and technical strategy.",
    score: (s) =>
      (s.analytical > 72 ? 2 : s.analytical > 58 ? 1 : 0) +
      (s.technology > 70 ? 2 : s.technology > 55 ? 1 : 0) +
      (s.practical > 60 ? 1 : 0),
  },
  {
    name: "Impact Creator",
    description:
      "Impact Creators align their work with meaning. They combine purpose with action to create lasting change.",
    score: (s) =>
      (s.purpose > 75 ? 2 : s.purpose > 60 ? 1 : 0) +
      (s.leadership > 65 ? 1 : 0) +
      (s.social > 60 ? 1 : 0),
  },
  {
    name: "Curious Researcher",
    description:
      "Curious Researchers are driven by questions. They excel in discovery, evidence-based work, and deepening understanding.",
    score: (s) =>
      (s.learning > 78 ? 2 : s.learning > 62 ? 1 : 0) +
      (s.analytical > 70 ? 2 : s.analytical > 55 ? 1 : 0) +
      (s.purpose > 55 ? 1 : 0),
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
