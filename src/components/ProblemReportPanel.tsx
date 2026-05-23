import { Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { createId, useLocalCollection, type LocalItem } from "../lib/useLocalStorage";
import { useSupabaseAuth } from "../lib/useSupabaseAuth";
import { FormField, SelectField, TextAreaField } from "./FormField";
import { SectionCard } from "./SectionCard";

interface ProblemReport extends LocalItem {
  title: string;
  area: string;
  description: string;
  contactEmail: string;
  createdAt: string;
}

const emptyReport: Omit<ProblemReport, "id" | "createdAt"> = {
  title: "",
  area: "General",
  description: "",
  contactEmail: ""
};

const supportEmail = (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined) || "support@yourblueprintwellness.com";

export function ProblemReportPanel() {
  const { user } = useSupabaseAuth();
  const { items, add, remove } = useLocalCollection<ProblemReport>("ybw.problemReports", [], "report");
  const [report, setReport] = useState({ ...emptyReport, contactEmail: user?.email ?? "" });
  const [savedMessage, setSavedMessage] = useState("");

  const recentReports = useMemo(() => items.slice(0, 3), [items]);
  const canSend = report.title.trim() && report.description.trim();

  const updateReport = (field: keyof typeof emptyReport, value: string) => {
    setSavedMessage("");
    setReport((current) => ({ ...current, [field]: value }));
  };

  const saveReport = () => {
    if (!canSend) {
      setSavedMessage("Add a short title and what happened first.");
      return;
    }

    const nextReport: ProblemReport = {
      ...report,
      id: createId("report"),
      createdAt: new Date().toISOString()
    };
    add(nextReport);
    setSavedMessage("Report saved. You can send it now or keep it for your notes.");
  };

  const sendReport = () => {
    if (!canSend) {
      setSavedMessage("Add a short title and what happened first.");
      return;
    }

    const body = [
      "Hi Your Blueprint Wellness team,",
      "",
      `Problem: ${report.title}`,
      `Area: ${report.area}`,
      `Contact email: ${report.contactEmail || user?.email || "Not provided"}`,
      "",
      "What happened:",
      report.description,
      "",
      "Thank you."
    ].join("\n");

    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(`Your Blueprint Wellness problem report: ${report.title}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <SectionCard title="Report a problem" description="Tell us what went wrong or what felt confusing.">
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Short title" value={report.title} onChange={(value) => updateReport("title", value)} />
          <SelectField
            label="Area"
            value={report.area}
            options={["General", "Login", "Profile", "Labs", "Uploads", "Trackers", "Printing", "Mobile layout"]}
            onChange={(value) => updateReport("area", value)}
          />
        </div>
        <TextAreaField label="What happened?" value={report.description} onChange={(value) => updateReport("description", value)} rows={4} />
        <FormField label="Contact email" type="email" value={report.contactEmail} onChange={(value) => updateReport("contactEmail", value)} />

        {savedMessage ? <p className="rounded-2xl border border-ice/20 bg-ice/10 p-3 text-sm text-ice">{savedMessage}</p> : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={sendReport}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
          >
            <Send size={18} aria-hidden="true" />
            Send report
          </button>
          <button
            type="button"
            onClick={saveReport}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice"
          >
            Save for later
          </button>
        </div>

        {recentReports.length ? (
          <div className="grid gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender/75">Recent saved reports</p>
            {recentReports.map((item) => (
              <article key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-midnight/45 p-3">
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-periwinkle/75">{item.area}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="grid min-h-10 min-w-10 place-items-center rounded-2xl border border-lavender/20 bg-lavender/10 text-lavender"
                  aria-label="Delete saved report"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
