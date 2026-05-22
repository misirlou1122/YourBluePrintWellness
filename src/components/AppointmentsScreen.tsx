import { useState } from "react";
import { CalendarDays, Download, FileText } from "lucide-react";
import { appointments } from "../data/sampleData";
import { Checklist } from "./Checklist";
import { EmptyState } from "./EmptyState";
import { FormField, TextAreaField } from "./FormField";
import { SectionCard } from "./SectionCard";

export function AppointmentsScreen() {
  const upcoming = appointments.filter((appointment) => appointment.status === "upcoming");
  const past = appointments.filter((appointment) => appointment.status === "past");
  const [selectedId, setSelectedId] = useState(upcoming[0]?.id ?? appointments[0]?.id ?? "");
  const selected = appointments.find((appointment) => appointment.id === selectedId) ?? appointments[0];

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
                    {appointment.specialty} · {appointment.date} at {appointment.time}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-periwinkle/85">{appointment.notes}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {selected ? (
        <SectionCard eyebrow="Detail view" title={`${selected.doctor}`} description={`${selected.specialty} at ${selected.location}`}>
          <div className="grid gap-3 text-sm text-periwinkle/85">
            <p>Date/time: {selected.date} at {selected.time}</p>
            <p>Phone: {selected.phone}</p>
            <p>Notes: {selected.notes}</p>
          </div>
        </SectionCard>
      ) : null}

      {selected ? (
        <SectionCard title="Things To Discuss" description="A simple checklist for the visit.">
          <Checklist items={selected.thingsToDiscuss} />
        </SectionCard>
      ) : null}

      {selected ? (
        <SectionCard title="Questions for Doctor" description="Use this space to capture questions before the appointment.">
          <div className="grid gap-3">
            {selected.questions.map((question) => (
              <div key={question} className="rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm text-white">
                {question}
              </div>
            ))}
            <TextAreaField label="New question placeholder" placeholder="Ask about cholesterol, A1C, symptoms, timing..." />
          </div>
        </SectionCard>
      ) : null}

      {selected ? (
        <SectionCard title="After Appointment Notes" description="A calm place to capture takeaways after the visit.">
          <TextAreaField label="After appointment notes" value={selected.afterNotes} />
        </SectionCard>
      ) : null}

      {selected ? (
        <SectionCard title="Follow-up Tasks" description="Small next steps after the visit.">
          <Checklist items={selected.followUpTasks} checkedFirst={false} />
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Past" title="Past appointments">
        {past.length ? (
          <div className="grid gap-3">
            {past.map((appointment) => (
              <article key={appointment.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <h3 className="text-sm font-semibold text-white">{appointment.doctor}</h3>
                <p className="mt-1 text-xs text-periwinkle/75">
                  {appointment.specialty} · {appointment.date}
                </p>
                <p className="mt-2 text-sm leading-6 text-periwinkle/85">{appointment.afterNotes}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No past appointments yet" message="Past visit notes will appear here." icon={FileText} />
        )}
      </SectionCard>

      <SectionCard title="Add appointment placeholder" description="This layout is ready for future local or backend saving.">
        <div className="grid gap-3">
          <FormField label="Doctor name" />
          <FormField label="Specialty" />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Date" type="date" />
            <FormField label="Time" type="time" />
          </div>
          <FormField label="Location" />
          <FormField label="Phone number" />
          <TextAreaField label="Notes" />
        </div>
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
