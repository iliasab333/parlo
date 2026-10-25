import { z } from "zod";

/* ------------------------------------------------------------------ *
 * Niche configuration
 *
 * The matcher is generic: a "profile" carries a set of tags on two
 * axes (what you offer / what you seek) plus demographics. For Parlo
 * those axes are languages you speak vs. languages you're learning,
 * but swapping the niche is a config change, not a rewrite.
 * ------------------------------------------------------------------ */

export const LANGUAGES = [
  "en", "es", "pt", "fr", "de", "it", "nl", "pl", "tr", "ru",
  "ar", "hi", "id", "ja", "ko", "zh", "vi", "th", "sv", "uk",
] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English", es: "Español", pt: "Português", fr: "Français", de: "Deutsch",
  it: "Italiano", nl: "Nederlands", pl: "Polski", tr: "Türkçe", ru: "Русский",
  ar: "العربية", hi: "हिन्दी", id: "Bahasa Indonesia", ja: "日本語", ko: "한국어",
  zh: "中文", vi: "Tiếng Việt", th: "ไทย", sv: "Svenska", uk: "Українська",
};

/**
 * A closed set, deliberately. Free-text "reactions" are just another
 * chat channel to moderate, and an emoji picker invites the ones you
 * least want on a stranger's screen.
 */
export const REACTIONS = ["wave", "laugh", "heart", "clap", "mindblown", "thumbsup"] as const;
export type Reaction = (typeof REACTIONS)[number];

export const REACTION_GLYPH: Record<Reaction, string> = {
  wave: "👋", laugh: "😂", heart: "❤️", clap: "👏", mindblown: "🤯", thumbsup: "👍",
};

export const GENDERS = ["female", "male", "nonbinary", "undisclosed"] as const;
export type Gender = (typeof GENDERS)[number];

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

/* ------------------------------------------------------------------ *
 * Profile & preferences
 * ------------------------------------------------------------------ */

const languageSchema = z.enum(LANGUAGES);

export const profileSchema = z.object({
  /** Languages the user speaks natively or fluently — what they offer. */
  speaks: z.array(languageSchema).min(1).max(5),
  /** Languages the user wants to practise — what they seek. */
  learning: z.array(languageSchema).min(1).max(5),
  level: z.enum(LEVELS),
  gender: z.enum(GENDERS),
  /** ISO 3166-1 alpha-2, resolved server-side from the connection. */
  region: z.string().length(2).optional(),
  displayName: z.string().trim().min(1).max(24).optional(),
});
export type Profile = z.infer<typeof profileSchema>;

export const prefsSchema = z.object({
  /**
   * Genders this user is willing to be matched with. A match requires
   * MUTUAL acceptance. Never auto-relaxed: see matcher.ts.
   */
  genders: z.array(z.enum(GENDERS)).min(1),
  /** Restrict to partners who speak one of these. Empty = any. */
  targetLanguages: z.array(languageSchema).max(5),
  /** Prefer partners from a different country (the "international" pull). */
  preferInternational: z.boolean(),
});
export type Prefs = z.infer<typeof prefsSchema>;

/** The slice of a profile a stranger is allowed to see. */
export interface PublicProfile {
  displayName?: string;
  speaks: Language[];
  learning: Language[];
  level: Level;
  gender: Gender;
  region?: string;
  /** True when this pairing crosses a country border. */
  international: boolean;
}

/* ------------------------------------------------------------------ *
 * Client -> server
 * ------------------------------------------------------------------ */

export const clientMessageSchema = z.discriminatedUnion("t", [
  z.object({
    t: z.literal("hello"),
    /** Opaque device token from a previous session, if any. */
    deviceToken: z.string().max(256).optional(),
    /** Proof of age assurance from the verification provider. */
    ageToken: z.string().max(4096).optional(),
  }),
  z.object({ t: z.literal("queue"), profile: profileSchema, prefs: prefsSchema }),
  z.object({ t: z.literal("dequeue") }),
  z.object({ t: z.literal("skip") }),
  z.object({
    t: z.literal("signal"),
    /** Opaque WebRTC payload (SDP or ICE candidate), relayed verbatim. */
    payload: z.unknown(),
  }),
  z.object({ t: z.literal("chat"), text: z.string().min(1).max(2000) }),
  z.object({ t: z.literal("typing"), on: z.boolean() }),
  /** Ask to keep the conversation going. Both sides must ask. */
  z.object({ t: z.literal("extend") }),
  z.object({ t: z.literal("react"), reaction: z.enum(REACTIONS) }),
  z.object({
    t: z.literal("report"),
    reason: z.enum([
      "nudity", "minor", "harassment", "spam", "violence", "other",
    ]),
    note: z.string().max(500).optional(),
  }),
  z.object({ t: z.literal("pong") }),
]);
export type ClientMessage = z.infer<typeof clientMessageSchema>;

/* ------------------------------------------------------------------ *
 * Server -> client
 * ------------------------------------------------------------------ */

export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export type ServerMessage =
  | { t: "ready"; sessionId: string; deviceToken: string; region?: string }
  | { t: "queued"; waiting: number }
  | {
      t: "matched";
      roomId: string;
      peer: PublicProfile;
      /** Perfect-negotiation role. Exactly one side is polite. */
      polite: boolean;
      iceServers: IceServer[];
      /** Epoch ms when this conversation ends unless both extend. */
      endsAt: number;
    }
  | { t: "signal"; payload: unknown }
  | {
      t: "timer";
      endsAt: number;
      /** Whether each side has asked to continue this round. */
      youWant: boolean;
      peerWants: boolean;
      round: number;
    }
  | { t: "react"; reaction: Reaction }
  | { t: "chat"; text: string; at: number }
  | { t: "typing"; on: boolean }
  | { t: "peer-left"; reason: "skip" | "disconnect" | "reported" | "timeout" }
  | { t: "stats"; online: number; waiting: number }
  | { t: "banned"; until: number; reason: string }
  | { t: "error"; code: string; message: string }
  | { t: "ping" };

export const PROTOCOL_VERSION = 1;
