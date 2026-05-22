import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { MedicalDisclaimer } from "./MedicalDisclaimer";

export function PublicLanding() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-5 px-4 pb-[env(safe-area-inset-bottom)] pt-4 sm:px-6 lg:px-8">
      <section className="grid min-h-[78vh] content-center gap-6 rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">Welcome to your private wellness space</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-periwinkle/88">
              Track labs, appointments, medications, body measurements, habits, notes, documents, and progress photos in one calm dashboard.
            </p>
          </div>
          <div className="hidden size-14 shrink-0 place-items-center rounded-2xl border border-lavender/25 bg-lavender/15 text-lavender shadow-lavender sm:grid">
            <Sparkles size={27} aria-hidden="true" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: LockKeyhole, title: "Private dashboard", body: "Sign in before opening your wellness dashboard." },
            { icon: UploadCloud, title: "Secure uploads next", body: "Labs, documents, and photos can connect to private Azure Blob Storage." },
            { icon: ShieldCheck, title: "No app passwords", body: "Microsoft handles account login so passwords are never stored in this app." }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[1.5rem] border border-white/10 bg-midnight/45 p-4">
                <div className="grid size-11 place-items-center rounded-2xl border border-ice/20 bg-ice/10 text-ice">
                  <Icon size={21} aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-base font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-periwinkle/82">{item.body}</p>
              </article>
            );
          })}
        </div>

        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <a
            href="/.auth/login/aad?post_login_redirect_uri=/app"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            Log in with Microsoft
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a
            href="/app"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-ice/25 bg-ice/10 px-5 text-sm font-semibold text-ice shadow-ice"
          >
            Open dashboard
          </a>
        </div>

        <p className="text-xs leading-5 text-periwinkle/68">
          On Azure, opening the dashboard requires Microsoft sign-in. In local development, the dashboard opens directly for testing.
        </p>
      </section>
      <MedicalDisclaimer />
    </main>
  );
}
