"use client";

import { useEffect, useState } from "react";
import ProfileCard from "@/components/dashboard/ProfileCard";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/profile", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setName(data.name ?? "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setUser(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <ProfileCard
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        role={user?.role ?? ""}
      />
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Update name</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-70"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
