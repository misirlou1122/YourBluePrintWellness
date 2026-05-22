import { ShieldCheck, Sparkles } from "lucide-react";
import { dailySnapshot, profileSummary } from "../data/wellness";
import { getProfileLabel, type WellnessProfileId } from "../data/wellnessProfiles";
import type { TileId, WellnessTile } from "../types/wellness";
import { useLocalStorage } from "../lib/useLocalStorage";
import { LoginPreview } from "./LoginPreview";
import { ProgressBar } from "./ProgressBar";
import { ProgressRing } from "./ProgressRing";
import { ReportsPanel } from "./ReportsPanel";
import { TileCard } from "./TileCard";
import { WellnessProfileSelector } from "./WellnessProfileSelector";

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
  const visibleTileIds = new Set(tiles.map((tile) => tile.id));
  const latestMeasurement = [...measurements].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const snapshotItems = dailySnapshot.filter(
    (item) => item.label !== "Cycle day" || selectedProfile === "female" || (selectedProfile === "custom" && customTileIds.includes("period"))
  );

  return (
    <main className="grid gap-5">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white">Private wellness blueprint</h1>
            <p className="mt-2 text-sm leading-6 text-periwinkle/85">Mobile-first wellness tracking for yourblueprintwellness.com.</p>
          </div>
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-lavender/25 bg-lavender/15 text-lavender shadow-lavender">
            <Sparkles size={23} aria-hidden="true" />
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-midnight/50 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-periwinkle/85">
            <span className="rounded-full border border-ice/20 bg-ice/10 px-3 py-1 text-ice">Name: {profileSummary.name}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Age: {profileSummary.age}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Height: {profileSummary.height}</span>
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

      <WellnessProfileSelector
        selectedProfile={selectedProfile}
        customTileIds={customTileIds}
        onProfileChange={onProfileChange}
        onCustomTileIdsChange={onCustomTileIdsChange}
        onOpenSettings={onOpenSettings}
      />

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
        <ProgressRing label="Daily consistency" value={72} caption="A gentle view of habits and reminders." />
        <div className="grid gap-3 sm:col-span-2">
          <ProgressBar label="Water" value={70} detail="56 oz of 80 oz target" tone="aqua" />
          <ProgressBar label="Protein" value={62} detail="68 g of 110 g target" tone="lavender" />
          <ProgressBar label="Fiber" value={48} detail="12 g of 25 g target" tone="blue" />
        </div>
      </div>

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
      <LoginPreview />
    </main>
  );
}
