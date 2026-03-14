/**
 * Add new questions to question_bank_master.csv until total >= 1050.
 * Run: npx tsx scripts/addQuestionsToMaster.ts
 */

import * as fs from "fs";
import * as path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "question_bank_master.csv");
const TARGET_TOTAL = 1050;
const HEADER = "category,trait,sub_area,question_text,reverse_scored,weight,test_type,age_group";

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "," || c === "\r") {
      result.push(current.trim());
      current = c === "\r" ? "" : "";
    } else if (c !== "\r") current += c;
  }
  result.push(current.trim());
  while (result.length > 0 && result[result.length - 1] === "") result.pop();
  return result;
}

function getQuestionText(rawCols: string[]): string {
  if (rawCols.length >= 8) {
    return rawCols.length === 8
      ? rawCols[3]
      : rawCols.slice(3, rawCols.length - 4).join(",");
  }
  return rawCols[3] ?? "";
}

// New question templates: [category, trait, sub_area, question_text, reverse_scored, test_type, age_group]
// Distributed across 9 categories; all weight=1. No commas in question_text to keep CSV simple.
const NEW_QUESTIONS: [string, string, string, string, string, string, string][] = [
  ["psychology_self_awareness", "reflection", "thought_pattern", "I think about how my past choices shape my present", "false", "deep", "18-60"],
  ["psychology_self_awareness", "reflection", "thought_pattern", "I seldom consider how my mood affects my decisions", "true", "deep", "18-60"],
  ["psychology_self_awareness", "self_growth", "personal_development", "I seek feedback to improve my self-awareness", "false", "deep", "18-60"],
  ["psychology_self_awareness", "self_growth", "personal_development", "I resist reflecting on my weaknesses", "true", "deep", "18-60"],
  ["psychology_self_awareness", "self_insight", "emotional_understanding", "I notice when my emotions influence my judgment", "false", "deep", "18-60"],
  ["psychology_self_awareness", "self_insight", "emotional_understanding", "I pay little attention to my emotional patterns", "true", "deep", "18-60"],
  ["psychology_self_awareness", "thought_awareness", "mental_patterns", "I consider how my beliefs might limit my options", "false", "deep", "18-60"],
  ["psychology_self_awareness", "thought_awareness", "mental_patterns", "I rarely examine the assumptions behind my views", "true", "deep", "18-60"],
  ["personality_confidence", "self_belief", "decision_behavior", "I feel able to handle unexpected demands", "false", "rapid", "18-60"],
  ["personality_confidence", "self_belief", "decision_behavior", "I second-guess myself when others disagree", "true", "rapid", "18-60"],
  ["personality_confidence", "personal_drive", "goal_pursuit", "I set clear goals and work toward them", "false", "rapid", "18-60"],
  ["personality_confidence", "personal_drive", "goal_pursuit", "I abandon goals when progress is slow", "true", "rapid", "18-60"],
  ["personality_confidence", "assertiveness", "communication", "I state my needs clearly in professional settings", "false", "rapid", "18-60"],
  ["personality_confidence", "assertiveness", "communication", "I keep quiet to avoid disagreement", "true", "rapid", "18-60"],
  ["personality_confidence", "self_efficacy", "ability_perception", "I believe I can master new skills with practice", "false", "rapid", "18-60"],
  ["personality_confidence", "self_efficacy", "ability_perception", "I feel inadequate when comparing myself to others", "true", "rapid", "18-60"],
  ["personality_confidence", "risk_tolerance", "confidence_behavior", "I am willing to try new approaches despite uncertainty", "false", "rapid", "18-60"],
  ["personality_confidence", "risk_tolerance", "confidence_behavior", "I stick to familiar options to avoid failure", "true", "rapid", "18-60"],
  ["stress_resilience", "stress_response", "emotional_regulation", "I stay level-headed when deadlines approach", "false", "deep", "18-60"],
  ["stress_resilience", "stress_response", "emotional_regulation", "I become irritable under pressure", "true", "deep", "18-60"],
  ["stress_resilience", "stress_management", "mental_control", "I use breathing or similar techniques when stressed", "false", "deep", "18-60"],
  ["stress_resilience", "stress_management", "mental_control", "I neglect self-care when busy", "true", "deep", "18-60"],
  ["stress_resilience", "adaptability", "challenge_adaptation", "I adjust my plans when obstacles appear", "false", "deep", "18-60"],
  ["stress_resilience", "adaptability", "challenge_adaptation", "I get frustrated when things do not go as planned", "true", "deep", "18-60"],
  ["stress_resilience", "problem_focus", "solution_orientation", "I look for practical steps when facing a problem", "false", "deep", "18-60"],
  ["stress_resilience", "problem_focus", "solution_orientation", "I focus on the problem instead of solutions", "true", "deep", "18-60"],
  ["stress_resilience", "mental_recovery", "resilience_behavior", "I regain my composure quickly after a setback", "false", "deep", "18-60"],
  ["stress_resilience", "mental_recovery", "resilience_behavior", "I dwell on setbacks for a long time", "true", "deep", "18-60"],
  ["career_intelligence", "motivation", "career_values", "I want work that feels meaningful to me", "false", "deep", "15-60"],
  ["career_intelligence", "motivation", "career_values", "I rarely consider whether my job fits my values", "true", "deep", "15-60"],
  ["career_intelligence", "career_alignment", "career_fit", "I think about how well a role matches my strengths", "false", "deep", "15-60"],
  ["career_intelligence", "career_alignment", "career_fit", "I take jobs without considering long-term fit", "true", "deep", "15-60"],
  ["career_intelligence", "career_curiosity", "career_exploration", "I read about different professions and paths", "false", "deep", "15-60"],
  ["career_intelligence", "career_curiosity", "career_exploration", "I show little interest in career research", "true", "deep", "15-60"],
  ["career_intelligence", "career_planning", "future_planning", "I think about skills I will need in five years", "false", "deep", "15-60"],
  ["career_intelligence", "career_planning", "future_planning", "I avoid planning my career path", "true", "deep", "15-60"],
  ["career_intelligence", "career_growth", "professional_development", "I look for ways to learn at work", "false", "deep", "15-60"],
  ["career_intelligence", "career_growth", "professional_development", "I am not interested in upgrading my skills", "true", "deep", "15-60"],
  ["technology_mindset", "adaptability", "digital_behavior", "I like trying new apps and digital tools", "false", "rapid", "15-60"],
  ["technology_mindset", "adaptability", "digital_behavior", "I prefer to keep using tools I already know", "true", "rapid", "15-60"],
  ["technology_mindset", "digital_learning", "technology_growth", "I take initiative to learn new software", "false", "rapid", "15-60"],
  ["technology_mindset", "digital_learning", "technology_growth", "I wait until I have to learn new technology", "true", "rapid", "15-60"],
  ["technology_mindset", "digital_curiosity", "tech_learning", "I am curious about how new technologies work", "false", "rapid", "15-60"],
  ["technology_mindset", "digital_curiosity", "tech_learning", "I find new technology uninteresting", "true", "rapid", "15-60"],
  ["technology_mindset", "innovation_attitude", "future_technology", "I believe learning technology is worthwhile", "false", "rapid", "15-60"],
  ["technology_mindset", "innovation_attitude", "future_technology", "I think technology changes too fast to keep up", "true", "rapid", "15-60"],
  ["technology_mindset", "digital_confidence", "technology_usage", "I feel at ease using digital tools for tasks", "false", "rapid", "15-60"],
  ["technology_mindset", "digital_confidence", "technology_usage", "I lack confidence when using new devices", "true", "rapid", "15-60"],
  ["social_behavior", "empathy", "relationship_dynamics", "I try to see situations from others' point of view", "false", "deep", "18-60"],
  ["social_behavior", "empathy", "relationship_dynamics", "I find it hard to put myself in others' shoes", "true", "deep", "18-60"],
  ["social_behavior", "relationship_support", "emotional_support", "I offer support when friends face difficulties", "false", "deep", "18-60"],
  ["social_behavior", "relationship_support", "emotional_support", "I feel uncomfortable when others share problems", "true", "deep", "18-60"],
  ["social_behavior", "communication", "interaction_style", "I ask questions to understand others better", "false", "deep", "18-60"],
  ["social_behavior", "communication", "interaction_style", "I talk more than I listen in conversations", "true", "deep", "18-60"],
  ["social_behavior", "collaboration", "team_dynamics", "I enjoy contributing to group outcomes", "false", "deep", "18-60"],
  ["social_behavior", "collaboration", "team_dynamics", "I prefer to work alone rather than in a team", "true", "deep", "18-60"],
  ["social_behavior", "relationship_awareness", "emotional_connection", "I notice when someone seems upset", "false", "deep", "18-60"],
  ["social_behavior", "relationship_awareness", "emotional_connection", "I often miss emotional cues in conversations", "true", "deep", "18-60"],
  ["leadership_potential", "influence", "decision_leadership", "I help groups reach decisions when needed", "false", "deep", "18-60"],
  ["leadership_potential", "influence", "decision_leadership", "I prefer not to influence group choices", "true", "deep", "18-60"],
  ["leadership_potential", "initiative", "group_dynamics", "I step in when a team needs direction", "false", "deep", "18-60"],
  ["leadership_potential", "initiative", "group_dynamics", "I wait for someone else to take charge", "true", "deep", "18-60"],
  ["leadership_potential", "team_guidance", "group_support", "I encourage team members to share ideas", "false", "deep", "18-60"],
  ["leadership_potential", "team_guidance", "group_support", "I find it difficult to coordinate with others", "true", "deep", "18-60"],
  ["leadership_potential", "vision", "strategic_thinking", "I think about where a project could lead", "false", "deep", "18-60"],
  ["leadership_potential", "vision", "strategic_thinking", "I focus only on immediate tasks", "true", "deep", "18-60"],
  ["leadership_potential", "decision_making", "leadership_decisions", "I can make timely decisions when needed", "false", "deep", "18-60"],
  ["leadership_potential", "decision_making", "leadership_decisions", "I delay decisions when the outcome is uncertain", "true", "deep", "18-60"],
  ["creativity_innovation", "idea_generation", "creative_thinking", "I come up with multiple options when solving problems", "false", "deep", "15-60"],
  ["creativity_innovation", "idea_generation", "creative_thinking", "I usually go with the first solution I think of", "true", "deep", "15-60"],
  ["creativity_innovation", "creative_exploration", "idea_development", "I like to combine ideas from different areas", "false", "deep", "15-60"],
  ["creativity_innovation", "creative_exploration", "idea_development", "I stick to conventional ways of thinking", "true", "deep", "15-60"],
  ["creativity_innovation", "curiosity", "idea_exploration", "I enjoy learning about topics outside my field", "false", "deep", "15-60"],
  ["creativity_innovation", "curiosity", "idea_exploration", "I rarely explore ideas that are unfamiliar", "true", "deep", "15-60"],
  ["creativity_innovation", "innovation", "problem_solving", "I try new methods when the usual approach fails", "false", "deep", "15-60"],
  ["creativity_innovation", "innovation", "problem_solving", "I avoid changing how I do things", "true", "deep", "15-60"],
  ["creativity_innovation", "creative_flexibility", "innovation_behavior", "I am open to revising my ideas when needed", "false", "deep", "15-60"],
  ["creativity_innovation", "creative_flexibility", "innovation_behavior", "I find it hard to let go of my initial ideas", "true", "deep", "15-60"],
  ["life_values", "purpose", "life_direction", "I think about what I want my life to stand for", "false", "deep", "18-60"],
  ["life_values", "purpose", "life_direction", "I seldom reflect on my life direction", "true", "deep", "18-60"],
  ["life_values", "meaningful_choices", "life_direction", "I choose activities that align with what matters to me", "false", "deep", "18-60"],
  ["life_values", "meaningful_choices", "life_direction", "I make choices without considering my values", "true", "deep", "18-60"],
  ["life_values", "meaning", "life_reflection", "I consider whether my daily actions match my beliefs", "false", "deep", "18-60"],
  ["life_values", "meaning", "life_reflection", "I rarely evaluate how meaningful my life feels", "true", "deep", "18-60"],
  ["life_values", "personal_values", "value_clarity", "I can name the values that guide my decisions", "false", "deep", "18-60"],
  ["life_values", "personal_values", "value_clarity", "I am unsure what my core values are", "true", "deep", "18-60"],
  ["life_values", "life_priorities", "value_prioritization", "I prioritize activities that give my life meaning", "false", "deep", "18-60"],
  ["life_values", "life_priorities", "value_prioritization", "I spend little time on what matters most to me", "true", "deep", "18-60"],
];

function run(): void {
  const content = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = content.split(/\n/);
  const headerLine = (lines[0] ?? "").replace(/^\uFEFF/, "").trim();
  const dataLines = lines.slice(1).filter((l) => l.trim().length > 0);

  const previousTotal = dataLines.length;
  const existingTexts = new Set<string>();
  for (const line of dataLines) {
    const rawCols = parseLine(line);
    const text = getQuestionText(rawCols).trim();
    existingTexts.add(text.toLowerCase().replace(/\s+/g, " "));
  }

  const toAdd = Math.max(0, TARGET_TOTAL - previousTotal);
  const newRows: string[] = [];
  let added = 0;
  let duplicatesDetected = 0;

  for (const row of NEW_QUESTIONS) {
    if (added >= toAdd) break;
    const [category, trait, sub_area, question_text, reverse_scored, test_type, age_group] = row;
    const key = question_text.toLowerCase().replace(/\s+/g, " ");
    if (existingTexts.has(key)) {
      duplicatesDetected++;
      continue;
    }
    existingTexts.add(key);
    newRows.push([category, trait, sub_area, question_text, reverse_scored, "1", test_type, age_group].join(","));
    added++;
  }

  const hasTrailingNewline = content.endsWith("\n");
  const allDataLines = dataLines.concat(newRows);
  const out = [headerLine, ...allDataLines].join("\n") + (hasTrailingNewline ? "\n" : "");
  fs.writeFileSync(CSV_PATH, out, "utf-8");

  const finalTotal = allDataLines.length;

  console.log("\n--- Summary ---");
  console.log("Previous total rows:", previousTotal);
  console.log("New rows added:", added);
  console.log("Final total rows:", finalTotal);
  console.log("Duplicates detected:", duplicatesDetected);
  console.log("File saved successfully.\n");
}

run();
