import { CheckCircle2, Cloud, ImagePlus, LogOut, ShieldCheck, UserRound, X } from "lucide-react";
import type { ChangeEvent } from "react";
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

const avatarEmojis = ["✨", "🌙", "💜", "🦋", "🌸", "💧", "⭐", "🧘"];

function resizeAvatarImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Unable to prepare image."));
          return;
        }

        const smallestSide = Math.min(image.width, image.height);
        const sourceX = (image.width - smallestSide) / 2;
        const sourceY = (image.height - smallestSide) / 2;

        canvas.width = size;
        canvas.height = size;
        context.drawImage(image, sourceX, sourceY, smallestSide, smallestSide, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => reject(new Error("That image could not be loaded."));
      image.src = String(reader.result);
    };

    reader.onerror = () => reject(new Error("That image could not be read."));
    reader.readAsDataURL(file);
  });
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

  const updateProfileFields = (updates: Partial<UserProfileInfo>) => {
    setSavedMessage("");
    setProfile((current) => ({ ...current, ...updates }));
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const avatarImage = await resizeAvatarImage(file);
      updateProfileFields({ avatarType: "image", avatarImage });
    } catch {
      setSavedMessage("That picture could not be added. Try a different image.");
    } finally {
      event.target.value = "";
    }
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

      <div className="mt-3 rounded-2xl border border-white/10 bg-midnight/45 p-4">
        <div className="flex items-start gap-3">
          <Cloud size={18} className="mt-0.5 shrink-0 text-lavender" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-white">Saved history</p>
            <p className="mt-1 text-sm leading-6 text-periwinkle/85">
              Your profile, wellness profile, trackers, notes, and daily history save under your signed-in account when cloud sync is enabled.
            </p>
          </div>
        </div>
      </div>

      <div data-section-label="Profile picture" className="mt-5 rounded-[1.5rem] border border-white/10 bg-midnight/45 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-3xl border border-lavender/30 bg-lavender/15 text-3xl shadow-lavender">
              {profile.avatarType === "image" && profile.avatarImage ? (
                <img src={profile.avatarImage} alt="Profile avatar" className="h-full w-full object-cover" />
              ) : (
                <span aria-hidden="true">{profile.avatarEmoji || "✨"}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Profile picture</p>
              <p className="mt-1 text-sm leading-6 text-periwinkle/80">Choose an emoji or add a photo.</p>
            </div>
          </div>
          <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice">
            <ImagePlus size={18} aria-hidden="true" />
            Upload photo
            <input type="file" accept="image/*" className="sr-only" onChange={uploadAvatar} />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {avatarEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => updateProfileFields({ avatarType: "emoji", avatarEmoji: emoji, avatarImage: "" })}
              className={`grid min-h-12 min-w-12 place-items-center rounded-2xl border text-2xl ${
                profile.avatarType !== "image" && (profile.avatarEmoji || "✨") === emoji
                  ? "border-lavender/60 bg-lavender/20 shadow-lavender"
                  : "border-white/10 bg-white/[0.05]"
              }`}
              aria-label={`Use ${emoji} as profile avatar`}
            >
              <span aria-hidden="true">{emoji}</span>
            </button>
          ))}
          {profile.avatarImage ? (
            <button
              type="button"
              onClick={() => updateProfileFields({ avatarType: "emoji", avatarImage: "" })}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
            >
              <X size={16} aria-hidden="true" />
              Remove photo
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <FormField label="Name" value={profile.displayName} onChange={(value) => updateProfile("displayName", value)} />
        <FormField label="Preferred name" value={profile.preferredName} onChange={(value) => updateProfile("preferredName", value)} />
        <FormField label="Email" type="email" value={profile.email || user?.email || ""} onChange={(value) => updateProfile("email", value)} />
        <FormField label="Age" value={profile.age} onChange={(value) => updateProfile("age", value)} />
        <FormField label="Height" value={profile.height} onChange={(value) => updateProfile("height", value)} />
        <FormField label="Weight" value={profile.weight} onChange={(value) => updateProfile("weight", value)} />
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
