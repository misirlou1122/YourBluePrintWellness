import { useState } from "react";
import { CalendarDays, Plus, Printer } from "lucide-react";
import { EntryActions } from "./EntryActions";
import { EmptyState } from "./EmptyState";
import { FormField, TextAreaField } from "./FormField";
import { CollapsibleSectionCard } from "./CollapsibleSectionCard";
import { SectionCard } from "./SectionCard";
import { printFocusedReport } from "../lib/printReports";
import { useLocalCollection, useLocalStorage, createId } from "../lib/useLocalStorage";

interface AppointmentItem {
  id: string;
  text: string;
  completed?: boolean;
}

interface DoctorAppointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  phone: string;
  reason: string;
  notes: string;
  afterNotes: string;
  thingsToDiscuss: AppointmentItem[];
  questions: AppointmentItem[];
  followUpTasks: AppointmentItem[];
}

const emptyDraft: Omit<DoctorAppointment, "id" | "thingsToDiscuss" | "questions" | "followUpTasks"> = {
  doctor: "",
  specialty: "",
  date: "",
  time: "",
  location: "",
  phone: "",
  reason: "",
  notes: "",
  afterNotes: ""
};

function sortAppointments(a: DoctorAppointment, b: DoctorAppointment) {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}

function ItemList({
  title,
  items,
  emptyText,
  onAdd,
  onUpdate,
  onDelete,
  onToggle,
  checklist = false
}: {
  title: string;
  items: AppointmentItem[];
  emptyText: string;
  onAdd: (text: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onToggle?: (id: string) => void;
  checklist?: boolean;
}) {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const submit = () => {
    if (!text.trim()) {
      return;
    }

    onAdd(text.trim());
    setText("");
  };

  return (
    <SectionCard title={title} description={items.length ? undefined : emptyText}>
      <div className="grid gap-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
            {editingId === item.id ? (
              <div className="grid gap-3">
                <FormField label="Edit item" value={editingText} onChange={setEditingText} />
                <EntryActions
                  isEditing
                  onSave={() => {
                    onUpdate(item.id, editingText);
                    setEditingId(null);
                    setEditingText("");
                  }}
                  onCancel={() => {
                    setEditingId(null);
                    setEditingText("");
                  }}
                />
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <label className="flex min-h-10 flex-1 items-center gap-3 text-sm text-white">
                  {checklist ? (
                    <input
                      type="checkbox"
                      checked={Boolean(item.completed)}
                      onChange={() => onToggle?.(item.id)}
                      className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
                    />
                  ) : null}
                  <span className={item.completed ? "text-periwinkle/60 line-through" : ""}>{item.text}</span>
                </label>
                <EntryActions
                  onEdit={() => {
                    setEditingId(item.id);
                    setEditingText(item.text);
                  }}
                  onDelete={() => onDelete(item.id)}
                />
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="mt-3 grid gap-3">
        <FormField label={`Add ${title.toLowerCase()}`} value={text} onChange={setText} />
        <button
          type="button"
          onClick={submit}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
        >
          <Plus size={18} aria-hidden="true" />
          Add item
        </button>
      </div>
    </SectionCard>
  );
}

export function AppointmentsScreen() {
  const { items, add, update, remove } = useLocalCollection<DoctorAppointment>("ybw.appointments", [], "appointment");
  const [draft, setDraft] = useLocalStorage("ybw.appointmentsDraft", emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useLocalStorage("ybw.appointments.selectedId", "");

  const selected = items.find((appointment) => appointment.id === selectedId) ?? items[0];
  const upcoming = [...items].filter((appointment) => !appointment.date || appointment.date >= new Date().toISOString().slice(0, 10)).sort(sortAppointments);
  const past = [...items].filter((appointment) => appointment.date && appointment.date < new Date().toISOString().slice(0, 10)).sort(sortAppointments);

  const setField = (field: keyof typeof emptyDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const resetDraft = () => {
    setDraft(emptyDraft);
    setEditingId(null);
  };

  const saveAppointment = () => {
    if (!draft.doctor.trim()) {
      return;
    }

    const next = {
      ...draft,
      doctor: draft.doctor.trim(),
      thingsToDiscuss: editingId ? selected?.thingsToDiscuss ?? [] : [],
      questions: editingId ? selected?.questions ?? [] : [],
      followUpTasks: editingId ? selected?.followUpTasks ?? [] : []
    };

    if (editingId) {
      update(editingId, next);
      setSelectedId(editingId);
    } else {
      const id = createId("appointment");
      add({ ...next, id });
      setSelectedId(id);
    }

    resetDraft();
  };

  const startEdit = (appointment: DoctorAppointment) => {
    const { id: _id, thingsToDiscuss: _things, questions: _questions, followUpTasks: _tasks, ...rest } = appointment;
    setDraft(rest);
    setEditingId(appointment.id);
    setSelectedId(appointment.id);
  };

  const updateItems = (field: "thingsToDiscuss" | "questions" | "followUpTasks", updater: (items: AppointmentItem[]) => AppointmentItem[]) => {
    if (!selected) {
      return;
    }

    update(selected.id, { [field]: updater(selected[field]) } as Partial<DoctorAppointment>);
  };

  const addListItem = (field: "thingsToDiscuss" | "questions" | "followUpTasks", text: string) => {
    updateItems(field, (current) => [{ id: createId("item"), text, completed: false }, ...current]);
  };

  const updateListItem = (field: "thingsToDiscuss" | "questions" | "followUpTasks", id: string, text: string) => {
    updateItems(field, (current) => current.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  const deleteListItem = (field: "thingsToDiscuss" | "questions" | "followUpTasks", id: string) => {
    updateItems(field, (current) => current.filter((item) => item.id !== id));
  };

  const toggleListItem = (field: "thingsToDiscuss" | "followUpTasks", id: string) => {
    updateItems(field, (current) => current.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  return (
    <div className="grid gap-4">
      <CollapsibleSectionCard
        storageKey="ybw.appointments.formOpen"
        forceOpen={Boolean(editingId)}
        eyebrow={editingId ? "Edit appointment" : "Add appointment"}
        title={editingId ? "Update appointment" : "New doctor appointment"}
        description="Appointments save locally in this browser."
        sectionLabel="Upcoming appointments"
      >
        <div className="grid gap-3">
          <FormField label="Doctor name" value={draft.doctor} onChange={(value) => setField("doctor", value)} />
          <FormField label="Specialty" value={draft.specialty} onChange={(value) => setField("specialty", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Date" type="date" value={draft.date} onChange={(value) => setField("date", value)} />
            <FormField label="Time" type="time" value={draft.time} onChange={(value) => setField("time", value)} />
          </div>
          <FormField label="Location" value={draft.location} onChange={(value) => setField("location", value)} />
          <FormField label="Phone" value={draft.phone} onChange={(value) => setField("phone", value)} />
          <TextAreaField label="Reason for visit" value={draft.reason} onChange={(value) => setField("reason", value)} />
          <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
          <TextAreaField label="After appointment notes" value={draft.afterNotes} onChange={(value) => setField("afterNotes", value)} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={saveAppointment}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
          >
            <Plus size={18} aria-hidden="true" />
            {editingId ? "Save changes" : "Add appointment"}
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

      {items.length ? (
        <SectionCard title="Appointments" description="Select a visit to manage questions, discussion items, and follow-up tasks.">
          <div className="grid gap-3">
            {[...upcoming, ...past].map((appointment) => (
              <article key={appointment.id} className={`rounded-2xl border p-4 ${selected?.id === appointment.id ? "border-ice/45 bg-ice/10" : "border-white/10 bg-midnight/45"}`}>
                <div className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => setSelectedId(appointment.id)} className="flex min-h-12 flex-1 items-start gap-3 text-left">
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-lavender/20 bg-lavender/10 text-lavender">
                      <CalendarDays size={20} aria-hidden="true" />
                    </div>
                    <span>
                      <span className="block text-sm font-semibold text-white">{appointment.doctor}</span>
                      <span className="mt-1 block text-xs text-periwinkle/75">
                        {appointment.specialty || "General visit"} | {appointment.date || "Date to add"} {appointment.time || ""}
                      </span>
                      {appointment.reason ? <span className="mt-2 block text-sm leading-6 text-periwinkle/85">{appointment.reason}</span> : null}
                    </span>
                  </button>
                  <EntryActions onEdit={() => startEdit(appointment)} onDelete={() => remove(appointment.id)} />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : (
        <EmptyState title="No appointments yet" message="Add your first doctor appointment to prepare questions and notes." />
      )}

      {selected ? (
        <>
          <SectionCard title={`${selected.doctor}`} description={`${selected.specialty || "General visit"} | ${selected.location || "Location to add"}`}>
            <div className="grid gap-3 text-sm text-periwinkle/85">
              <p>Date/time: {selected.date || "Date to add"} {selected.time ? `at ${selected.time}` : ""}</p>
              <p>Phone: {selected.phone || "Phone to add"}</p>
              {selected.reason ? <p>Reason: {selected.reason}</p> : null}
              <TextAreaField label="Appointment notes" value={selected.notes} onChange={(value) => update(selected.id, { notes: value })} />
              <TextAreaField label="After appointment notes" value={selected.afterNotes} onChange={(value) => update(selected.id, { afterNotes: value })} />
            </div>
          </SectionCard>

          <ItemList
            title="Things to discuss"
            items={selected.thingsToDiscuss}
            emptyText="No discussion items yet. Add one before your appointment."
            checklist
            onAdd={(text) => addListItem("thingsToDiscuss", text)}
            onUpdate={(id, text) => updateListItem("thingsToDiscuss", id, text)}
            onDelete={(id) => deleteListItem("thingsToDiscuss", id)}
            onToggle={(id) => toggleListItem("thingsToDiscuss", id)}
          />

          <ItemList
            title="Questions for doctor"
            items={selected.questions}
            emptyText="No doctor questions yet. Add one before your appointment."
            onAdd={(text) => addListItem("questions", text)}
            onUpdate={(id, text) => updateListItem("questions", id, text)}
            onDelete={(id) => deleteListItem("questions", id)}
          />

          <ItemList
            title="Follow-up tasks"
            items={selected.followUpTasks}
            emptyText="No follow-up tasks yet."
            checklist
            onAdd={(text) => addListItem("followUpTasks", text)}
            onUpdate={(id, text) => updateListItem("followUpTasks", id, text)}
            onDelete={(id) => deleteListItem("followUpTasks", id)}
            onToggle={(id) => toggleListItem("followUpTasks", id)}
          />
        </>
      ) : null}

      <button
        type="button"
        onClick={() => printFocusedReport("appointments")}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
      >
        <Printer size={18} aria-hidden="true" />
        Print Doctor Appointment Summary
      </button>
    </div>
  );
}
