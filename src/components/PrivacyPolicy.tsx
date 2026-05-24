import { ArrowLeft, ShieldCheck } from "lucide-react";
import { MedicalDisclaimer } from "./MedicalDisclaimer";

interface PrivacyPolicyProps {
  onNavigate: (path: string) => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-3xl gap-5 px-4 pb-[env(safe-area-inset-bottom)] pt-4 sm:px-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl sm:p-7">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-ice/20 bg-ice/10 px-4 text-sm font-semibold text-ice"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </button>

        <div className="mt-6 flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-lavender/25 bg-lavender/15 text-lavender shadow-lavender">
            <ShieldCheck size={23} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white">Privacy Policy</h1>
            <p className="mt-2 text-sm leading-6 text-periwinkle/85">Last updated: May 22, 2026</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 text-sm leading-6 text-periwinkle/88">
          <section>
            <h2 className="text-lg font-semibold text-white">What this app is for</h2>
            <p className="mt-2">
              Your Blueprint Wellness is a personal wellness tracking app. It helps users organize profile details,
              labs, medications, appointments, notes, reminders, uploads, measurements, and other wellness information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Information you choose to save</h2>
            <p className="mt-2">
              The app may store information you enter, including your name, preferred name, wellness profile, height,
              weight, tracker entries, notes, lab values, appointment details, reminders, document details, and uploaded
              files.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Account and sign-in</h2>
            <p className="mt-2">
              Account sign-in is handled by a secure authentication provider. This app does not store your password.
              Your saved app data is separated by your signed-in user account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Uploads</h2>
            <p className="mt-2">
              If you upload labs, doctor documents, or progress photos, those files are intended to be stored privately
              under your account. Do not upload anything you are not comfortable storing in your private wellness account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">How information is used</h2>
            <p className="mt-2">
              Your information is used to show your dashboard, save your history, create printable summaries, and help
              organize your personal wellness records. The app is not intended to sell personal wellness data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Your control</h2>
            <p className="mt-2">
              You can edit or delete entries inside the app. You can also request account and data deletion from the
              Account / Profile area.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Important health note</h2>
            <p className="mt-2">
              This app is for personal tracking and organization only. It does not diagnose, treat, or replace medical
              advice. Always consult a licensed medical professional.
            </p>
          </section>
        </div>
      </section>
      <MedicalDisclaimer />
    </main>
  );
}
