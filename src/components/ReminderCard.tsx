import { Bell, CheckCircle2 } from "lucide-react";

interface ReminderCardProps {
  title: string;
  date: string;
  time: string;
  category: string;
  recurrence: string;
  notes?: string;
  completed?: boolean;
}

export function ReminderCard({ title, date, time, category, recurrence, notes, completed = false }: ReminderCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-lavender/20 bg-lavender/10 text-lavender">
          {completed ? <CheckCircle2 size={20} aria-hidden="true" /> : <Bell size={20} aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <span className="rounded-full border border-ice/20 bg-ice/10 px-2.5 py-1 text-[0.7rem] font-semibold text-ice">
              {completed ? "Done" : recurrence}
            </span>
          </div>
          <p className="mt-1 text-xs text-periwinkle/70">
          {category} | {date} at {time}
          </p>
          {notes ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{notes}</p> : null}
        </div>
      </div>
    </article>
  );
}
