export interface PerformanceData {
  accuracy: number;
  speed: number;
  weakTopics: string[];
  readinessScore: number;
  topicMastery?: Record<string, number>;
  weakTopicNames?: string[];
}

const COACH_STYLES = ["strict", "mentor", "military", "motivational"] as const;

/**
 * Generate AI coach feedback from performance data.
 * Acts as a strict exam mentor. When performance is poor, gives direct corrective advice.
 * In production this would call an LLM; here we return structured template-based feedback.
 */
export async function generateCoachFeedback(
  performanceData: PerformanceData,
  style: (typeof COACH_STYLES)[number] = "strict"
): Promise<string> {
  const { accuracy, speed, weakTopics, readinessScore, weakTopicNames } = performanceData;

  const weakCount = weakTopics.length;
  const accuracyPct = Math.round(accuracy);
  const speedPct = Math.round(speed);
  const weakNames = (weakTopicNames && weakTopicNames.length > 0)
    ? weakTopicNames.join(" and ")
    : weakCount > 0
      ? "your weak areas"
      : "";
  const isPoorPerformance = accuracyPct < 60 || readinessScore < 50;

  const lines: string[] = [];

  lines.push("Act as a strict exam mentor. Here is your assessment.");
  lines.push(`Performance summary: Accuracy ${accuracyPct}%, Speed ${speedPct}%, Readiness ${readinessScore}/100.`);
  if (weakCount > 0) {
    lines.push(`Weak topics: ${weakNames || `${weakCount} area(s)`}.`);
  }
  if (isPoorPerformance && weakNames) {
    lines.push(`You are losing marks in ${weakNames}. Practice 20 questions from these topics today.`);
  }
  lines.push("");

  if (style === "strict") {
    lines.push("You are training for a competitive exam. Here is your assessment.");
    if (accuracyPct < 60) {
      lines.push(`Accuracy ${accuracyPct}% is below par. You must revise fundamentals before attempting more tests.`);
    } else if (accuracyPct < 80) {
      lines.push(`Accuracy ${accuracyPct}% is acceptable but not competitive. Focus on reducing careless errors.`);
    } else {
      lines.push(`Accuracy ${accuracyPct}% is solid. Maintain this and push for 90%+.`);
    }
    if (speedPct < 50) {
      lines.push(`Speed is low. Practice timed drills daily.`);
    } else if (speedPct < 80) {
      lines.push(`Speed is improving. Keep doing timed practice.`);
    } else {
      lines.push(`Speed is good. Use the extra time to double-check answers.`);
    }
    if (weakCount > 0) {
      lines.push(`${weakCount} weak area(s) identified. Prioritise these in your next study plan.`);
    }
    lines.push(`Readiness score: ${readinessScore}/100. ${readinessScore >= 70 ? "You are getting there." : "More practice required."}`);
    if (weakCount > 0) {
      lines.push(`Daily action recommendation: Practice 20 questions from ${weakNames || "your weak topics"} today.`);
    }
  } else if (style === "mentor") {
    lines.push("Let's look at your progress together.");
    lines.push(`Your accuracy is ${accuracyPct}%. ${accuracyPct >= 70 ? "Good work." : "We can improve this with targeted practice."}`);
    lines.push(`Speed: ${speedPct}%. ${speedPct >= 60 ? "Keep it up." : "Try a few speed drills this week."}`);
    if (weakCount > 0) {
      lines.push(`Focus your next sessions on ${weakCount} area(s) where you have room to grow.`);
    }
    lines.push(`Overall readiness: ${readinessScore}/100. ${readinessScore >= 70 ? "You're on track." : "Stick to your plan and reassess next week."}`);
    if (weakCount > 0) {
      lines.push(`Daily action: Practice 20 questions from ${weakNames || "your weak areas"} today.`);
    }
  } else if (style === "military") {
    lines.push("Report as follows.");
    lines.push(`Accuracy: ${accuracyPct}%. ${accuracyPct >= 80 ? "Standard met." : "Below standard. Correct immediately."}`);
    lines.push(`Speed: ${speedPct}%. ${speedPct >= 70 ? "Adequate." : "Insufficient. Drill until improved."}`);
    if (weakCount > 0) {
      lines.push(`${weakCount} weak topic(s). Address in next training cycle.`);
    }
    lines.push(`Readiness: ${readinessScore}/100. ${readinessScore >= 75 ? "Cleared for next phase." : "Not cleared. Continue training."}`);
    if (weakCount > 0) {
      lines.push(`Daily action: Practice 20 questions from ${weakNames || "weak topics"} today.`);
    }
  } else {
    lines.push("Great effort. Here's where you stand.");
    lines.push(`Accuracy at ${accuracyPct}% — ${accuracyPct >= 75 ? "excellent!" : "you're building momentum."}`);
    lines.push(`Speed at ${speedPct}% — ${speedPct >= 60 ? "well done." : "a little more practice will help."}`);
    if (weakCount > 0) {
      lines.push(`A few topics need attention; tackling them will boost your score.`);
    }
    lines.push(`Readiness: ${readinessScore}/100. Keep going!`);
    if (weakCount > 0) {
      lines.push(`Daily action: Practice 20 questions from ${weakNames || "your weak topics"} today.`);
    }
  }

  return lines.join("\n\n");
}
