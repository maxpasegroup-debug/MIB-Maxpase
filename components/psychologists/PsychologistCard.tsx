"use client";

import Image from "next/image";

export interface PsychologistListItem {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  languages: string;
  rating: number;
  sessionPrice: number;
  photo: string | null;
}

interface PsychologistCardProps {
  psychologist: PsychologistListItem;
  onBookSession: (psychologist: PsychologistListItem) => void;
}

export default function PsychologistCard({ psychologist, onBookSession }: PsychologistCardProps) {
  const { name, specialization, experience, languages, rating, sessionPrice, photo } = psychologist;

  return (
    <div className="rounded-2xl shadow-xl border border-white/60 bg-white/80 backdrop-blur-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-purple-600 font-bold text-xl shrink-0 overflow-hidden relative">
            {photo ? (
              <Image src={photo} alt={name} fill className="object-cover" sizes="80px" unoptimized />
            ) : (
              name.charAt(0)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-lg truncate">{name}</h3>
            <p className="text-sm text-purple-600 font-medium mt-0.5">{specialization}</p>
            <p className="text-xs text-gray-500 mt-1">{experience} years experience</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          <span className="text-gray-500">Languages:</span> {languages}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center gap-1 text-amber-600">
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-sm">★</span>
          </div>
          <p className="text-gray-700 font-semibold">₹{sessionPrice}/session</p>
        </div>
        <button
          type="button"
          onClick={() => onBookSession(psychologist)}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-2.5 text-white font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          Book Session
        </button>
      </div>
    </div>
  );
}
