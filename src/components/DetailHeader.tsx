import { Home } from "lucide-react";
import type { WellnessTile } from "../types/wellness";
import { tileIcons } from "./icons";

interface DetailHeaderProps {
  tile: WellnessTile;
  onHome: () => void;
}

export function DetailHeader({ tile, onHome }: DetailHeaderProps) {
  const Icon = tileIcons[tile.icon] ?? tileIcons.sparkles;

  return (
    <section className="max-w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 shadow-lavender backdrop-blur-xl sm:rounded-[2rem] sm:p-5">
      <button
        type="button"
        onClick={onHome}
        className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-ice/20 bg-ice/10 px-4 text-sm font-semibold text-ice transition hover:bg-ice/15"
      >
        <Home size={18} aria-hidden="true" />
        Return Home
      </button>
      <div className="mt-5 flex min-w-0 items-start gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-lavender/25 bg-gradient-to-br from-sapphire/45 via-lavender/25 to-aqua/20 text-ice shadow-lavender">
          <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lavender/75">Section</p>
          <h1 className="mt-1 text-2xl font-semibold leading-tight text-white sm:text-3xl">{tile.title}</h1>
          <p className="mt-2 text-sm leading-6 text-periwinkle/85">{tile.subtitle}</p>
        </div>
      </div>
    </section>
  );
}
