"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

interface PsychologistRow {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  profilePhoto: string | null;
}

export default function AdminPsychologistsPage() {
  const [list, setList] = useState<PsychologistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [languages, setLanguages] = useState("English");
  const [bio, setBio] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [availability, setAvailability] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/psychologists", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/admin/psychologists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          specialization,
          experienceYears: experienceYears ? parseInt(experienceYears, 10) : 0,
          profilePhoto: profilePhoto || undefined,
          languages,
          bio: bio || undefined,
          consultationFee: consultationFee ? parseInt(consultationFee, 10) : 0,
          availability: availability || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setList((prev) => [{ ...data, profilePhoto: data.profilePhoto } as PsychologistRow, ...prev]);
      setName("");
      setSpecialization("");
      setExperienceYears("");
      setProfilePhoto("");
      setBio("");
      setConsultationFee("");
      setAvailability("");
      setFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Psychologists</h1>
        <Link href={`${WHATS_NEXT_BASE}/guidance`} className="text-sm text-purple-600 hover:underline">
          View on Guidance page →
        </Link>
      </div>
      <p className="text-gray-600">Manage psychologist profiles. New profiles appear on Expert Guidance.</p>

      <button
        type="button"
        onClick={() => setFormOpen((o) => !o)}
        className="rounded-xl bg-purple-600 text-white font-semibold px-4 py-2 hover:bg-purple-700"
      >
        {formOpen ? "Cancel" : "+ Add Psychologist"}
      </button>

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl">
          <h2 className="font-semibold text-gray-900">Onboarding form</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
            <input type="url" value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
            <input type="text" required value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma-separated)</label>
            <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pricing per session (₹)</label>
            <input type="number" min={0} value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available time slots (JSON or text)</label>
            <textarea value={availability} onChange={(e) => setAvailability(e.target.value)} rows={2} placeholder='e.g. ["Mon 10-12", "Wed 14-16"]' className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitLoading} className="rounded-xl bg-purple-600 text-white font-semibold px-4 py-2 disabled:opacity-70">
            {submitLoading ? "Saving…" : "Save"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Specialization</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Experience</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fee (₹)</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500">No psychologists yet. Add one above.</td></tr>
              ) : (
                list.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                    <td className="py-3 px-4 text-gray-600">{p.specialization}</td>
                    <td className="py-3 px-4 text-gray-600">{p.experienceYears} yrs</td>
                    <td className="py-3 px-4 text-gray-600">₹{p.consultationFee}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
