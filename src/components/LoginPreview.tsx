import { LockKeyhole, ShieldCheck } from "lucide-react";

export function LoginPreview() {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 shadow-lavender">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-ice/20 bg-ice/10 text-ice">
          <LockKeyhole size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Private dashboard</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Sign-in preview</h2>
          <p className="mt-2 text-sm leading-6 text-periwinkle/85">
            Secure sign-in is planned for a later phase. For now, this app stays local and sample-data only.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <input
          aria-label="Email"
          disabled
          placeholder="Email"
          className="min-h-12 rounded-2xl border border-white/10 bg-midnight/50 px-4 text-sm text-white placeholder:text-periwinkle/55"
        />
        <input
          aria-label="Password"
          disabled
          type="password"
          placeholder="Password"
          className="min-h-12 rounded-2xl border border-white/10 bg-midnight/50 px-4 text-sm text-white placeholder:text-periwinkle/55"
        />
        <button
          type="button"
          disabled
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lavender/25 bg-lavender/15 px-4 text-sm font-semibold text-lavender"
        >
          <ShieldCheck size={18} aria-hidden="true" />
          Secure sign-in planned
        </button>
      </div>
    </section>
  );
}
