import { Sparkles } from "lucide-react";
import { profileSummary } from "../data/wellness";
import { getProfileLabel, type WellnessProfileId } from "../data/wellnessProfiles";
import type { TileId, WellnessTile } from "../types/wellness";
import { emptyUserProfile } from "../types/userProfile";
import { formatBmi } from "../lib/bodyMetrics";
import { useLocalStorage } from "../lib/useLocalStorage";
import { TileCard } from "./TileCard";

interface HomeDashboardProps {
  tiles: WellnessTile[];
  selectedProfile: WellnessProfileId;
  onOpenTile: (id: TileId) => void;
}

interface WeightSummary {
  id: string;
  date: string;
  weight: string;
  unit: "lb" | "kg";
}

export function HomeDashboard({ tiles, selectedProfile, onOpenTile }: HomeDashboardProps) {
  const [weightLogs] = useLocalStorage<WeightSummary[]>("ybw.weightLogs", []);
  const [userProfile] = useLocalStorage("ybw.userProfile", emptyUserProfile);
  const latestWeight = [...weightLogs].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const displayName = userProfile.preferredName || userProfile.displayName || profileSummary.name;
  const displayWeight = userProfile.weight || (latestWeight ? `${latestWeight.weight} ${latestWeight.unit}` : "");
  const displayBmi = formatBmi(displayWeight, userProfile.height);
  const avatarEmoji = userProfile.avatarEmoji || "*";
  const showAvatarImage = userProfile.avatarType === "image" && Boolean(userProfile.avatarImage);
  const requiredProfileFields = [displayName, userProfile.age, userProfile.height, displayWeight];
  const completedProfileFields = requiredProfileFields.filter((value) => String(value || "").trim()).length;
  const profileComplete = completedProfileFields === requiredProfileFields.length && displayName !== profileSummary.name;

  return (
    <main className="grid min-w-0 gap-5">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white">
              {displayName === profileSummary.name ? "Private wellness blueprint" : `${displayName}'s wellness blueprint`}
            </h1>
            <p className="mt-2 text-sm leading-6 text-periwinkle/85">Mobile-first wellness tracking for yourblueprintwellness.com.</p>
          </div>
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-lavender/25 bg-lavender/15 text-2xl text-lavender shadow-lavender">
            {showAvatarImage ? (
              <img src={userProfile.avatarImage} alt="Profile avatar" className="h-full w-full object-cover" />
            ) : avatarEmoji ? (
              <span aria-hidden="true">{avatarEmoji}</span>
            ) : (
              <Sparkles size={23} aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-midnight/50 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-periwinkle/85">
            <span className="rounded-full border border-ice/20 bg-ice/10 px-3 py-1 text-ice">Name: {displayName}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Age: {userProfile.age || profileSummary.age}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Height: {userProfile.height || profileSummary.height}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Weight: {displayWeight || "Add weight"}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">BMI: {displayBmi}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Profile: {getProfileLabel(selectedProfile)}</span>
          </div>
          <div className="mt-4 rounded-2xl border border-lavender/20 bg-lavender/10 p-3">
            <p className="text-sm font-semibold text-white">
              {profileComplete ? "Your wellness profile is saved." : "Build your wellness profile."}
            </p>
            <p className="mt-1 text-xs leading-5 text-periwinkle/85">
              {profileComplete
                ? "Open profile anytime to update your basics, avatar, and wellness profile."
                : `Add your name, age, height, and weight so the dashboard feels personal. ${completedProfileFields}/${requiredProfileFields.length} basics complete.`}
            </p>
            <button
              type="button"
              onClick={() => onOpenTile("settings")}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow sm:w-auto"
            >
              {profileComplete ? "Edit profile" : "Build profile"}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender/75">Dashboard</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Choose an area</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-4">
          {tiles.map((tile) => (
            <TileCard key={tile.id} tile={tile} onOpen={onOpenTile} />
          ))}
        </div>
      </section>
    </main>
  );
}
