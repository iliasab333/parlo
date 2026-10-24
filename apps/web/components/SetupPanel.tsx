"use client";

import { useState } from "react";
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

const GENDER_LABEL: Record<Gender, string> = {
  female: "Mujer",
  male: "Hombre",
  nonbinary: "No binario",
  undisclosed: "Prefiero no decirlo",
};

const LEVEL_LABEL: Record<Level, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-ink-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

export function SetupPanel({
  disabled,
  onStart,
}: {
  disabled: boolean;
  onStart: (profile: Profile, prefs: Prefs) => void;
}) {
  const [speaks, setSpeaks] = useState<Language[]>(["es"]);
  const [learning, setLearning] = useState<Language[]>(["en"]);
  const [level, setLevel] = useState<Level>("intermediate");
  const [gender, setGender] = useState<Gender>("undisclosed");
  const [displayName, setDisplayName] = useState("");

  const [genders, setGenders] = useState<Gender[]>([...GENDERS]);
  const [preferInternational, setPreferInternational] = useState(true);

  const valid = speaks.length > 0 && learning.length > 0 && genders.length > 0;

  function submit() {
    if (!valid) return;
    onStart(
      {
        speaks,
        learning,
        level,
        gender,
        displayName: displayName.trim() || undefined,
      },
      {
        genders,
        // The target-language filter is derived from what you're learning:
        // one fewer control, same result.
        targetLanguages: learning,
        preferInternational,
      },
    );
  }

  return (
    <div className="space-y-7">
      <Field label="Hablo con fluidez" hint="lo que puedes ofrecer">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Chip key={l} active={speaks.includes(l)} onClick={() => setSpeaks(toggle(speaks, l))}>
              {LANGUAGE_NAMES[l]}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Quiero practicar" hint="lo que buscas">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Chip key={l} active={learning.includes(l)} onClick={() => setLearning(toggle(learning, l))}>
              {LANGUAGE_NAMES[l]}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Mi nivel">
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {LEVEL_LABEL[l]}
            </Chip>
          ))}
        </div>
      </Field>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Mi género">
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
                {GENDER_LABEL[g]}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Nombre" hint="opcional">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value.slice(0, 24))}
            placeholder="Cómo quieres que te llamen"
            className="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm outline-none placeholder:text-ink-500 focus:border-accent"
          />
        </Field>
      </div>

      <Field label="Quiero hablar con" hint="se respeta en ambos sentidos">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <Chip key={g} active={genders.includes(g)} onClick={() => setGenders(toggle(genders, g))}>
              {GENDER_LABEL[g]}
            </Chip>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          Nunca ampliamos este filtro por ti, aunque la espera se alargue. Cuanto
          más lo restrinjas, más tardarás en encontrar a alguien.
        </p>
      </Field>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={preferInternational}
          onChange={(e) => setPreferInternational(e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--color-accent)]"
        />
        <span className="text-sm text-ink-300">
          Priorizar personas de otro país
          <span className="block text-xs text-ink-500">
            Es el punto del ejercicio: acentos y contexto reales.
          </span>
        </span>
      </label>

      <button
        onClick={submit}
        disabled={disabled || !valid}
        className="w-full rounded-xl bg-accent py-3.5 font-semibold text-ink-950 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
      >
        Buscar compañero
      </button>
      <p className="-mt-4 text-center text-xs text-ink-500">
        Al continuar se activarán tu cámara y micrófono.
      </p>
    </div>
  );
}
