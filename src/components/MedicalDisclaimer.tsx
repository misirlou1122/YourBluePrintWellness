export function MedicalDisclaimer() {
  return (
    <footer className="pb-8 pt-4 text-center text-xs leading-5 text-periwinkle/70">
      <p>
        This app is for personal tracking and organization only. It does not diagnose, treat, or replace medical advice.
        Always consult a licensed medical professional.
      </p>
      <a href="/privacy" className="mt-2 inline-flex min-h-8 items-center justify-center text-ice underline decoration-ice/40 underline-offset-4">
        Privacy Policy
      </a>
    </footer>
  );
}
