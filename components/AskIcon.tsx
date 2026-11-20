// Doodle speech bubble: one happy eye, one ">" wink, tongue out. Replaces the generic AI sparkle.
export default function AskIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 5.5c0-1 .8-2 2-2h12c1.2 0 2 1 2 2v9c0 1-.8 2-2 2h-6.5L7 20.5V16.5H6c-1.2 0-2-.8-2-2z" />
      <circle cx="9" cy="8.6" r="0.6" fill="currentColor" />
      <path d="M14 7.6l2.2 1.1L14 9.8" />
      <path d="M8 11.4c1.2 1.7 6.8 1.7 8 0" />
      <path d="M12.6 12.9v1.2a1 1 0 0 0 2 0v-1.7" fill="currentColor" />
    </svg>
  );
}
