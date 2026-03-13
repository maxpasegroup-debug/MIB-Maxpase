"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MOCK_PSYCHOLOGISTS } from "@/lib/mock-psychologists";

export default function PsychologistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const doc = MOCK_PSYCHOLOGISTS.find((p) => p.id === id);
  const [showBooking, setShowBooking] = useState(false);
  const [step, setStep] = useState<"date" | "time" | "confirm">("date");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  if (!doc) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Psychologist not found.</p>
        <Link href="/mobile/guidance" className="text-purple-600 mt-2 inline-block">
          Back to Guidance
        </Link>
      </div>
    );
  }

  const dates = doc.availability ?? [];
  const selectedDay = dates.find((d) => d.date === selectedDate);
  const slots = selectedDay?.slots ?? [];

  return (
    <div className="px-4 py-6 pb-8">
      <Link
        href="/mobile/guidance"
        className="text-sm text-purple-600 mb-4 inline-block"
      >
        ← Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="h-24 bg-gradient-to-r from-purple-500 to-pink-500" />
        <div className="px-4 -mt-12 pb-4">
          <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center text-3xl font-bold text-purple-600">
            {doc.name.charAt(0)}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mt-3">{doc.name}</h1>
          <p className="text-gray-600">{doc.specialization}</p>
          <p className="text-sm text-gray-500">{doc.experienceYears} years experience</p>
          <p className="text-sm text-amber-600 mt-1">⭐ {doc.rating}</p>
          {doc.languages && (
            <p className="text-sm text-gray-500 mt-2">Languages: {doc.languages}</p>
          )}
          {doc.bio && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{doc.bio}</p>
          )}
          <p className="text-lg font-semibold text-gray-900 mt-4">
            Consultation: ₹{doc.consultationFee}
          </p>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Available slots</p>
            <div className="flex flex-wrap gap-2">
              {dates.slice(0, 3).map((d) => (
                <span
                  key={d.date}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                >
                  {d.date}
                </span>
              ))}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBooking(true)}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-3.5 text-white font-semibold shadow-lg"
          >
            Book Session
          </motion.button>
        </div>
      </motion.div>

      {/* Booking modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={() => setShowBooking(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] rounded-t-2xl bg-white shadow-xl p-6 pb-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  {step === "date" && "Choose Date"}
                  {step === "time" && "Choose Time"}
                  {step === "confirm" && "Confirm Booking"}
                </h3>
                <button
                  onClick={() => setShowBooking(false)}
                  className="text-gray-500 text-sm"
                >
                  Close
                </button>
              </div>

              {step === "date" && (
                <div className="space-y-2">
                  {dates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => {
                        setSelectedDate(d.date);
                        setStep("time");
                      }}
                      className="w-full rounded-xl border border-gray-200 py-3 text-left px-4 font-medium text-gray-900"
                    >
                      {d.date}
                    </button>
                  ))}
                </div>
              )}

              {step === "time" && (
                <div className="space-y-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep("confirm");
                      }}
                      className="w-full rounded-xl border border-gray-200 py-3 text-left px-4 font-medium text-gray-900"
                    >
                      {slot}
                    </button>
                  ))}
                  <button
                    onClick={() => setStep("date")}
                    className="text-sm text-gray-500 mt-2"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {step === "confirm" && (
                <div>
                  <p className="text-gray-600 text-sm">
                    {doc.name} — {selectedDate} at {selectedSlot}
                  </p>
                  <p className="font-semibold text-gray-900 mt-2">
                    ₹{doc.consultationFee}
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep("time")}
                      className="flex-1 rounded-xl border border-gray-200 py-3 text-gray-700 font-medium"
                    >
                      Back
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowBooking(false);
                        router.push("/mobile/profile");
                      }}
                      className="flex-1 rounded-xl bg-purple-600 py-3 text-white font-semibold"
                    >
                      Confirm
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
