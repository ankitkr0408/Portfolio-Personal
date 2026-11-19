"use client";

import { OPEN_CHAT_EVENT } from "./ChatBot";

// Opens the AI assistant from anywhere on the page, optionally asking a question straight away.
export default function AskAIButton({ question, className = "", children }: { question?: string; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: question }))}
      className={className}
    >
      {children}
    </button>
  );
}
