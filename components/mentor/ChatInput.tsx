"use client";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder = "Type your question…" }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input") ?? form.querySelector("textarea");
    const value = (input as HTMLInputElement | HTMLTextAreaElement)?.value?.trim();
    if (value && !disabled) {
      onSend(value);
      if (input) (input as HTMLInputElement).value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-white border-t border-gray-100">
      <input
        type="text"
        name="message"
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl bg-purple-600 px-4 py-2.5 text-white font-medium hover:bg-purple-700 disabled:opacity-70 shrink-0"
      >
        Send
      </button>
    </form>
  );
}
