import { useMemo, useState } from "react";
import { Brain, CheckCircle2, Save } from "lucide-react";
import { noteCategories } from "../data/wellness";
import { EntryActions } from "./EntryActions";
import { SectionCard } from "./SectionCard";
import { TextAreaField } from "./FormField";
import { useLocalCollection, useLocalStorage } from "../lib/useLocalStorage";
import { EmptyState } from "./EmptyState";

interface QuickNoteEntry {
  id: string;
  note: string;
  category: string;
  createdAt: string;
}

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

function orderedCategories(suggested: string) {
  return [suggested, ...noteCategories.filter((category) => category !== suggested)];
}

export function QuickNotes() {
  const { items, add, update, remove } = useLocalCollection<QuickNoteEntry>("ybw.quickNotes", [], "note");
  const [draft, setDraft] = useLocalStorage("ybw.quickNotesDraft", "");
  const [pendingNote, setPendingNote] = useLocalStorage("ybw.quickNotesPending", "");
  const [selectedCategory, setSelectedCategory] = useLocalStorage("ybw.quickNotesPendingCategory", "General Notes");
  const [editingId, setEditingId] = useState<string | null>(null);
  const suggestedCategory = useMemo(() => suggestCategory(draft), [draft]);
  const pendingSuggested = useMemo(() => suggestCategory(pendingNote), [pendingNote]);

  const beginRouteNote = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    setPendingNote(trimmed);
    setSelectedCategory(suggestCategory(trimmed));
    setDraft("");
  };

  const savePending = () => {
    if (!pendingNote.trim()) {
      return;
    }

    if (editingId) {
      update(editingId, { note: pendingNote, category: selectedCategory });
    } else {
      add({
        note: pendingNote,
        category: selectedCategory,
        createdAt: new Date().toLocaleString()
      });
    }

    setPendingNote("");
    setSelectedCategory("General Notes");
    setEditingId(null);
  };

  const startEdit = (entry: QuickNoteEntry) => {
    setPendingNote(entry.note);
    setSelectedCategory(entry.category);
    setEditingId(entry.id);
  };

  const grouped = noteCategories
    .map((category) => ({ category, notes: items.filter((item) => item.category === category) }))
    .filter((group) => group.notes.length > 0);

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
              Capture anything, then route it to the right wellness area.
            </p>
          </div>
        </div>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="I walked on the treadmill for 20 minutes..."
          className="mt-4 min-h-40 w-full resize-none rounded-3xl border border-white/10 bg-midnight/65 p-4 text-base leading-7 text-white outline-none placeholder:text-periwinkle/45 focus:border-ice/60 focus:ring-2 focus:ring-ice/20"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={beginRouteNote}
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
          <TextAreaField label="Note" value={pendingNote} onChange={setPendingNote} className="mt-3" />
          <div className="mt-4 flex flex-wrap gap-2">
            {orderedCategories(editingId ? selectedCategory : pendingSuggested).map((category) => (
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
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={savePending}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
            >
              Save to {selectedCategory}
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingNote("");
                setEditingId(null);
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
            >
              Cancel
            </button>
          </div>
        </SectionCard>
      ) : null}

      {grouped.length ? (
        grouped.map((group) => (
          <SectionCard key={group.category} title={group.category}>
            <div className="grid gap-3">
              {group.notes.map((entry) => (
                <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm leading-6 text-white">{entry.note}</p>
                      <p className="mt-2 text-xs text-periwinkle/65">{entry.createdAt}</p>
                    </div>
                    <EntryActions onEdit={() => startEdit(entry)} onDelete={() => remove(entry.id)} />
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        ))
      ) : (
        <EmptyState title="No quick notes yet" message="Add your first note and choose where it belongs." />
      )}
    </section>
  );
}
