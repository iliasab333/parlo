"use client";

import { REACTIONS, REACTION_GLYPH, type Reaction } from "@parlo/protocol";
import type { FloatingReaction } from "@/lib/useParlo";

/** The six buttons. A closed set keeps this a gesture, not a chat channel. */
export function ReactionBar({ onReact }: { onReact: (r: Reaction) => void }) {
  return (
    <div className="flex gap-1.5">
      {REACTIONS.map((r) => (
        <button
          key={r}
          onClick={() => onReact(r)}
          aria-label={r}
          className="grid size-9 place-items-center rounded-lg border border-ink-700 text-lg transition hover:scale-110 hover:border-accent active:scale-95"
        >
          {REACTION_GLYPH[r]}
        </button>
      ))}
    </div>
  );
}

/**
 * Glyphs drift up over the video and are dropped from state when the
 * animation ends. Mine rise on the right, theirs on the left, so you
 * can tell who reacted without a label.
 */
export function FloatingReactions({ items }: { items: FloatingReaction[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item, i) => (
        <span
          key={item.id}
          className="reaction-float absolute text-4xl"
          style={{
            [item.mine ? "right" : "left"]: `${12 + (i % 3) * 14}%`,
            bottom: "12%",
          }}
        >
          {REACTION_GLYPH[item.reaction]}
        </span>
      ))}
    </div>
  );
}
