import { ShieldCheck, Sparkles } from "lucide-react";
import { dailySnapshot, profileSummary, wellnessTiles } from "../data/wellness";
import type { TileId } from "../types/wellness";
import { LoginPreview } from "./LoginPreview";
import { ProgressBar } from "./ProgressBar";
import { ProgressRing } from "./ProgressRing";
import { ReportsPanel } from "./ReportsPanel";
import { TileCard } from "./TileCard";

interface HomeDashboardProps {
  onOpenTile: (id: TileId) => void;
}

export function HomeDashboard({ onOpenTile }: HomeDashboardProps) {
  return (
    <main className="grid gap-5">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white">Private wellness blueprint</h1>
            <p className="mt-2 text-sm leading-6 text-periwinkle/85">Mobile-first sample dashboard for yourblueprintwellness.com.</p>
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
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Sex: {profileSummary.sex}</span>
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

      <section className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-ice">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua/75">Daily Snapshot</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Today at a glance</h2>
          </div>
          <ShieldCheck size={22} className="text-ice" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {dailySnapshot.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
              <p className="text-xs text-periwinkle/70">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-[0.72rem] leading-4 text-periwinkle/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <ProgressRing label="Daily consistency" value={72} caption="Sample glow ring for habits and reminders." />
        <div className="grid gap-3 sm:col-span-2">
          <ProgressBar label="Water" value={70} detail="56 oz of 80 oz sample target" tone="aqua" />
          <ProgressBar label="Protein" value={62} detail="68 g of 110 g sample target" tone="lavender" />
          <ProgressBar label="Fiber" value={48} detail="12 g of 25 g sample target" tone="blue" />
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender/75">Tiles</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Choose an area</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wellnessTiles.map((tile) => (
            <TileCard key={tile.id} tile={tile} onOpen={onOpenTile} />
          ))}
        </div>
      </section>

      <ReportsPanel />
      <LoginPreview />
    </main>
  );
}
