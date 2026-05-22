import { useState } from "react";
import { CalendarDays, Download, FileText, Plus } from "lucide-react";
import { appointments as sampleAppointments, type Appointment } from "../data/sampleData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { Checklist } from "./Checklist";
import { EmptyState } from "./EmptyState";
import { FormField, TextAreaField } from "./FormField";
import { SectionCard } from "./SectionCard";

export function AppointmentsScreen() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>("ybw.appointments", sampleAppointments);
  const upcoming = appointments.filter((appointment) => appointment.status === "upcoming");
  const past = appointments.filter((appointment) => appointment.status === "past");
  const [selectedId, setSelectedId] = useState(upcoming[0]?.id ?? appointments[0]?.id ?? "");
  const selected = appointments.find((appointment) => appointment.id === selectedId) ?? appointments[0];
  const [newQuestion, setNewQuestion] = useState("");
  const [newTask, setNewTask] = useState("");
  const [doctor, setDoctor] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((current) =>
      current.map((appointment) => (appointment.id === id ? { ...appointment, ...updates } : appointment))
    );
  };

  const addQuestion = () => {
    if (!selected || !newQuestion.trim()) {
      return;
    }

    updateAppointment(selected.id, { questions: [newQuestion.trim(), ...selected.questions] });
    setNewQuestion("");
  };

  const addTask = () => {
    if (!selected || !newTask.trim()) {
      return;
    }

    updateAppointment(selected.id, { followUpTasks: [newTask.trim(), ...selected.followUpTasks] });
    setNewTask("");
  };

  const addAppointment = () => {
    if (!doctor.trim()) {
      return;
    }

    const next: Appointment = {
      id: `appt-${Date.now()}`,
      doctor: doctor.trim(),
      specialty: specialty || "General wellness",
      date: date || "Date to choose",
      time: time || "Time to choose",
      location: location || "Location to add",
      phone: phone || "Phone to add",
      notes,
      thingsToDiscuss: ["Review recent notes", "Ask follow-up questions"],
      questions: [],
      afterNotes: "",
      followUpTasks: [],
      status: "upcoming"
    };

    setAppointments([next, ...appointments]);
    setSelectedId(next.id);
    setDoctor("");
    setSpecialty("");
    setDate("");
    setTime("");
    setLocation("");
    setPhone("");
    setNotes("");
  };

  return (
    <div className="grid gap-4">
      <SectionCard eyebrow="Upcoming" title="Appointments" description="Tap an appointment to prepare details and notes.">
        <div className="grid gap-3">
          {upcoming.map((appointment) => (
            <button
              key={appointment.id}
              type="button"
              onClick={() => setSelectedId(appointment.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedId === appointment.id
                  ? "border-ice/55 bg-ice/10 shadow-ice"
                  : "border-white/10 bg-midnight/45 hover:border-lavender/45"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-lavender/20 bg-lavender/10 text-lavender">
                  <CalendarDays size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{appointment.doctor}</h3>
                  <p className="mt-1 text-xs text-periwinkle/75">
                    {appointment.specialty} | {appointment.date} at {appointment.time}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-periwinkle/85">{appointment.notes}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {selected ? (
        <SectionCard eyebrow="Detail view" title={selected.doctor} description={`${selected.specialty} at ${selected.location}`}>
          <div className="grid gap-3 text-sm text-periwinkle/85">
            <p>Date/time: {selected.date} at {selected.time}</p>
            <p>Phone: {selected.phone}</p>
            <TextAreaField
              label="Appointment notes"
              value={selected.notes}
              onChange={(value) => updateAppointment(selected.id, { notes: value })}
            />
          </div>
        </SectionCard>
      ) : null}

      {selected ? (
        <SectionCard title="Things To Discuss" description="Checklist state persists locally for each appointment.">
          <Checklist items={selected.thingsToDiscuss} storageKey={`ybw.appointmentChecklist.${selected.id}`} />
        </SectionCard>
      ) : null}

      {selected ? (
        <SectionCard title="Questions for Doctor" description="Questions save locally with the appointment.">
          <div className="grid gap-3">
            {selected.questions.map((question) => (
              <div key={question} className="rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm text-white">
                {question}
              </div>
            ))}
            <TextAreaField
              label="New question"
              value={newQuestion}
              onChange={setNewQuestion}
              placeholder="Ask about cholesterol, A1C, symptoms, timing..."
            />
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
            >
              <Plus size={18} aria-hidden="true" />
              Add question
            </button>
          </div>
        </SectionCard>
      ) : null}

      {selected ? (
        <SectionCard title="After Appointment Notes" description="Takeaways save locally with the appointment.">
          <TextAreaField
            label="After appointment notes"
            value={selected.afterNotes}
            onChange={(value) => updateAppointment(selected.id, { afterNotes: value })}
          />
        </SectionCard>
      ) : null}

      {selected ? (
        <SectionCard title="Follow-up Tasks" description="Tasks and checked states persist locally.">
          <div className="grid gap-3">
            <Checklist items={selected.followUpTasks} checkedFirst={false} storageKey={`ybw.appointmentTasks.${selected.id}`} />
            <FormField label="New follow-up task" value={newTask} onChange={setNewTask} />
            <button
              type="button"
              onClick={addTask}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lavender/25 bg-lavender/10 px-4 text-sm font-semibold text-lavender"
            >
              <Plus size={18} aria-hidden="true" />
              Add task
            </button>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Past" title="Past appointments">
        {past.length ? (
          <div className="grid gap-3">
            {past.map((appointment) => (
              <article key={appointment.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <h3 className="text-sm font-semibold text-white">{appointment.doctor}</h3>
                <p className="mt-1 text-xs text-periwinkle/75">
                  {appointment.specialty} | {appointment.date}
                </p>
                <p className="mt-2 text-sm leading-6 text-periwinkle/85">{appointment.afterNotes}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No past appointments yet" message="Past visit notes will appear here." icon={FileText} />
        )}
      </SectionCard>

      <SectionCard title="Add appointment" description="New appointments save locally in this browser.">
        <div className="grid gap-3">
          <FormField label="Doctor name" value={doctor} onChange={setDoctor} />
          <FormField label="Specialty" value={specialty} onChange={setSpecialty} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Date" type="date" value={date} onChange={setDate} />
            <FormField label="Time" type="time" value={time} onChange={setTime} />
          </div>
          <FormField label="Location" value={location} onChange={setLocation} />
          <FormField label="Phone number" value={phone} onChange={setPhone} />
          <TextAreaField label="Notes" value={notes} onChange={setNotes} />
        </div>
        <button
          type="button"
          onClick={addAppointment}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Add appointment
        </button>
      </SectionCard>

      <button
        type="button"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
      >
        <Download size={18} aria-hidden="true" />
        Export appointment summary
      </button>
    </div>
  );
}
