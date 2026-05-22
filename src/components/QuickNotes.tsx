import { useEffect, useMemo, useState } from "react";
import { Brain, CheckCircle2, Save } from "lucide-react";
import { noteCategories } from "../data/wellness";
import { sampleQuickNotes, type QuickNoteSample } from "../data/sampleData";
import { SectionCard } from "./SectionCard";

const NOTE_STORAGE_KEY = "ybw.quickNotes";

const suggestionRules = [
  { category: "Alcohol Tracker", keywords: ["margarita", "wine", "beer", "cocktail", "alcohol"] },
  { category: "Bloodwork / Labs", keywords: ["a1c", "cholesterol", "glucose", "ldl", "hdl", "triglycerides", "labs"] },
  { category: "Fitness", keywords: ["treadmill", "workout", "sets", "reps", "walk", "gym"] },
  { category: "Mood / Mental Health", keywords: ["anxious", "overwhelmed", "sad", "mood", "tired"] },
  { category: "Skin & Beauty", keywords: ["niacinamide", "retinol", "cleanser", "moisturizer", "sunscreen"] },
  { category: "Hair Care", keywords: ["shampoo", "conditioner", "curls", "scalp"] },
  { category: "Recipes", keywords: ["recipe", "chicken", "protein", "fiber", "meal"] },
  { category: "Doctor Appointments", keywords: ["doctor", "appointment", "ask", "discuss"] }
];

function suggestCategory(note: string) {
  const normalized = note.toLowerCase();
  const match = suggestionRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  return match?.category ?? "General Notes";
}

function readStoredNotes() {
  if (typeof window === "undefined") {
    return sampleQuickNotes;
  }

  try {
    const stored = window.localStorage.getItem(NOTE_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as QuickNoteSample[]) : sampleQuickNotes;
  } catch {
    return sampleQuickNotes;
  }
}

function orderedCategories(suggested: string) {
  return [suggested, ...noteCategories.filter((category) => category !== suggested)];
}

export function QuickNotes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<QuickNoteSample[]>(readStoredNotes);
  const [pendingId, setPendingId] = useState(notes[0]?.id ?? "");
  const suggestedCategory = useMemo(() => suggestCategory(note), [note]);
  const pendingNote = notes.find((saved) => saved.id === pendingId);

  useEffect(() => {
    window.localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    const trimmed = note.trim();
    if (!trimmed) {
      return;
    }

    const saved: QuickNoteSample = {
      id: `note-${Date.now()}`,
      note: trimmed,
      category: suggestCategory(trimmed),
      createdAt: new Date().toLocaleString()
    };

    setNotes((current) => [saved, ...current]);
    setPendingId(saved.id);
    setNote("");
  };

  const chooseCategory = (category: string) => {
    if (!pendingId) {
      return;
    }

    setNotes((current) => current.map((saved) => (saved.id === pendingId ? { ...saved, category } : saved)));
  };

  return (
    <section className="grid gap-4">
      <SectionCard className="border-lavender/20 bg-lavender/10 shadow-lavender">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-midnight/45 text-lavender">
            <Brain size={21} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Notes / Brain Dump</h3>
            <p className="mt-1 text-sm leading-6 text-periwinkle/85">
              Type anything quickly. Suggestions are keyword-based and local only.
            </p>
          </div>
        </div>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="I had a margarita at dinner tonight..."
          className="mt-4 min-h-40 w-full resize-none rounded-3xl border border-white/10 bg-midnight/65 p-4 text-base leading-7 text-white outline-none placeholder:text-periwinkle/45 focus:border-ice/60 focus:ring-2 focus:ring-ice/20"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={saveNote}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            <Save size={18} aria-hidden="true" />
            Save note
          </button>
          <div className="rounded-2xl border border-ice/20 bg-ice/10 px-4 py-3 text-sm text-ice">
            Suggested: <span className="font-semibold">{suggestedCategory}</span>
          </div>
        </div>
      </SectionCard>

      {pendingNote ? (
        <SectionCard>
          <div className="flex items-center gap-2 text-ice">
            <CheckCircle2 size={18} aria-hidden="true" />
            <h3 className="font-semibold text-white">Where should this go?</h3>
          </div>
          <p className="mt-3 rounded-2xl border border-white/10 bg-midnight/50 p-3 text-sm leading-6 text-periwinkle/90">
            {pendingNote.note}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {orderedCategories(pendingNote.category).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => chooseCategory(category)}
                className={`min-h-10 rounded-full border px-3 text-xs font-semibold transition ${
                  pendingNote.category === category
                    ? "border-ice/70 bg-ice/15 text-ice shadow-ice"
                    : "border-white/10 bg-white/[0.05] text-periwinkle/80 hover:border-lavender/50 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-periwinkle/80">
            Selected destination: <span className="font-semibold text-white">{pendingNote.category}</span>
          </p>
        </SectionCard>
      ) : null}

      <SectionCard title="Saved notes" description="Local browser notes for this first version.">
        <div className="grid gap-3">
          {notes.map((saved) => (
            <button
              key={saved.id}
              type="button"
              onClick={() => setPendingId(saved.id)}
              className="rounded-2xl border border-white/10 bg-midnight/45 p-4 text-left transition hover:border-lavender/45"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-6 text-white">{saved.note}</p>
                <span className="shrink-0 rounded-full border border-ice/20 bg-ice/10 px-2.5 py-1 text-[0.68rem] font-semibold text-ice">
                  {saved.category}
                </span>
              </div>
              <p className="mt-2 text-xs text-periwinkle/65">{saved.createdAt}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </section>
  );
}
