"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { ChatLine } from "@/lib/useParlo";

export function ChatPane({
  t,
  messages,
  peerTyping,
  disabled,
  onSend,
  onTyping,
}: {
  t: Dictionary;
  messages: ChatLine[];
  peerTyping: boolean;
  disabled: boolean;
  onSend: (text: string) => void;
  onTyping: (on: boolean) => void;
}) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, peerTyping]);

  function handleChange(value: string) {
    setDraft(value);
    onTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => onTyping(false), 1200);
  }

  function submit() {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
    onTyping(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-ink-800 bg-ink-900/60">
      <div className="scroll-slim flex-1 space-y-2.5 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="pt-6 text-center text-sm text-ink-500">
{t.chat.icebreaker}
          </p>
        )}

        {messages.map((m) =>
          m.from === "system" ? (
            <p key={m.id} className="py-1 text-center text-xs text-ink-500">
              {m.text}
            </p>
          ) : (
            <div
              key={m.id}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm ${
                  m.from === "me"
                    ? "rounded-br-md bg-accent text-ink-950"
                    : "rounded-bl-md bg-ink-800 text-ink-100"
                }`}
              >
                {m.text}
              </span>
            </div>
          ),
        )}

        {peerTyping && (
          <p className="text-xs text-ink-500">{t.chat.typing}</p>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 border-t border-ink-800 p-3">
        <input
          value={draft}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={disabled ? t.chat.placeholderWaiting : t.chat.placeholder}
          className="flex-1 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm outline-none placeholder:text-ink-500 focus:border-accent disabled:opacity-50"
        />
        <button
          onClick={submit}
          disabled={disabled || !draft.trim()}
          className="rounded-lg bg-accent px-4 text-sm font-semibold text-ink-950 transition enabled:hover:brightness-110 disabled:opacity-35"
        >
          {t.chat.send}
        </button>
      </div>
    </div>
  );
}
