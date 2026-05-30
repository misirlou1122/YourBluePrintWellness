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
          <TextAreaField label="Questions for doctor" value={draft.notes} onChange={(value) => setField("notes", value)} />
          <TextAreaField label="Follow-up tasks" value={draft.afterNotes} onChange={(value) => setField("afterNotes", value)} />
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
        <SectionCard title="Appointments" description="Select a visit to manage questions and follow-up tasks.">
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
              <TextAreaField label="Questions for doctor" value={selected.notes} onChange={(value) => update(selected.id, { notes: value })} />
              <TextAreaField label="Follow-up tasks" value={selected.afterNotes} onChange={(value) => update(selected.id, { afterNotes: value })} />
            </div>
          </SectionCard>
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
