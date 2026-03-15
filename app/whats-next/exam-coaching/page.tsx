"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WHATS_NEXT_BASE } from "@/lib/basePath";
import {
  HiOutlineAcademicCap,
  HiOutlineClipboardDocumentList,
  HiOutlinePlay,
} from "react-icons/hi2";

interface Category {
  id: string;
  name: string;
  description: string | null;
  _count: { exams: number };
}

interface Exam {
  id: string;
  name: string;
  description: string | null;
  difficulty: string | null;
  duration: number | null;
  totalQuestions: number | null;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  exams: Exam[];
}

export default function ExamCoachingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [list, setList] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/exams/categories").then((r) => r.json()),
      fetch("/api/exams/list").then((r) => r.json()),
    ])
      .then(([cats, groups]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setList(Array.isArray(groups) ? groups : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Exam Coaching Arena
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered competitive exam training with diagnostic tests, practice drills, and performance analytics.
          </p>
        </header>

        {/* Start diagnostic CTA */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 sm:p-8 mb-12"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">Start with a diagnostic</h2>
          <p className="text-gray-600 mb-6">
            Take a short diagnostic test for any exam to get a baseline and personalised training plan.
          </p>
          {list.length > 0 && list[0].exams.length > 0 ? (
            <Link
              href={`/exam-coaching/${list[0].exams[0].id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold px-6 py-3 shadow-lg hover:scale-105 transition-transform"
            >
              <HiOutlinePlay className="w-5 h-5" />
              Go to exam dashboard
            </Link>
          ) : (
            <p className="text-gray-500 text-sm">No exams configured yet. Check back soon.</p>
          )}
        </motion.section>

        {/* Exam categories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exam categories</h2>
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">No categories yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <HiOutlineAcademicCap className="w-10 h-10 text-purple-600 mb-3" />
                  <h3 className="font-bold text-gray-900">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{cat._count.exams} exam(s)</p>
                  <Link
                    href={`/exam-coaching?category=${cat.id}`}
                    className="mt-3 inline-block text-sm font-medium text-purple-600 hover:underline"
                  >
                    View exams →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Exam list grouped by category */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exams by category</h2>
          {list.length === 0 && !loading ? (
            <p className="text-gray-500">No exams available yet.</p>
          ) : (
            <div className="space-y-8">
              {list.map((group) => (
                <div key={group.id}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{group.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {group.exams.map((exam) => (
                      <Link key={exam.id} href={`/exam-coaching/${exam.id}`}>
                        <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                          <HiOutlineClipboardDocumentList className="w-8 h-8 text-purple-600 mb-2" />
                          <h4 className="font-semibold text-gray-900">{exam.name}</h4>
                          {exam.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exam.description}</p>
                          )}
                          <div className="flex gap-2 mt-2 text-xs text-gray-500">
                            {exam.duration != null && <span>{exam.duration} min</span>}
                            {exam.totalQuestions != null && (
                              <span>{exam.totalQuestions} questions</span>
                            )}
                            {exam.difficulty && <span>{exam.difficulty}</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href={WHATS_NEXT_BASE} className="text-purple-600 font-medium hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
