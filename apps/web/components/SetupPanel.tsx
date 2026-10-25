"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import {
  GENDERS,
  LANGUAGES,
  LANGUAGE_NAMES,
  LEVELS,
  type Gender,
  type Language,
  type Level,
  type Prefs,
  type Profile,
} from "@parlo/protocol";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
        active
          ? "border-accent bg-accent/15 text-accent"
          : "border-ink-700 text-ink-300 hover:border-ink-500"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Languages used to be forty chips, twice over — the same list
 * repeated for "speak" and "learn", which filled a phone screen before
 * you reached anything else. A native <select> opens the OS picker on
 * mobile, is searchable by typing on desktop, and costs one row.
 * Picked languages sit beside it as removable chips, so adding a
 * second or third is possible without the list ever being on screen.
 */
function LanguagePicker({
  t,
  label,
  hint,
  selected,
  onChange,
}: {
  t: Dictionary;
  label: string;
  hint: string;
  selected: Language[];
  onChange: (next: Language[]) => void;
}) {
  const available = LANGUAGES.filter((l) => !selected.includes(l));

  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-ink-500">{hint}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {selected.map((l) => (
          <span
            key={l}
            className="flex items-center gap-1.5 rounded-lg border border-accent bg-accent/15 py-1.5 pl-3 pr-2 text-sm text-accent"
          >
            {LANGUAGE_NAMES[l]}
            {/* The last one is not removable: a profile needs at least one. */}
            {selected.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(selected.filter((x) => x !== l))}
                aria-label={`${t.setup.remove} ${LANGUAGE_NAMES[l]}`}
                className="grid size-4 place-items-center rounded text-accent/70 transition hover:bg-accent/20 hover:text-accent"
              >
                ×
              </button>
            )}
          </span>
        ))}

        {available.length > 0 && (
          <select
            value=""
            onChange={(e) => {
              const value = e.target.value as Language;
              if (value) onChange([...selected, value]);
            }}
            aria-label={label}
            className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm text-ink-300 outline-none transition hover:border-ink-500 focus:border-accent"
          >
            <option value="">{selected.length ? t.setup.addAnother : t.setup.chooseLanguage}</option>
            {available.map((l) => (
              <option key={l} value={l} className="bg-ink-900 text-ink-100">
                {LANGUAGE_NAMES[l]}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

export function SetupPanel({
  t,
  locale,
  disabled,
  onStart,
}: {
  t: Dictionary;
  locale: Locale;
  disabled: boolean;
  onStart: (profile: Profile, prefs: Prefs) => void;
}) {
  // Default to the language the interface is already in. Someone who
  // opened the site in French almost certainly speaks French; assuming
  // Spanish made them undo a choice before making one.
  const [speaks, setSpeaks] = useState<Language[]>([locale as Language]);
  const [learning, setLearning] = useState<Language[]>([locale === "en" ? "es" : "en"]);
  const [level, setLevel] = useState<Level>("intermediate");
  const [gender, setGender] = useState<Gender>("undisclosed");
  const [displayName, setDisplayName] = useState("");
  const [genders, setGenders] = useState<Gender[]>([...GENDERS]);
  const [preferInternational, setPreferInternational] = useState(true);

  const valid = speaks.length > 0 && learning.length > 0 && genders.length > 0;

  // The collapsed section still has to say what it is hiding, or people
  // never open it and never learn the filters exist.
  const filterSummary = [
    genders.length === GENDERS.length
      ? t.setup.anyGender
      : genders.map((g) => t.setup.genders[g].toLowerCase()).join(", "),
    preferInternational ? t.setup.internationalShort : t.setup.anyCountry,
    displayName.trim() || t.setup.noName,
  ].join(" · ");

  function submit() {
    if (!valid) return;
    onStart(
      { speaks, learning, level, gender, displayName: displayName.trim() || undefined },
      { genders, targetLanguages: learning, preferInternational },
    );
  }

  return (
    <div className="space-y-6">
      <LanguagePicker
        t={t}
        label={t.setup.speak}
        hint={t.setup.speakHint}
        selected={speaks}
        onChange={setSpeaks}
      />

      <LanguagePicker
        t={t}
        label={t.setup.learn}
        hint={t.setup.learnHint}
        selected={learning}
        onChange={setLearning}
      />

      <div>
        <div className="mb-2 text-sm font-medium">{t.setup.level}</div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {t.setup.levels[l]}
            </Chip>
          ))}
        </div>
      </div>

      <details className="group rounded-xl border border-ink-800">
        {/* min-w-0 on the middle cell is what lets the summary truncate
            instead of forcing the label to wrap on a narrow screen. */}
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 marker:content-none">
          <span className="shrink-0 whitespace-nowrap text-sm font-medium">
            {t.setup.filters}
          </span>
          <span className="min-w-0 flex-1 truncate text-right text-xs text-ink-500">
            {filterSummary}
          </span>
          <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0 text-ink-500 transition group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>

        <div className="space-y-6 border-t border-ink-800 px-4 py-5">
          <div>
            <div className="mb-2 text-sm font-medium">{t.setup.wantToTalkWith}</div>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <Chip
                  key={g}
                  active={genders.includes(g)}
                  onClick={() => setGenders(toggle(genders, g))}
                >
{t.setup.genders[g]}
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-500">
{t.setup.genderNote}
            </p>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">{t.setup.myGender}</div>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
{t.setup.genders[g]}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-sm font-medium">{t.setup.name}</span>
              <span className="text-xs text-ink-500">{t.setup.optional}</span>
            </div>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value.slice(0, 24))}
              placeholder={t.setup.namePlaceholder}
              className="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm outline-none placeholder:text-ink-500 focus:border-accent"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={preferInternational}
              onChange={(e) => setPreferInternational(e.target.checked)}
              className="mt-0.5 size-4 accent-[var(--color-accent)]"
            />
            <span className="text-sm text-ink-300">
              {t.setup.international}
              <span className="block text-xs text-ink-500">{t.setup.internationalNote}</span>
            </span>
          </label>
        </div>
      </details>

      <div>
        <button
          onClick={submit}
          disabled={disabled || !valid}
          className="w-full rounded-xl bg-accent py-3.5 font-semibold text-ink-950 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {t.setup.search}
        </button>
        <p className="mt-2 text-center text-xs text-ink-500">
{t.setup.cameraNote}
        </p>
      </div>
    </div>
  );
}
