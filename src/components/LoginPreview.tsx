import { CheckCircle2, LogOut, ShieldCheck, UserRound } from "lucide-react";
import type { WellnessProfileId } from "../data/wellnessProfiles";
import { useLocalStorage } from "../lib/useLocalStorage";
import { useSupabaseAuth } from "../lib/useSupabaseAuth";
import type { TileId } from "../types/wellness";
import { emptyUserProfile, type UserProfileInfo } from "../types/userProfile";
import { FormField } from "./FormField";
import { WellnessProfileSelector } from "./WellnessProfileSelector";

interface LoginPreviewProps {
  selectedProfile?: WellnessProfileId;
  customTileIds?: TileId[];
  onProfileChange?: (profile: WellnessProfileId) => void;
  onCustomTileIdsChange?: (tileIds: TileId[]) => void;
  showProfileSelector?: boolean;
  onSaved?: () => void;
}

export function LoginPreview({
  selectedProfile,
  customTileIds = [],
  onProfileChange,
  onCustomTileIdsChange,
  showProfileSelector = false,
  onSaved
}: LoginPreviewProps) {
  const { user, signOut } = useSupabaseAuth();
  const [profile, setProfile] = useLocalStorage("ybw.userProfile", { ...emptyUserProfile, email: user?.email ?? "" });
  const [savedMessage, setSavedMessage] = useLocalStorage("ybw.profileSavedMessage", "");

  const updateProfile = (field: keyof UserProfileInfo, value: string) => {
    setSavedMessage("");
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = () => {
    setProfile((current) => ({ ...current, email: current.email || user?.email || "" }));
    setSavedMessage("Profile saved.");
    onSaved?.();
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
            Your profile details and wellness profile save under your account on this device. Passwords are never stored in this app.
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
        <FormField label="Age" value={profile.age} onChange={(value) => updateProfile("age", value)} />
        <FormField label="Height" value={profile.height} onChange={(value) => updateProfile("height", value)} />
      </div>

      {showProfileSelector && selectedProfile && onProfileChange && onCustomTileIdsChange ? (
        <div className="mt-5">
          <WellnessProfileSelector
            selectedProfile={selectedProfile}
            customTileIds={customTileIds}
            onProfileChange={onProfileChange}
            onCustomTileIdsChange={onCustomTileIdsChange}
            showCustomControls
          />
        </div>
      ) : null}

      {savedMessage ? (
        <p className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice">
          <CheckCircle2 size={18} aria-hidden="true" />
          {savedMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={saveProfile}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
      >
        <CheckCircle2 size={18} aria-hidden="true" />
        Save profile
      </button>

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
