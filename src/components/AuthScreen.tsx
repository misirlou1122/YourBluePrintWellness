import { useState } from "react";
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useSupabaseAuth } from "../lib/useSupabaseAuth";
import { FormField } from "./FormField";
import { MedicalDisclaimer } from "./MedicalDisclaimer";

type AuthMode = "login" | "signup" | "reset";

interface AuthScreenProps {
  initialMode?: AuthMode;
  onNavigate: (path: string) => void;
}

function modeTitle(mode: AuthMode) {
  if (mode === "signup") return "Create your account";
  if (mode === "reset") return "Reset your password";
  return "Log in to your account";
}

export function AuthScreen({ initialMode = "login", onNavigate }: AuthScreenProps) {
  const { session } = useSupabaseAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  const switchMode = (nextMode: AuthMode) => {
    clearStatus();
    setMode(nextMode);
    onNavigate(nextMode === "login" ? "/login" : nextMode === "signup" ? "/signup" : "/reset-password");
  };

  const handleLogin = async () => {
    clearStatus();
    if (!supabase) {
      setError("Sign-in is temporarily unavailable. Please refresh and try again.");
      return;
    }
    setBusy(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    if (data.user) {
      window.localStorage.setItem("ybw.currentUserId", data.user.id);
    }
    onNavigate("/app");
  };

  const handleSignup = async () => {
    clearStatus();
    if (!supabase) {
      setError("Account creation is temporarily unavailable. Please refresh and try again.");
      return;
    }
    setBusy(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${window.location.origin}/app`
      }
    });
    setBusy(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session && data.user) {
      window.localStorage.setItem("ybw.currentUserId", data.user.id);
      onNavigate("/app");
      return;
    }

    setMessage("Check your email to confirm your account, then log in.");
  };

  const handlePasswordReset = async () => {
    clearStatus();
    if (!supabase) {
      setError("Password reset is temporarily unavailable. Please refresh and try again.");
      return;
    }
    setBusy(true);

    if (session && newPassword) {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      setBusy(false);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage("Your password has been updated. You can continue to your dashboard.");
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    setBusy(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Password reset instructions have been sent to your email.");
  };

  const submit = () => {
    if (mode === "signup") void handleSignup();
    else if (mode === "reset") void handlePasswordReset();
    else void handleLogin();
  };

  const disabled = busy || (mode !== "reset" && (!email || !password)) || (mode === "reset" && !email && !newPassword);

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-3xl content-center gap-5 px-4 pb-[env(safe-area-inset-bottom)] pt-4 sm:px-6">
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
            <LockKeyhole size={23} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white">{modeTitle(mode)}</h1>
            <p className="mt-2 text-sm leading-6 text-periwinkle/85">
              Use your email and password to keep your wellness dashboard private.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {mode === "signup" ? <FormField label="Name" value={displayName} onChange={setDisplayName} /> : null}
          {!session || mode !== "reset" ? <FormField label="Email" type="email" value={email} onChange={setEmail} /> : null}
          {mode !== "reset" ? <FormField label="Password" type="password" value={password} onChange={setPassword} /> : null}
          {mode === "reset" && session ? (
            <FormField label="New password" type="password" value={newPassword} onChange={setNewPassword} />
          ) : null}
        </div>

        {error ? <p className="mt-4 rounded-2xl border border-rose-300/25 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</p> : null}
        {message ? <p className="mt-4 rounded-2xl border border-ice/25 bg-ice/10 p-3 text-sm text-ice">{message}</p> : null}

        <button
          type="button"
          disabled={disabled}
          onClick={submit}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-5 py-4 text-sm font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Mail size={18} aria-hidden="true" />
          {busy ? "Please wait..." : mode === "signup" ? "Create account" : mode === "reset" && session ? "Update password" : mode === "reset" ? "Send reset email" : "Log in"}
        </button>

        <div className="mt-5 grid gap-2 text-center text-sm text-periwinkle/85">
          {mode !== "login" ? (
            <button type="button" onClick={() => switchMode("login")} className="min-h-10 text-ice">
              Already have an account? Log in
            </button>
          ) : null}
          {mode !== "signup" ? (
            <button type="button" onClick={() => switchMode("signup")} className="min-h-10 text-lavender">
              New here? Create account
            </button>
          ) : null}
          {mode !== "reset" ? (
            <button type="button" onClick={() => switchMode("reset")} className="min-h-10 text-periwinkle/80">
              Forgot password?
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-midnight/45 p-4">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-ice" aria-hidden="true" />
          <p className="text-sm leading-6 text-periwinkle/85">
            Passwords are handled by the secure account provider. This app does not store passwords.
          </p>
        </div>
      </section>
      <MedicalDisclaimer />
    </main>
  );
}
