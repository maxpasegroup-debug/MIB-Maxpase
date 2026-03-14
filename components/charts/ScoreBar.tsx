"use client";

interface ScoreBarProps {
  label: string;
  score: number;
}

export default function ScoreBar({ label, score }: ScoreBarProps) {
  const percent = Math.min(100, Math.max(0, score));
  const gradientBar =
    score <= 30
      ? "linear-gradient(90deg, #ef4444, #f97316)"
      : score <= 60
        ? "linear-gradient(90deg, #f59e0b, #eab308)"
        : "linear-gradient(90deg, #22c55e, #14b8a6)";

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{score}/100</span>
      </div>
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: gradientBar }}
        />
      </div>
    </div>
  );
}
