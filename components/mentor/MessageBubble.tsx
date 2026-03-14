interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-purple-600 text-white rounded-br-md"
            : "bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
