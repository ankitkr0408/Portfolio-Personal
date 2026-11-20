"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/data";
import AskIcon from "./AskIcon";
import { answer, setBotContent, STARTER_QUESTIONS } from "@/lib/botBrain";

type Msg = { role: "user" | "assistant"; content: string; chips?: string[] };

// Other components can open the chat (optionally with a question):
// window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: "What does Ankit do?" }))
export const OPEN_CHAT_EVENT = "open-ai-chat";

const STORAGE_KEY = "ak-chat-v2";
const MAX_INPUT = 500;

const GREETING = `Hi! 👋 I'm Ankit's assistant. Ask me anything about his work, skills, projects, or how to hire him.`;

// Resolves after `ms`, or rejects early when the visitor taps Skip.
const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new Error("skipped"));
    }, { once: true });
  });

/* ---------- tiny, safe Markdown renderer (bold, code, links, lists) ---------- */

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i;

function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|([\w.+-]+@[\w-]+\.[\w.-]+)|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    const link = (href: string, label: React.ReactNode) => {
      const external = /^https?:/i.test(href);
      return (
        <a
          key={k}
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="font-medium text-rose-300 underline decoration-rose-300/40 underline-offset-2 hover:decoration-rose-300"
        >
          {label}
        </a>
      );
    };
    if (m[1] !== undefined) out.push(SAFE_HREF.test(m[2]) ? link(m[2], m[1]) : m[1]);
    else if (m[3] !== undefined) out.push(<strong key={k} className="font-semibold text-white">{m[3]}</strong>);
    else if (m[4] !== undefined) out.push(<code key={k} className="rounded bg-white/10 px-1 py-0.5 text-[0.85em]">{m[4]}</code>);
    else if (m[5] !== undefined) out.push(link(`mailto:${m[5]}`, m[5]));
    else if (m[6] !== undefined) {
      const url = m[6].replace(/[.,;:!?]+$/, "");
      out.push(link(url, url.replace(/^https?:\/\//, "")));
      if (url.length < m[6].length) out.push(m[6].slice(url.length));
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const bullet = /^\s*(?:[-*•]|\d+[.)])\s+/;
    if (bullet.test(line)) {
      const ordered = /^\s*\d/.test(line);
      const items: string[] = [];
      while (i < lines.length && bullet.test(lines[i])) items.push(lines[i++].replace(bullet, ""));
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={i} className={`space-y-1 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-neutral-500`}>
          {items.map((it, j) => <li key={j}>{inline(it.replace(/^#+\s*/, ""), `${i}-${j}`)}</li>)}
        </List>,
      );
      continue;
    }
    if (line.trim()) {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !bullet.test(lines[i])) para.push(lines[i++].replace(/^#+\s*/, ""));
      blocks.push(
        <p key={i}>
          {para.map((p, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {inline(p, `${i}-${j}`)}
            </Fragment>
          ))}
        </p>,
      );
      continue;
    }
    i++;
  }
  return <div className="space-y-2">{blocks}</div>;
}

/* ---------- icons ---------- */

const Close = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const Send = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const StopIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <rect x="7" y="7" width="10" height="10" rx="2" />
  </svg>
);
const Refresh = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5" />
  </svg>
);

/* ---------- component ---------- */

export default function ChatBot({ content }: { content: SiteContent }) {
  const { profile } = content;
  // The bot answers from the same (admin-editable) content the pages render.
  useEffect(() => {
    setBotContent(content);
  }, [content]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Msg[]>([]);
  messagesRef.current = messages;

  // Restore this tab's conversation.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Msg[];
        if (Array.isArray(parsed)) setMessages(parsed.filter((m) => m && typeof m.content === "string" && m.content));
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (busy) return; // save completed turns only
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* storage unavailable */
    }
  }, [messages, busy]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: busy ? "auto" : "smooth" });
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Lock page scroll behind the full-screen panel on phones.
    const lock = window.matchMedia("(max-width: 639px)").matches;
    const prev = document.body.style.overflow;
    if (lock) document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      if (lock) document.body.style.overflow = prev;
    };
  }, [open]);

  const send = useCallback(async (raw: string) => {
    const text = raw.trim().slice(0, MAX_INPUT);
    if (!text || abortRef.current) return;

    const history = messagesRef.current;
    const lastChips = [...history].reverse().find((m) => m.role === "assistant")?.chips;
    const reply = answer(text, lastChips);

    setMessages([...history, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const setReply = (content: string, chips?: string[]) =>
      setMessages((prev) => {
        const next = prev.slice();
        next[next.length - 1] = { role: "assistant", content, chips };
        return next;
      });

    try {
      // A short "thinking" pause, then the answer appears word by word.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) throw new Error("no animation");
      await wait(350 + Math.random() * 350, ctrl.signal);
      const words = reply.text.split(/(\s+)/);
      let shown = "";
      for (let i = 0; i < words.length; i++) {
        shown += words[i];
        if (i % 6 === 5) {
          setReply(shown);
          await wait(28, ctrl.signal);
        }
      }
    } catch {
      /* skipped or reduced motion: show the full answer now */
    } finally {
      setReply(reply.text, reply.chips);
      abortRef.current = null;
      setBusy(false);
      if (window.matchMedia("(hover: hover)").matches) inputRef.current?.focus();
    }
  }, []);

  // External "open chat" requests (hero button, etc.).
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<string | undefined>).detail;
      if (typeof q === "string" && q.trim()) send(q);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [send]);

  const stop = () => abortRef.current?.abort();
  const reset = () => {
    stop();
    setMessages([]);
    inputRef.current?.focus();
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const empty = messages.length === 0;

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat assistant" : "Ask Ankit's assistant"}
        aria-expanded={open}
        className={`group fixed right-4 z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-neutral-900 text-white transition hover:scale-105 hover:bg-neutral-800 active:scale-95 sm:right-6 ${open ? "max-sm:hidden" : ""}`}
        style={{ bottom: "max(5.5rem, calc(env(safe-area-inset-bottom) + 5rem))" }}
      >
        {open ? <Close className="h-4 w-4" /> : <AskIcon className="ask-wiggle h-5 w-5" />}
        <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-full bg-neutral-900 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 sm:block">{open ? "Close" : "Ask me anything"}</span>
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Chat with Ankit's assistant"
        aria-modal="false"
        aria-hidden={!open}
        className={`fixed z-[61] flex flex-col overflow-hidden border-white/10 bg-neutral-950/95 text-neutral-200 shadow-2xl shadow-black/70 backdrop-blur-xl transition-all duration-200 ease-out
          inset-0 sm:inset-auto sm:bottom-[9.5rem] sm:right-6 sm:h-[min(620px,calc(100dvh-11rem))] sm:w-[400px] sm:rounded-3xl sm:border
          ${open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-4 opacity-0"}`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
          <div className="relative">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 font-bold text-white">A</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-neutral-950 bg-emerald-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Ankit&apos;s assistant</p>
            <p className="truncate text-xs text-neutral-500">Online · instant answers about his work</p>
          </div>
          {!empty && (
            <button type="button" onClick={reset} aria-label="Start a new chat" title="New chat" className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white">
              <Refresh className="h-4 w-4" />
            </button>
          )}
          <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white">
            <Close className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 text-[15px] leading-relaxed" aria-live="polite">
          <Bubble role="assistant">
            <Markdown text={GREETING} />
          </Bubble>

          {empty && <Chips items={STARTER_QUESTIONS} onPick={send} />}

          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>
              {m.role === "assistant" && !m.content ? <Typing /> : m.role === "assistant" ? <Markdown text={m.content} /> : m.content}
            </Bubble>
          ))}

          {/* Follow-up questions keep the conversation going */}
          {!busy && !empty && messages[messages.length - 1]?.chips?.length ? (
            <Chips items={messages[messages.length - 1].chips!} onPick={send} />
          ) : null}
        </div>

        {/* Quick contact */}
        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2 text-xs text-neutral-500">
          <span className="truncate">Prefer a human?</span>
          <a href={`mailto:${profile.email}?subject=Project%20inquiry`} className="truncate font-medium text-neutral-300 hover:text-white">
            {profile.email}
          </a>
          <button type="button" onClick={copyEmail} className="ml-auto shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-neutral-300 hover:bg-white/10">
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 border-t border-white/10 p-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask about projects, skills, hiring…"
            aria-label="Your question"
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-[15px] text-white placeholder:text-neutral-500 focus:border-rose-400/60 focus:outline-none"
          />
          {busy ? (
            <button type="button" onClick={stop} aria-label="Show full answer" title="Skip" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <StopIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-black transition hover:bg-rose-100 disabled:opacity-30"
            >
              <Send className="h-5 w-5" />
            </button>
          )}
        </form>
      </div>
    </>
  );
}

function Chips({ items, onPick }: { items: string[]; onPick: (q: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {items.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onPick(s)}
          className="rounded-full border border-white/15 px-3 py-1.5 text-left text-sm text-neutral-300 transition hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-white"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function Bubble({ role, children }: { role: Msg["role"]; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 ${
          mine ? "rounded-br-md bg-white text-black" : "rounded-bl-md border border-white/10 bg-white/[0.04] text-neutral-200 [&_div]:whitespace-normal"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <span className="flex gap-1 py-1.5" aria-label="Thinking">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-neutral-500" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}
