/**
 * Rank intelligence: predict rank range and exam-clear probability from performance.
 */

export interface PerformanceForRank {
  accuracy: number;
  speed: number;
  consistency: number;
  readinessScore: number;
}

export interface RankPrediction {
  rankRange: string;
  examClearProbability: number;
}

const RANK_BANDS: { minScore: number; label: string }[] = [
  { minScore: 90, label: "Top 5%" },
  { minScore: 85, label: "Top 10%" },
  { minScore: 78, label: "Top 20%" },
  { minScore: 70, label: "Top 30%" },
  { minScore: 60, label: "Top 50%" },
  { minScore: 45, label: "Middle tier" },
  { minScore: 0, label: "Needs more practice" },
];

/**
 * Predict rank range and exam clear probability from performance metrics.
 */
export function predictRank(performance: PerformanceForRank): RankPrediction {
  const { accuracy, speed, consistency, readinessScore } = performance;
  const composite = readinessScore * 0.5 + accuracy * 0.2 + speed * 0.15 + consistency * 0.15;
  const clamped = Math.min(100, Math.max(0, composite));

  let rankRange = "Needs more practice";
  for (const band of RANK_BANDS) {
    if (clamped >= band.minScore) {
      rankRange = band.label;
      break;
    }
  }

  const examClearProbability = Math.round(
    Math.min(99, Math.max(1, (clamped / 100) * 85 + (accuracy / 100) * 10 + (consistency / 100) * 5))
  );

  return {
    rankRange,
    examClearProbability,
  };
}
