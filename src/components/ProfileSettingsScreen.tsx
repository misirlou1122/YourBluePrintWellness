import { ShieldCheck } from "lucide-react";
import type { WellnessProfileId } from "../data/wellnessProfiles";
import { getDailyTracker, todayKey, type DailyTrackerMap } from "../lib/dailyTracking";
import { useLocalStorage } from "../lib/useLocalStorage";
import type { TileId } from "../types/wellness";
import { LoginPreview } from "./LoginPreview";
import { ProblemReportPanel } from "./ProblemReportPanel";
import { SectionCard } from "./SectionCard";

const dailyDefaults = {
  mood: "not checked in",
  medicationStatus: "not taken",
  workoutStatus: "not logged"
};

function dailyDisplayValue(value: string, defaultValue: string) {
  return value.trim() ? value : defaultValue;
}

interface ProfileSettingsScreenProps {
  selectedProfile: WellnessProfileId;
  customTileIds: TileId[];
  onProfileChange: (profile: WellnessProfileId) => void;
  onCustomTileIdsChange: (tileIds: TileId[]) => void;
}

export function ProfileSettingsScreen({
  selectedProfile,
  customTileIds,
  onProfileChange,
  onCustomTileIdsChange
}: ProfileSettingsScreenProps) {
  const [dailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const today = todayKey();
  const todayTracker = getDailyTracker(dailyTrackers, today);

  return (
    <div className="grid gap-4">
      <SectionCard title="Body Measurements / Shopping Reference" description="Body Measurements can stay visible in any profile and can be turned on or off in Custom.">
        <div className="rounded-2xl border border-ice/20 bg-ice/10 p-4 text-sm leading-6 text-periwinkle/90">
          Use it for online clothes shopping, fit notes, and body progress tracking. Entries stay local in this browser.
        </div>
      </SectionCard>

      <LoginPreview
        selectedProfile={selectedProfile}
        customTileIds={customTileIds}
        onProfileChange={onProfileChange}
        onCustomTileIdsChange={onCustomTileIdsChange}
        showProfileSelector
      />

      <SectionCard title="Today's profile summary" description={`Daily tracker values for ${today}.`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["Water", `${todayTracker.water} oz`],
            ["Protein", `${todayTracker.protein} g`],
            ["Fiber", `${todayTracker.fiber} g`],
            ["Mood", dailyDisplayValue(todayTracker.mood, dailyDefaults.mood)],
            ["Medication", dailyDisplayValue(todayTracker.medicationStatus, dailyDefaults.medicationStatus)],
            ["Workout", dailyDisplayValue(todayTracker.workoutStatus, dailyDefaults.workoutStatus)]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
              <p className="text-xs text-periwinkle/70">{label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <ProblemReportPanel />

      <SectionCard className="border-ice/20 bg-ice/10">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-ice" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">
            This app is for personal tracking and organization only. It does not diagnose, treat, or replace medical advice.
            Always consult a licensed medical professional.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
