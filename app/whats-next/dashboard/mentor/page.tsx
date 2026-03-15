"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";

const ChatWindow = dynamic(() => import("@/components/mentor/ChatWindow"), { ssr: false });
import type { ChatMessage } from "@/components/mentor/ChatWindow";

const STARTER_MESSAGE = `Hello! I'm your AI Career Mentor.

I can help you understand your career profile, strengths, and next steps.

What would you like to know?`;

function genId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function MentorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setError(null);
    const userMsg: ChatMessage = { id: genId(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai-mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to get response");
      }
      const assistantMsg: ChatMessage = {
        id: genId(),
        role: "assistant",
        content: data.message ?? "No response.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">AI Career Mentor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Get guidance on your career and strengths. I use your career test results to personalise advice.
        </p>
      </header>
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <ChatWindow
        messages={messages}
        onSend={handleSend}
        loading={loading}
        starterMessage={STARTER_MESSAGE}
      />
    </div>
  );
}
