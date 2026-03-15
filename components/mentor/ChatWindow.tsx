"use client";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { MentorMessageSkeleton } from "@/components/ui/Skeleton";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  loading?: boolean;
  starterMessage?: string;
}

export default function ChatWindow({
  messages,
  onSend,
  loading,
  starterMessage,
}: ChatWindowProps) {
  const showStarter = messages.length === 0 && starterMessage;

  return (
    <div className="flex flex-col h-[480px] sm:h-[520px] bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showStarter && (
          <MessageBubble role="assistant" content={starterMessage} />
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {loading && <MentorMessageSkeleton />}
      </div>
      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  );
}
