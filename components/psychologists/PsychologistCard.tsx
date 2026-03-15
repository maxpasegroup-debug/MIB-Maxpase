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

  const tags = languages ? languages.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="rounded-2xl shadow-xl border border-gray-100 bg-white overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <div className="relative h-40 bg-gradient-to-br from-purple-100 to-blue-100">
        {photo ? (
          <Image src={photo} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-purple-600 font-bold text-5xl">
            {name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
        <p className="text-sm text-purple-600 font-medium mt-0.5">{specialization}</p>
        <p className="text-xs text-gray-500 mt-1">{experience} years experience</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((t) => (
              <span key={t} className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-700">{t}</span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">Next available: Contact to book</p>
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
          Book
        </button>
      </div>
    </div>
  );
}
