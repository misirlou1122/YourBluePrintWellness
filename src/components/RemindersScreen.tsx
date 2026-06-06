import { useState } from "react";
import { Plus } from "lucide-react";
import { EntryActions } from "./EntryActions";
import { EmptyState } from "./EmptyState";
import { FormField, SelectField, TextAreaField } from "./FormField";
import { CollapsibleSectionCard } from "./CollapsibleSectionCard";
import { ReminderCard } from "./ReminderCard";
import { SectionCard } from "./SectionCard";
import { useLocalCollection, useLocalStorage } from "../lib/useLocalStorage";

const reminderCategories = [
  "Doctor appointment",
  "Schedule bloodwork",
  "Take medication",
  "Refill prescription",
  "Drink water",
  "Log weight",
  "Upload lab results",
  "Skincare routine",
  "Haircare routine",
  "Period check-in",
  "Take progress photo",
  "Follow up with doctor",
  "Custom"
];

const reminderRecurrences = ["one-time", "daily", "weekly", "monthly", "every 3 months", "custom"];

interface ReminderEntry {
  id: string;
  title: string;
  date: string;
  time: string;
  recurrence: string;
  category: string;
  notes: string;
  completed: boolean;
}

const emptyDraft: Omit<ReminderEntry, "id"> = {
  title: "",
  date: "",
  time: "",
  recurrence: reminderRecurrences[0],
  category: reminderCategories[0],
  notes: "",
  completed: false
};

export function RemindersScreen() {
  const { items, add, update, remove, toggleComplete } = useLocalCollection<ReminderEntry>("ybw.reminders", [], "reminder");
  const [draft, setDraft] = useLocalStorage("ybw.reminderDraft", emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  const setField = (field: keyof typeof emptyDraft, value: string | boolean) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const resetDraft = () => {
    setDraft(emptyDraft);
    setEditingId(null);
  };

  const saveReminder = () => {
    if (!draft.title.trim()) {
      return;
    }

    const entry = {
      ...draft,
      title: draft.title.trim(),
      date: draft.date || "Any date",
      time: draft.time || "Any time"
    };

    if (editingId) {
      update(editingId, entry);
    } else {
      add(entry);
    }

    resetDraft();
  };

  const startEdit = (entry: ReminderEntry) => {
    const { id: _id, ...rest } = entry;
    setDraft(rest);
    setEditingId(entry.id);
  };

  const toggleReminder = (reminder: ReminderEntry) => {
    toggleComplete(reminder.id);
  };

  const upcoming = items.filter((item) => !item.completed);
  const completed = items.filter((item) => item.completed);

  return (
    <div className="grid gap-4">
      <CollapsibleSectionCard storageKey="ybw.reminders.formOpen" forceOpen={Boolean(editingId)} eyebrow={editingId ? "Edit reminder" : "Add reminder"} title={editingId ? "Update reminder" : "Reminder form"} description="Reminders save locally in this browser." sectionLabel="Custom reminder">
        <div className="grid gap-3">
          <FormField label="Title" value={draft.title} onChange={(value) => setField("title", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Date" type="date" value={draft.date} onChange={(value) => setField("date", value)} />
            <FormField label="Time" type="time" value={draft.time} onChange={(value) => setField("time", value)} />
          </div>
          <SelectField label="Recurrence" options={reminderRecurrences} value={draft.recurrence} onChange={(value) => setField("recurrence", value)} />
          <SelectField label="Category" options={reminderCategories} value={draft.category} onChange={(value) => setField("category", value)} />
          <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white">
            <input
              type="checkbox"
              checked={draft.completed}
              onChange={(event) => setField("completed", event.target.checked)}
              className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
            />
            Completed
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={saveReminder}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
          >
            <Plus size={18} aria-hidden="true" />
            {editingId ? "Save changes" : "Add reminder"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </CollapsibleSectionCard>

      <SectionCard title="Upcoming reminders" description={upcoming.length ? undefined : "No reminders yet. Add your first reminder."}>
        {upcoming.length ? (
          <div className="grid gap-3">
            {upcoming.map((reminder) => (
              <div key={reminder.id} className="grid gap-2">
                <button type="button" onClick={() => toggleReminder(reminder)} className="text-left">
                  <ReminderCard {...reminder} />
                </button>
                <EntryActions onEdit={() => startEdit(reminder)} onDelete={() => remove(reminder.id)} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No reminders yet" message="Add your first reminder." />
        )}
      </SectionCard>

      {completed.length ? (
        <SectionCard title="Completed reminders">
          <div className="grid gap-3">
            {completed.map((reminder) => (
              <div key={reminder.id} className="grid gap-2">
                <button type="button" onClick={() => toggleReminder(reminder)} className="text-left">
                  <ReminderCard {...reminder} />
                </button>
                <EntryActions onEdit={() => startEdit(reminder)} onDelete={() => remove(reminder.id)} />
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
