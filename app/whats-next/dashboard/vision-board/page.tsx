"use client";

import { useState } from "react";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import { Card } from "@/components/ui/Card";

const TEMPLATES = [
  { id: "child", label: "Child", description: "Goals and habits for younger learners" },
  { id: "youth", label: "Youth", description: "Career and growth milestones" },
  { id: "adult", label: "Adult", description: "Professional and life goals" },
];

export default function VisionBoardPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [goals, setGoals] = useState("");
  const [habits, setHabits] = useState("");
  const [milestones, setMilestones] = useState("");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Vision Board</h1>
        <p className="text-gray-600 mt-1">Set your goals, habits, and milestones.</p>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Choose a template</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTemplate(t.id)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                selectedTemplate === t.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <span className="font-semibold text-gray-900">{t.label}</span>
              <p className="text-sm text-gray-500 mt-1">{t.description}</p>
            </button>
          ))}
        </div>
      </section>

      {selectedTemplate && (
        <Card>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
                placeholder="Your short and long-term goals..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habits</label>
              <textarea
                value={habits}
                onChange={(e) => setHabits(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
                placeholder="Daily or weekly habits to build..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Milestones</label>
              <textarea
                value={milestones}
                onChange={(e) => setMilestones(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
                placeholder="Key milestones to track..."
              />
            </div>
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-2.5"
            >
              Save Vision Board
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
