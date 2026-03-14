"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PsychologistCard from "@/components/psychologists/PsychologistCard";
import type { PsychologistListItem } from "@/components/psychologists/PsychologistCard";

export default function MobileGuidancePage() {
  const [list, setList] = useState<PsychologistListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/psychologists")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        setList(
          data.map((p: { photo?: string | null }) => ({
            ...p,
            photo: p.photo ?? null,
          }))
        );
      })
      .catch(() => setError("Could not load psychologists"))
      .finally(() => setLoading(false));
  }, []);

  const handleBookSession = (psychologist: PsychologistListItem) => {
    window.location.href = `/mobile/psychologist/${psychologist.id}`;
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md p-4 space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">Guidance</h1>
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md p-4 space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">Guidance</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-semibold text-gray-900">Guidance</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Book a session with a psychologist for online counselling.
        </p>
      </motion.div>

      <div className="space-y-4">
        {list.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <PsychologistCard
              psychologist={{
                id: p.id,
                name: p.name,
                specialization: p.specialization,
                experience: p.experience,
                languages: p.languages,
                rating: p.rating,
                sessionPrice: p.sessionPrice,
                photo: p.photo,
              }}
              onBookSession={handleBookSession}
            />
          </motion.div>
        ))}
      </div>
      {list.length === 0 && (
        <p className="text-gray-500 text-sm">No psychologists available at the moment.</p>
      )}
    </div>
  );
}
