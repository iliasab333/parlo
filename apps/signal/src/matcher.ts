import type { Gender, Language, Prefs, Profile } from "@parlo/protocol";
import { config } from "./config.js";

export interface Waiter {
  sessionId: string;
  deviceId: string;
  profile: Profile;
  prefs: Prefs;
  since: number;
}

export interface Pairing {
  a: Waiter;
  b: Waiter;
  score: number;
}

/** Pairs matched recently, keyed by the unordered device pair. */
const recentPairs = new Map<string, number>();

const pairKey = (x: string, y: string) => (x < y ? `${x}|${y}` : `${y}|${x}`);

export function rememberPair(a: string, b: string) {
  recentPairs.set(pairKey(a, b), Date.now());
}

function matchedRecently(a: string, b: string): boolean {
  const at = recentPairs.get(pairKey(a, b));
  if (at === undefined) return false;
  if (Date.now() - at > config.rematchCooldownMs) {
    recentPairs.delete(pairKey(a, b));
    return false;
  }
  return true;
}

/** Periodic sweep so the cooldown map doesn't grow without bound. */
export function pruneRecentPairs() {
  const now = Date.now();
  for (const [key, at] of recentPairs) {
    if (now - at > config.rematchCooldownMs) recentPairs.delete(key);
  }
}

const overlaps = (a: readonly Language[], b: readonly Language[]) =>
  a.some((x) => b.includes(x));

/** Gender acceptance must hold in BOTH directions, always. */
function genderOk(viewer: Waiter, other: Waiter): boolean {
  return viewer.prefs.genders.includes(other.profile.gender as Gender);
}

/**
 * Hard gates. Language and region constraints soften once a user has
 * waited past the relax threshold; gender never does.
 */
function compatible(a: Waiter, b: Waiter, now: number): boolean {
  if (a.sessionId === b.sessionId) return false;
  if (!genderOk(a, b) || !genderOk(b, a)) return false;
  if (matchedRecently(a.deviceId, b.deviceId)) return false;

  const relaxed =
    now - a.since > config.relaxAfterMs || now - b.since > config.relaxAfterMs;
  if (relaxed) return true;

  // Explicit target-language filters are honoured while the queue is fresh.
  if (a.prefs.targetLanguages.length && !overlaps(a.prefs.targetLanguages, b.profile.speaks)) {
    return false;
  }
  if (b.prefs.targetLanguages.length && !overlaps(b.prefs.targetLanguages, a.profile.speaks)) {
    return false;
  }
  return true;
}

/**
 * Higher is better. The dominant term is language complementarity:
 * a true exchange is A learning what B speaks *and* vice versa, which
 * is what makes the session valuable to both sides rather than one.
 */
function score(a: Waiter, b: Waiter, now: number): number {
  let s = 0;

  const aGets = overlaps(a.profile.learning, b.profile.speaks);
  const bGets = overlaps(b.profile.learning, a.profile.speaks);
  if (aGets && bGets) s += 100;      // mutual exchange
  else if (aGets || bGets) s += 35;  // one-sided, still useful
  else s += 5;                       // common ground only

  // Matched levels make for a less frustrating conversation.
  if (a.profile.level === b.profile.level) s += 12;

  // The international pull: reward crossing a border when asked for.
  const crossBorder =
    a.profile.region && b.profile.region && a.profile.region !== b.profile.region;
  if (crossBorder && (a.prefs.preferInternational || b.prefs.preferInternational)) s += 25;
  else if (!crossBorder && a.prefs.preferInternational && b.prefs.preferInternational) s -= 15;

  // Nudge the longest-waiting pairs out of the queue first.
  const waited = (now - a.since) + (now - b.since);
  s += Math.min(waited / 1000, 60);

  return s;
}

/**
 * Greedy pass over the queue, longest wait first. Greedy is not
 * globally optimal (a maximum-weight matching would be), but it is
 * O(n^2) per tick with tiny constants and the queue churns far too
 * fast for optimality to be worth the latency.
 */
export function findPairings(waiters: Waiter[]): Pairing[] {
  const now = Date.now();
  const pool = [...waiters].sort((x, y) => x.since - y.since);
  const taken = new Set<string>();
  const pairings: Pairing[] = [];

  for (const a of pool) {
    if (taken.has(a.sessionId)) continue;

    let best: Waiter | null = null;
    let bestScore = -Infinity;

    for (const b of pool) {
      if (taken.has(b.sessionId) || b.sessionId === a.sessionId) continue;
      if (!compatible(a, b, now)) continue;
      const s = score(a, b, now);
      if (s > bestScore) {
        bestScore = s;
        best = b;
      }
    }

    if (best) {
      taken.add(a.sessionId);
      taken.add(best.sessionId);
      rememberPair(a.deviceId, best.deviceId);
      pairings.push({ a, b: best, score: bestScore });
    }
  }

  return pairings;
}
