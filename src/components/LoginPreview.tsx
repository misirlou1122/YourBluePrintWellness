import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { useSupabaseAuth } from "../lib/useSupabaseAuth";
import { FormField } from "./FormField";

interface UserProfileInfo {
  displayName: string;
  preferredName: string;
  email: string;
}

export function LoginPreview() {
  const { user, signOut } = useSupabaseAuth();
  const [profile, setProfile] = useLocalStorage<UserProfileInfo>("ybw.userProfile", {
    displayName: "",
    preferredName: "",
    email: user?.email ?? ""
  });

  const updateProfile = (field: keyof UserProfileInfo, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const logout = async () => {
    await signOut();
    window.location.assign("/");
  };

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 shadow-lavender">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-ice/20 bg-ice/10 text-ice">
          <UserRound size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Account</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Profile and sign-in</h2>
          <p className="mt-2 text-sm leading-6 text-periwinkle/85">
            Your profile details save under your account on this device. Passwords are never stored in this app.
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-ice/20 bg-ice/10 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-white">Signed-in status</p>
            <p className="mt-1 text-sm leading-6 text-periwinkle/85">
              {user?.email ? `Signed in as ${user.email}.` : "Not signed in on this device."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <FormField label="Name" value={profile.displayName} onChange={(value) => updateProfile("displayName", value)} />
        <FormField label="Preferred name" value={profile.preferredName} onChange={(value) => updateProfile("preferredName", value)} />
        <FormField label="Email" type="email" value={profile.email || user?.email || ""} onChange={(value) => updateProfile("email", value)} />
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
      >
          <LogOut size={18} aria-hidden="true" />
          Logout
      </button>
    </section>
  );
}
