/**
 * MIB Career Intelligence™ — Career Roadmap Generator
 * Converts recommended career cluster → 5-step development plan.
 */

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  skills?: string[];
}

/** Normalized cluster key for lookup (id from careerClusters or display name). */
const CLUSTER_IDS = [
  "product_design",
  "engineering",
  "entrepreneurship",
  "digital_marketing",
  "psychology",
  "psychology_counseling",
  "finance",
  "counseling",
  "media_design",
  "education",
] as const;

const ROADMAPS: Record<string, RoadmapStep[]> = {
  product_design: [
    { step: 1, title: "Learn design fundamentals", description: "Understand design thinking and user experience principles", skills: ["Design thinking", "Visual communication"] },
    { step: 2, title: "Develop UX/UI skills", description: "Learn tools like Figma and design prototyping", skills: ["Figma", "Prototyping", "Wireframing"] },
    { step: 3, title: "Build portfolio projects", description: "Create 2–3 real or case-study projects to show end-to-end process", skills: ["Portfolio", "Case studies"] },
    { step: 4, title: "Internship or freelance projects", description: "Gain real-world experience with teams or clients", skills: ["Collaboration", "Client communication"] },
    { step: 5, title: "Professional product designer role", description: "Full-time role in product companies or design studios", skills: ["UX research", "UI design", "Design systems"] },
  ],
  engineering: [
    { step: 1, title: "Learn programming fundamentals", description: "Pick one language (e.g. Python or JavaScript) and core CS concepts", skills: ["Programming", "Logic", "Data structures"] },
    { step: 2, title: "Build small projects", description: "Create 2–3 projects (web app, CLI tool, or script) and put on GitHub", skills: ["Version control", "Debugging"] },
    { step: 3, title: "Specialise or go full-stack", description: "Choose focus (front-end, back-end, data) and deepen skills", skills: ["Frameworks", "APIs", "Databases"] },
    { step: 4, title: "Internships or open source", description: "Contribute to real codebases and work in a team", skills: ["Code review", "Agile", "Testing"] },
    { step: 5, title: "Professional software engineer role", description: "Full-time role in tech companies or product teams", skills: ["Systems design", "Ownership", "Mentorship"] },
  ],
  entrepreneurship: [
    { step: 1, title: "Validate a problem and idea", description: "Talk to potential users and identify a real problem you can solve", skills: ["Customer discovery", "Problem framing"] },
    { step: 2, title: "Build an MVP", description: "Create a minimal version of your product or service and get early feedback", skills: ["MVP", "Prioritisation", "Execution"] },
    { step: 3, title: "Get early customers or traction", description: "Acquire first users, revenue, or partnerships", skills: ["Sales", "Marketing", "Partnerships"] },
    { step: 4, title: "Scale or pivot", description: "Iterate based on data; consider funding, team, or pivot if needed", skills: ["Strategy", "Fundraising", "Hiring"] },
    { step: 5, title: "Run as a sustainable venture", description: "Reach profitability or growth milestones as founder/leader", skills: ["Leadership", "Operations", "Finance"] },
  ],
  digital_marketing: [
    { step: 1, title: "Learn marketing fundamentals", description: "Understand channels, funnels, and basic analytics", skills: ["Marketing basics", "Analytics intro"] },
    { step: 2, title: "Develop content and campaign skills", description: "Create content, run small paid/social campaigns, measure results", skills: ["Content", "SEO", "Paid ads"] },
    { step: 3, title: "Build a personal brand or portfolio", description: "Showcase work (blog, LinkedIn, case studies) and grow a following", skills: ["Personal brand", "Storytelling"] },
    { step: 4, title: "Internship or freelance", description: "Work with brands or agencies on real campaigns", skills: ["Client work", "Reporting", "Optimisation"] },
    { step: 5, title: "Professional marketing role", description: "Full-time role as growth, content, or digital marketing lead", skills: ["Strategy", "Team collaboration", "Budget"] },
  ],
  psychology: [
    { step: 1, title: "Study psychology foundations", description: "Complete relevant coursework or certifications in psychology basics", skills: ["Theories", "Research methods"] },
    { step: 2, title: "Develop assessment and listening skills", description: "Practice structured assessments and active listening", skills: ["Assessment", "Active listening", "Ethics"] },
    { step: 3, title: "Gain supervised experience", description: "Volunteer or intern in counselling, HR, or mental health settings", skills: ["Supervision", "Documentation"] },
    { step: 4, title: "Internship or practicum", description: "Work under licensed professionals in clinical or organisational settings", skills: ["Client work", "Case notes", "Feedback"] },
    { step: 5, title: "Professional psychology or counselling role", description: "Full-time role as counsellor, HR specialist, or behavioural consultant", skills: ["Licensing", "Continued learning"] },
  ],
  psychology_counseling: [
    { step: 1, title: "Study psychology foundations", description: "Complete relevant coursework or certifications in psychology basics", skills: ["Theories", "Research methods"] },
    { step: 2, title: "Develop assessment and listening skills", description: "Practice structured assessments and active listening", skills: ["Assessment", "Active listening", "Ethics"] },
    { step: 3, title: "Gain supervised experience", description: "Volunteer or intern in counselling, HR, or mental health settings", skills: ["Supervision", "Documentation"] },
    { step: 4, title: "Internship or practicum", description: "Work under licensed professionals in clinical or organisational settings", skills: ["Client work", "Case notes", "Feedback"] },
    { step: 5, title: "Professional counselling or HR role", description: "Full-time role as counsellor, HR specialist, or behavioural consultant", skills: ["Licensing", "Continued learning"] },
  ],
  counseling: [
    { step: 1, title: "Learn counselling fundamentals", description: "Understand ethics, boundaries, and core counselling skills", skills: ["Ethics", "Active listening", "Empathy"] },
    { step: 2, title: "Practice in supervised settings", description: "Volunteer or shadow in schools, NGOs, or helplines", skills: ["Supervision", "Documentation"] },
    { step: 3, title: "Get certified or trained", description: "Complete a recognised counselling or coaching certificate", skills: ["Certification", "Frameworks"] },
    { step: 4, title: "Internship or part-time role", description: "Deliver counselling or support under supervision", skills: ["Client work", "Crisis support"] },
    { step: 5, title: "Professional counsellor or coach", description: "Full-time role in education, corporate, or private practice", skills: ["Case load", "Continued professional development"] },
  ],
  finance: [
    { step: 1, title: "Learn finance and accounting basics", description: "Understand financial statements, ratios, and time value of money", skills: ["Accounting", "Excel", "Numbers"] },
    { step: 2, title: "Develop analytical and modelling skills", description: "Build financial models and analyse data (Excel, maybe Python/SQL)", skills: ["Modelling", "Data analysis"] },
    { step: 3, title: "Build a track record", description: "Intern or do projects in banking, equity research, or FP&A", skills: ["Reporting", "Presentation"] },
    { step: 4, title: "Internship or analyst programme", description: "Join a bank, fund, or corporate finance team", skills: ["Deal exposure", "Compliance", "Tools"] },
    { step: 5, title: "Professional finance role", description: "Full-time analyst or associate in finance or consulting", skills: ["Ownership", "Stakeholder management"] },
  ],
  media_design: [
    { step: 1, title: "Learn design fundamentals", description: "Typography, colour, layout, and visual communication", skills: ["Visual design", "Design tools"] },
    { step: 2, title: "Develop graphic and media skills", description: "Create static and motion assets; learn tools (e.g. Adobe, Figma)", skills: ["Graphic design", "Motion", "Branding"] },
    { step: 3, title: "Build a visual portfolio", description: "Showcase projects across print, digital, or video", skills: ["Portfolio", "Presentation"] },
    { step: 4, title: "Internship or freelance", description: "Work with agencies, brands, or media teams", skills: ["Client briefs", "Revisions", "Deadlines"] },
    { step: 5, title: "Professional designer or producer", description: "Full-time role in design studios, agencies, or in-house teams", skills: ["Creative direction", "Collaboration"] },
  ],
  education: [
    { step: 1, title: "Learn pedagogy and subject matter", description: "Understand how people learn and deepen your subject expertise", skills: ["Pedagogy", "Content knowledge"] },
    { step: 2, title: "Develop teaching and facilitation skills", description: "Practice lesson design, delivery, and assessment", skills: ["Lesson design", "Facilitation", "Assessment"] },
    { step: 3, title: "Gain teaching experience", description: "Tutor, volunteer, or assist in classrooms or training programmes", skills: ["Classroom management", "Feedback"] },
    { step: 4, title: "Internship or teaching practice", description: "Structured teaching practice or internship in schools or L&D", skills: ["Curriculum", "Diversity of learners"] },
    { step: 5, title: "Professional educator or trainer", description: "Full-time role as teacher, trainer, or edtech specialist", skills: ["Continued learning", "Leadership in education"] },
  ],
};

/** Normalize cluster name to id (e.g. "Product Design" → "product_design"). */
function toClusterId(name: string): string {
  const lower = name.toLowerCase().trim();
  const normalized = lower.replace(/\s*&\s*/g, "_").replace(/\s+/g, "_");
  if (CLUSTER_IDS.includes(normalized as (typeof CLUSTER_IDS)[number])) return normalized;
  const byName: Record<string, string> = {
    "product design": "product_design",
    "engineering": "engineering",
    "entrepreneurship": "entrepreneurship",
    "digital marketing": "digital_marketing",
    "psychology": "psychology_counseling",
    "psychology & counseling": "psychology_counseling",
    "counseling": "counseling",
    "finance": "finance",
    "media & design": "media_design",
    "media and design": "media_design",
    "education": "education",
    "education & training": "education",
  };
  return byName[normalized] ?? byName[lower] ?? "product_design";
}

/**
 * Generate a 5-step career roadmap for a given cluster name or id.
 * Use cluster name from getCareerClusters (e.g. "Product Design") or id (e.g. "product_design").
 */
export function generateCareerRoadmap(clusterNameOrId: string): RoadmapStep[] {
  const id = toClusterId(clusterNameOrId);
  return ROADMAPS[id] ?? ROADMAPS.product_design;
}
