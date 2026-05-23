import { ArrowRight, Sparkles } from "lucide-react";
import { MedicalDisclaimer } from "./MedicalDisclaimer";

interface PublicLandingProps {
  onNavigate: (path: string) => void;
}

export function PublicLanding({ onNavigate }: PublicLandingProps) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-4xl gap-5 px-4 pb-[env(safe-area-inset-bottom)] pt-4 sm:px-6 lg:px-8">
      <section className="grid min-h-[72vh] content-center gap-6 rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">Welcome to your private wellness space</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-periwinkle/88">
              Track labs, appointments, medications, body measurements, notes, documents, and progress photos in one calm dashboard.
            </p>
          </div>
          <div className="hidden size-14 shrink-0 place-items-center rounded-2xl border border-lavender/25 bg-lavender/15 text-lavender shadow-lavender sm:grid">
            <Sparkles size={27} aria-hidden="true" />
          </div>
        </div>

        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={() => onNavigate("/login")}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            Log in
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/signup")}
            className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-lavender/25 bg-lavender/10 px-5 text-sm font-semibold text-lavender shadow-lavender"
          >
            Create account
          </button>
        </div>

        <p className="max-w-2xl rounded-2xl border border-white/10 bg-midnight/35 p-4 text-xs leading-5 text-periwinkle/75">
          Your wellness dashboard is private to your account. This app is for personal tracking and organization only and does not replace medical advice.
        </p>
      </section>
      <MedicalDisclaimer />
    </main>
  );
}
