"use client";

import { useState } from "react";
import type { PsychologistListItem } from "./PsychologistCard";

interface BookingModalProps {
  psychologist: PsychologistListItem | null;
  sessionId: string | null;
  onClose: () => void;
}

export default function BookingModal({ psychologist, sessionId, onClose }: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!psychologist) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          psychologistId: psychologist.id,
          userName: name.trim(),
          userEmail: email.trim(),
          sessionId: sessionId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <h2 id="booking-modal-title" className="text-xl font-bold text-gray-900 mb-2">
            Book Session with {psychologist.name}
          </h2>
          {success ? (
            <div className="py-6">
              <p className="text-green-700 font-medium text-center">
                Your counselling request has been submitted.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-gray-200 py-2.5 text-gray-800 font-medium hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="booking-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="booking-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="your@email.com"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-300 py-2.5 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 text-white font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
