import { useEffect } from "react";
import { RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { profileSummary } from "../data/wellness";
import { getProfileLabel, type WellnessProfileId } from "../data/wellnessProfiles";
import type { TileId, WellnessTile } from "../types/wellness";
import { emptyUserProfile } from "../types/userProfile";
import { formatBmi } from "../lib/bodyMetrics";
import { useLocalStorage } from "../lib/useLocalStorage";
import { getDailyTracker, mergeDailyTracker, resetDailyTracker, todayKey, type DailyTrackerEntry, type DailyTrackerMap } from "../lib/dailyTracking";
import { FormField } from "./FormField";
import { LoginPreview } from "./LoginPreview";
import { ProgressBar } from "./ProgressBar";
import { ProgressRing } from "./ProgressRing";
import { ReportsPanel } from "./ReportsPanel";
import { SectionCard } from "./SectionCard";
import { TileCard } from "./TileCard";

interface HomeDashboardProps {
  tiles: WellnessTile[];
  selectedProfile: WellnessProfileId;
  customTileIds: TileId[];
  onOpenTile: (id: TileId) => void;
  onOpenSettings: () => void;
  onProfileChange: (profile: WellnessProfileId) => void;
  onCustomTileIdsChange: (tileIds: TileId[]) => void;
}

interface BodyMeasurementSummary {
  id: string;
  date: string;
  bustChest?: string;
  waist?: string;
  hips?: string;
  inseam?: string;
  shoeSize?: string;
  braSize?: string;
}

interface WeightSummary {
  id: string;
  date: string;
  weight: string;
  unit: "lb" | "kg";
}

export function HomeDashboard({
  tiles,
  selectedProfile,
  customTileIds,
  onOpenTile,
  onOpenSettings,
  onProfileChange,
  onCustomTileIdsChange
}: HomeDashboardProps) {
  const [measurements] = useLocalStorage<BodyMeasurementSummary[]>("ybw.bodyMeasurements", []);
  const [weightLogs] = useLocalStorage<WeightSummary[]>("ybw.weightLogs", []);
  const [dailyTrackers, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const [lastDailyDate, setLastDailyDate] = useLocalStorage("ybw.lastDailyTrackingDate", todayKey());
  const [userProfile] = useLocalStorage("ybw.userProfile", emptyUserProfile);
  const [profileSetupComplete, setProfileSetupComplete] = useLocalStorage("ybw.profileSetupComplete", false);
  const visibleTileIds = new Set(tiles.map((tile) => tile.id));
  const latestMeasurement = [...measurements].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const latestWeight = [...weightLogs].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const today = todayKey();
  const todayTracker = getDailyTracker(dailyTrackers, today);
  const dailyHistory = Object.values(dailyTrackers)
    .filter((entry) => entry.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);
  const showCycle = selectedProfile === "female" || (selectedProfile === "custom" && customTileIds.includes("period"));
  const displayName = userProfile.preferredName || userProfile.displayName || profileSummary.name;
  const displayWeight = userProfile.weight || (latestWeight ? `${latestWeight.weight} ${latestWeight.unit}` : "");
  const displayBmi = formatBmi(displayWeight, userProfile.height);
  const avatarEmoji = userProfile.avatarEmoji || "✨";
  const showAvatarImage = userProfile.avatarType === "image" && Boolean(userProfile.avatarImage);

  useEffect(() => {
    setDailyTrackers((current) => (current[today] ? current : mergeDailyTracker(current, today, {})));

    if (lastDailyDate !== today) {
      setLastDailyDate(today);
    }
  }, [lastDailyDate, setDailyTrackers, setLastDailyDate, today]);

  const updateToday = (updates: Partial<DailyTrackerEntry>) => {
    setDailyTrackers((current) => mergeDailyTracker(current, today, updates));
  };

  const setNumberField = (field: "water" | "protein" | "fiber", value: string) => {
    updateToday({ [field]: Number.parseFloat(value) || 0 });
  };

  const resetToday = () => {
    if (window.confirm("Reset today's daily tracker values? This will not delete saved entries or daily history.")) {
      setDailyTrackers((current) => resetDailyTracker(current, today));
    }
  };

  const snapshotItems = [
    { label: "Date", value: today, detail: "Daily values reset by date" },
    { label: "Mood", value: todayTracker.mood, detail: todayTracker.mood === "not checked in" ? "Add a mood check-in" : "Mood checked in" },
    { label: "Water intake", value: `${todayTracker.water} oz`, detail: "Goal: 80 oz" },
    { label: "Medication status", value: todayTracker.medicationStatus, detail: todayTracker.medicationStatus === "taken" ? "Marked for today" : "Not marked yet" },
    ...(showCycle ? [{ label: "Cycle day", value: "Add note", detail: "Track in Period Tracker" }] : []),
    { label: "Workout status", value: todayTracker.workoutStatus, detail: todayTracker.workoutStatus === "not logged" ? "No workout logged" : "Movement logged" },
    { label: "Food", value: todayTracker.foodNotes, detail: "Today only" },
    { label: "Alcohol", value: todayTracker.alcohol, detail: "Today only" },
    { label: "Reminders", value: todayTracker.reminderCompletion, detail: "Today only" }
  ];

  return (
    <main className="grid gap-5">
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
          <div className="mt-4">
            <p className="text-sm font-semibold text-white">Main goals</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profileSummary.mainGoals.map((goal) => (
                <span key={goal} className="rounded-full border border-lavender/20 bg-lavender/10 px-3 py-1 text-xs text-lavender">
                  {goal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!profileSetupComplete ? (
        <LoginPreview
          selectedProfile={selectedProfile}
          customTileIds={customTileIds}
          onProfileChange={onProfileChange}
          onCustomTileIdsChange={onCustomTileIdsChange}
          showProfileSelector
          onSaved={() => setProfileSetupComplete(true)}
        />
      ) : (
        <SectionCard title="Wellness profile saved" description={`${getProfileLabel(selectedProfile)} is active. Your history and trackers stay saved under your account on this device.`}>
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
          >
            Manage profile
          </button>
        </SectionCard>
      )}

      <section className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-ice">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua/75">Daily Snapshot</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Today at a glance</h2>
          </div>
          <ShieldCheck size={22} className="text-ice" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {snapshotItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
              <p className="text-xs text-periwinkle/70">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-[0.72rem] leading-4 text-periwinkle/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <ProgressRing label="Daily consistency" value={todayTracker.dailyConsistency} caption={`${today}: today's daily tracker`} />
        <div className="grid gap-3 sm:col-span-2">
          <ProgressBar label="Water" value={Math.min(100, Math.round((todayTracker.water / 80) * 100))} detail={`${todayTracker.water} oz of 80 oz target`} tone="aqua" />
          <ProgressBar label="Protein" value={Math.min(100, Math.round((todayTracker.protein / 110) * 100))} detail={`${todayTracker.protein} g of 110 g target`} tone="lavender" />
          <ProgressBar label="Fiber" value={Math.min(100, Math.round((todayTracker.fiber / 25) * 100))} detail={`${todayTracker.fiber} g of 25 g target`} tone="blue" />
        </div>
      </div>

      <SectionCard title="Today's daily trackers" description="These values are stored by date and reset automatically when a new day starts.">
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <FormField label="Water" type="number" value={todayTracker.water ? String(todayTracker.water) : ""} onChange={(value) => setNumberField("water", value)} placeholder="oz" />
            <FormField label="Protein" type="number" value={todayTracker.protein ? String(todayTracker.protein) : ""} onChange={(value) => setNumberField("protein", value)} placeholder="grams" />
            <FormField label="Fiber" type="number" value={todayTracker.fiber ? String(todayTracker.fiber) : ""} onChange={(value) => setNumberField("fiber", value)} placeholder="grams" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Mood" value={todayTracker.mood} onChange={(value) => updateToday({ mood: value || "not checked in" })} />
            <FormField label="Medication status" value={todayTracker.medicationStatus} onChange={(value) => updateToday({ medicationStatus: value.toLowerCase().includes("taken") ? "taken" : "not taken" })} />
            <FormField label="Workout status" value={todayTracker.workoutStatus} onChange={(value) => updateToday({ workoutStatus: value || "not logged" })} />
            <FormField label="Alcohol" value={todayTracker.alcohol} onChange={(value) => updateToday({ alcohol: value || "none logged" })} />
            <FormField label="Food notes" value={todayTracker.foodNotes} onChange={(value) => updateToday({ foodNotes: value || "none logged" })} />
            <FormField label="Reminder completion" value={todayTracker.reminderCompletion} onChange={(value) => updateToday({ reminderCompletion: value || "not checked" })} />
          </div>
          <button
            type="button"
            onClick={resetToday}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lavender/25 bg-lavender/10 px-4 text-sm font-semibold text-lavender"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Reset Today
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Daily History" description="Previous daily tracker entries are kept by date.">
        {dailyHistory.length ? (
          <div className="grid gap-3">
            {dailyHistory.map((entry) => (
              <article key={entry.date} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{entry.date}</h3>
                    <p className="mt-1 text-xs text-lavender/80">{entry.dailyConsistency}% daily consistency</p>
                  </div>
                  <p className="text-xs text-periwinkle/70">{entry.medicationStatus}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-periwinkle/85">
                  Water {entry.water} oz | Protein {entry.protein} g | Fiber {entry.fiber} g | Mood {entry.mood} | Workout {entry.workoutStatus}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-midnight/45 p-4 text-sm text-periwinkle/85">No daily history yet. Tomorrow, today's tracker will appear here.</p>
        )}
      </SectionCard>

      {visibleTileIds.has("measurements") && latestMeasurement ? (
        <section className="rounded-[1.75rem] border border-ice/20 bg-ice/10 p-4 shadow-ice">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice/75">Latest Measurements</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{latestMeasurement.date || "Latest entry"}</h2>
            </div>
            <button
              type="button"
              onClick={() => onOpenTile("measurements")}
              className="min-h-11 rounded-2xl border border-lavender/25 bg-lavender/15 px-3 text-sm font-semibold text-lavender"
            >
              Open
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ["Bust/chest", latestMeasurement.bustChest],
              ["Waist", latestMeasurement.waist],
              ["Hips", latestMeasurement.hips],
              ["Inseam", latestMeasurement.inseam],
              ["Shoe", latestMeasurement.shoeSize],
              ["Bra", latestMeasurement.braSize]
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
                  <p className="text-[0.72rem] text-periwinkle/70">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender/75">Tiles</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Choose an area</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <TileCard key={tile.id} tile={tile} onOpen={onOpenTile} />
          ))}
        </div>
      </section>

      <ReportsPanel />
      {profileSetupComplete ? <LoginPreview /> : null}
    </main>
  );
}
