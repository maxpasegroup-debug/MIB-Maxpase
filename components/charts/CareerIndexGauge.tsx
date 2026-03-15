"use client";

interface CareerIndexGaugeProps {
  value: number;
  max?: number;
}

export default function CareerIndexGauge({ value, max = 100 }: CareerIndexGaugeProps) {
  const pct = Math.min(max, Math.max(0, value)) / max;
  const fillColor = value >= 70 ? "#22c55e" : value >= 50 ? "#eab308" : "#f97316";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-2">
        <span className="text-4xl sm:text-5xl font-bold text-gray-900">{Math.round(value)}</span>
        <span className="text-2xl text-gray-500"> / {max}</span>
      </div>
      <div className="w-full h-3 sm:h-4 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-800 ease-out"
          style={{ width: `${pct * 100}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}
