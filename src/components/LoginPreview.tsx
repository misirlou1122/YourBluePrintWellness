import { LockKeyhole, LogIn, LogOut, ShieldCheck } from "lucide-react";

export function LoginPreview() {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 shadow-lavender">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-ice/20 bg-ice/10 text-ice">
          <LockKeyhole size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Private dashboard</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Private access</h2>
          <p className="mt-2 text-sm leading-6 text-periwinkle/85">
            Login protection is active when deployed through Azure Static Web Apps. Local entries still stay in this browser.
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-ice/20 bg-ice/10 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-white">Signed-in status</p>
            <p className="mt-1 text-sm leading-6 text-periwinkle/85">
              Managed by Azure Static Web Apps authentication when deployed. Local dev may not show a real user.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href="/.auth/login/aad"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <LogIn size={18} aria-hidden="true" />
          Login with Microsoft
        </a>
        <a
          href="/.auth/logout"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
        >
          <LogOut size={18} aria-hidden="true" />
          Logout
        </a>
      </div>
    </section>
  );
}
