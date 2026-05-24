import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteCurrentAccount } from "../lib/accountDeletion";
import { SectionCard } from "./SectionCard";

export function DeleteAccountPanel() {
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = confirmation.trim().toUpperCase() === "DELETE";

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;

    const confirmed = window.confirm(
      "Delete your account and saved wellness data? This removes your profile, trackers, document records, and uploaded files. This cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setStatus("");

    try {
      await deleteCurrentAccount();
      window.location.assign("/");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Your account could not be deleted. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <SectionCard title="Delete account and data" description="Permanently remove your account, saved wellness history, document records, and uploaded files.">
      <div className="grid gap-4">
        <div className="flex items-start gap-3 rounded-2xl border border-blush/25 bg-blush/10 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-champagne" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">
            This action cannot be undone. Type <span className="font-semibold text-champagne">DELETE</span> to confirm.
          </p>
        </div>

        <label className="grid gap-2 text-sm text-periwinkle/90">
          Confirmation
          <input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="Type DELETE"
            className="min-h-12 rounded-2xl border border-white/10 bg-midnight/70 px-4 text-white outline-none transition focus:border-blush/70"
          />
        </label>

        <button
          type="button"
          disabled={!canDelete || isDeleting}
          onClick={handleDelete}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-blush/40 bg-blush/15 px-4 text-sm font-semibold text-blush transition hover:border-blush/70 hover:bg-blush/20 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Trash2 size={18} aria-hidden="true" />
          {isDeleting ? "Deleting..." : "Delete my account and data"}
        </button>

        {status ? <p className="rounded-2xl border border-blush/25 bg-blush/10 p-3 text-sm leading-6 text-white">{status}</p> : null}
      </div>
    </SectionCard>
  );
}
