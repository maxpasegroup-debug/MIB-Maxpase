"use client";

import Link from "next/link";

export type ExpertSummary = {
  id: string;
  name: string;
  specialization: string;
  experience: number;
};

interface ExpertInterpretationFunnelProps {
  sessionId: string;
  experts: ExpertSummary[];
}

export default function ExpertInterpretationFunnel({ sessionId, experts }: ExpertInterpretationFunnelProps) {
  if (experts.length === 0) return null;

  const guidanceUrl = `/guidance?sessionId=${encodeURIComponent(sessionId)}`;

  return (
    <section className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="mb-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          Recommended after Career Intelligence Test
        </span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Understand Your Results with an Expert
      </h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        This intelligence report contains deep insights about your personality, strengths, and career potential.
        A certified career expert can help interpret your results and create a personalized strategy.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {experts.map((expert) => (
          <div
            key={expert.id}
            className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm flex flex-col"
          >
            <p className="font-semibold text-gray-900">{expert.name}</p>
            <p className="text-sm text-gray-600 mt-1">{expert.specialization}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {expert.experience} {expert.experience === 1 ? "year" : "years"} experience
            </p>
            <Link
              href={guidanceUrl}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-4 py-2.5 text-sm font-medium text-white hover:scale-105 transition-transform"
            >
              Book Interpretation Session
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
