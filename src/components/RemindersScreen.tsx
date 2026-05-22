import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { reminderCategories, reminderRecurrences, sampleReminders, type ReminderSample } from "../data/sampleData";
import { FormField, SelectField, TextAreaField } from "./FormField";
import { ReminderCard } from "./ReminderCard";
import { SectionCard } from "./SectionCard";

const REMINDER_STORAGE_KEY = "ybw.reminders";

function readStoredReminders() {
  if (typeof window === "undefined") {
    return sampleReminders;
  }

  try {
    const stored = window.localStorage.getItem(REMINDER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ReminderSample[]) : sampleReminders;
  } catch {
    return sampleReminders;
  }
}

export function RemindersScreen() {
  const [reminders, setReminders] = useState<ReminderSample[]>(readStoredReminders);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [recurrence, setRecurrence] = useState(reminderRecurrences[0]);
  const [category, setCategory] = useState(reminderCategories[0]);
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!title.trim()) {
      return;
    }

    const nextReminder: ReminderSample = {
      id: `rem-${Date.now()}`,
      title: title.trim(),
      date: date || "Any date",
      time: time || "Any time",
      recurrence,
      category,
      notes,
      completed
    };

    setReminders((current) => [nextReminder, ...current]);
    setTitle("");
    setDate("");
    setTime("");
    setNotes("");
    setCompleted(false);
  };

  const toggleCompleted = (id: string) => {
    setReminders((current) =>
      current.map((reminder) => (reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder))
    );
  };

  return (
    <div className="grid gap-4">
      <SectionCard eyebrow="Add reminder" title="Local reminder form" description="Reminders are stored in this browser for now.">
        <div className="grid gap-3">
          <FormField label="Title" value={title} onChange={setTitle} placeholder="Drink water..." />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Date" type="date" value={date} onChange={setDate} />
            <FormField label="Time" type="time" value={time} onChange={setTime} />
          </div>
          <SelectField label="Recurrence" options={reminderRecurrences} value={recurrence} onChange={setRecurrence} />
          <SelectField label="Category" options={reminderCategories} value={category} onChange={setCategory} />
          <TextAreaField label="Notes" value={notes} onChange={setNotes} placeholder="Add gentle context..." />
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white">
            <input
              type="checkbox"
              checked={completed}
              onChange={(event) => setCompleted(event.target.checked)}
              className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
            />
            Completed
          </label>
        </div>
        <button
          type="button"
          onClick={addReminder}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Add reminder
        </button>
      </SectionCard>

      <SectionCard title="Reminder list" description="Sample and locally added reminders.">
        <div className="grid gap-3">
          {reminders.map((reminder) => (
            <button key={reminder.id} type="button" onClick={() => toggleCompleted(reminder.id)} className="text-left">
              <ReminderCard {...reminder} />
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
