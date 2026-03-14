/**
 * MIB Career Intelligence 10D — career roadmap steps by cluster.
 */

import type { CareerClusterName } from "./careerClusterMapping";

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  skills?: string[];
}

function step(s: number, t: string, description = ""): RoadmapStep {
  return { step: s, title: t, description };
}

const ROADMAPS: Record<CareerClusterName, RoadmapStep[]> = {
  "Technology & Engineering": [
    step(1, "Learn programming foundations"),
    step(2, "Build real projects"),
    step(3, "Explore AI & automation"),
    step(4, "Build portfolio"),
    step(5, "Work in tech companies"),
  ],
  "Creative & Communication": [
    step(1, "Develop core creative skills"),
    step(2, "Build a portfolio of work"),
    step(3, "Network in creative industries"),
    step(4, "Take on freelance or internships"),
    step(5, "Pursue roles in design, media, or content"),
  ],
  "Business & Entrepreneurship": [
    step(1, "Understand business fundamentals"),
    step(2, "Gain experience in teams and projects"),
    step(3, "Identify problems you can solve"),
    step(4, "Build a minimal product or service"),
    step(5, "Scale or join a startup"),
  ],
  "Research & Academia": [
    step(1, "Strengthen analytical and writing skills"),
    step(2, "Engage in research projects or papers"),
    step(3, "Pursue higher education in your field"),
    step(4, "Present at conferences or publish"),
    step(5, "Build a career in research or teaching"),
  ],
  "Social Impact Careers": [
    step(1, "Volunteer or intern in NGOs/social sector"),
    step(2, "Understand policy and community needs"),
    step(3, "Develop project and leadership skills"),
    step(4, "Lead or co-lead initiatives"),
    step(5, "Work in impact-driven organisations"),
  ],
  "General Career Profile": [
    step(1, "Explore interests and strengths"),
    step(2, "Try short courses or projects"),
    step(3, "Get feedback from mentors"),
    step(4, "Narrow down 2–3 career directions"),
    step(5, "Take the next step in your chosen path"),
  ],
};

/** Return roadmap steps for the given cluster. Accepts cluster name or any string (fallback: General). */
export function generateCareerRoadmap(cluster: CareerClusterName | string): RoadmapStep[] {
  const key = cluster as CareerClusterName;
  return (ROADMAPS[key] ?? ROADMAPS["General Career Profile"]) as RoadmapStep[];
}
