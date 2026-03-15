"use client";

import { useState } from "react";
import PsychologistCard from "@/components/psychologists/PsychologistCard";
import BookingModal from "@/components/psychologists/BookingModal";
import type { PsychologistListItem } from "@/components/psychologists/PsychologistCard";

interface GuidanceClientProps {
  psychologists: PsychologistListItem[];
  sessionId?: string | null;
}

export default function GuidanceClient({ psychologists, sessionId = null }: GuidanceClientProps) {
  const [bookingPsychologist, setBookingPsychologist] = useState<PsychologistListItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {psychologists.map((p) => (
          <PsychologistCard
            key={p.id}
            psychologist={p}
            onBookSession={setBookingPsychologist}
          />
        ))}
      </div>

      {bookingPsychologist && (
        <BookingModal
          psychologist={bookingPsychologist}
          sessionId={sessionId}
          onClose={() => setBookingPsychologist(null)}
        />
      )}
    </>
  );
}
