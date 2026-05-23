import { ArrowUpRight } from "lucide-react";
import type { WellnessTile } from "../types/wellness";
import { tileIcons } from "./icons";

interface TileCardProps {
  tile: WellnessTile;
  onOpen: (id: WellnessTile["id"]) => void;
}

export function TileCard({ tile, onOpen }: TileCardProps) {
  const Icon = tileIcons[tile.icon] ?? tileIcons.sparkles;

  return (
    <button
      type="button"
      onClick={() => onOpen(tile.id)}
      className="group min-h-32 rounded-[1.65rem] border border-periwinkle/25 bg-gradient-to-br from-deepblue/95 via-[#181447]/95 to-midnight/95 p-4 text-left shadow-glow outline-none transition duration-300 hover:-translate-y-0.5 hover:border-lavender/70 hover:from-deepblue hover:via-[#20185c] hover:to-midnight focus-visible:ring-2 focus-visible:ring-ice/80 active:scale-[0.99]"
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-sapphire/45 via-lavender/25 to-aqua/20 text-ice shadow-lavender">
            <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-ice/85 transition group-hover:text-white">
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
        <div>
          <h3 className="text-base font-semibold leading-6 text-white">{tile.title}</h3>
          <p className="mt-1 text-sm leading-5 text-periwinkle/82">{tile.subtitle}</p>
        </div>
      </div>
    </button>
  );
}
