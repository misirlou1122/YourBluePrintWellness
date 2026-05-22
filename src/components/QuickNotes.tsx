import { useMemo, useState } from "react";
import { Brain, CheckCircle2, Save } from "lucide-react";
import { noteCategories, noteSuggestionRules } from "../data/wellness";

function suggestCategory(note: string) {
  const normalized = note.toLowerCase();
  const match = noteSuggestionRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  return match?.category ?? "General Notes";
}

export function QuickNotes() {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General Notes");
  const suggestedCategory = useMemo(() => suggestCategory(note), [note]);

  const saveNote = () => {
    const trimmed = note.trim();
    if (!trimmed) {
      return;
    }

    setSavedNote(trimmed);
    setSelectedCategory(suggestCategory(trimmed));
  };

  return (
    <section className="grid gap-4">
      <div className="rounded-[1.75rem] border border-lavender/20 bg-lavender/10 p-4 shadow-lavender">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-midnight/45 text-lavender">
            <Brain size={21} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Notes / Brain Dump</h3>
            <p className="mt-1 text-sm leading-6 text-periwinkle/85">
              Type anything quickly. The current suggestion is keyword-based and local; future AI category suggestions can run through Azure OpenAI.
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
      </div>

      {savedNote && (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.065] p-4 shadow-ice">
          <div className="flex items-center gap-2 text-ice">
            <CheckCircle2 size={18} aria-hidden="true" />
            <h3 className="font-semibold text-white">Where should this go?</h3>
          </div>
          <p className="mt-3 rounded-2xl border border-white/10 bg-midnight/50 p-3 text-sm leading-6 text-periwinkle/90">{savedNote}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {noteCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`min-h-10 rounded-full border px-3 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "border-ice/70 bg-ice/15 text-ice shadow-ice"
                    : "border-white/10 bg-white/[0.05] text-periwinkle/80 hover:border-lavender/50 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-periwinkle/80">
            Selected destination: <span className="font-semibold text-white">{selectedCategory}</span>
          </p>
        </div>
      )}
    </section>
  );
}
