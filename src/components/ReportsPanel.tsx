import { Download, FileText } from "lucide-react";
import { reportExports } from "../data/wellness";

export function ReportsPanel() {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 shadow-ice">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-lavender/20 bg-lavender/10 text-lavender">
          <FileText size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lavender/75">Reports / export</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Wellness summary exports</h2>
          <p className="mt-2 text-sm leading-6 text-periwinkle/85">
            Placeholder export buttons for doctor visits, lab trends, medications, appointment notes, and wellness summaries.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-ice/15 bg-ice/10 p-4">
        <h3 className="text-sm font-semibold text-white">Doctor summary preview</h3>
        <p className="mt-2 text-sm leading-6 text-periwinkle/85">
          Latest labs, medications, supplements, symptoms, mood notes, alcohol notes when relevant, questions, things to
          discuss, and upcoming appointments.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {reportExports.map((report) => (
          <button
            type="button"
            key={report.title}
            className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 p-4 text-left transition hover:border-ice/45 hover:bg-white/[0.08]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-ice/20 bg-ice/10 text-ice">
              <Download size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">{report.title}</span>
              <span className="mt-1 block text-xs leading-5 text-periwinkle/78">{report.description}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
