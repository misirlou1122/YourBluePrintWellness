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
      className="group aspect-square min-h-0 rounded-[1.15rem] border border-periwinkle/20 bg-gradient-to-br from-deepblue/95 via-[#181447]/95 to-midnight/95 p-2 text-center shadow-glow outline-none transition duration-300 hover:-translate-y-0.5 hover:border-lavender/60 hover:from-deepblue hover:via-[#20185c] hover:to-midnight focus-visible:ring-2 focus-visible:ring-ice/80 active:scale-[0.99] sm:aspect-auto sm:min-h-32 sm:rounded-[1.65rem] sm:p-4"
    >
      <div className="flex h-full flex-col items-center justify-center gap-2 sm:gap-3">
        <div className="flex items-center justify-center">
          <div className="grid size-9 place-items-center rounded-[1rem] border border-white/15 bg-gradient-to-br from-sapphire/45 via-lavender/25 to-aqua/20 text-ice shadow-lavender sm:size-12 sm:rounded-2xl">
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-3 text-[0.72rem] font-semibold leading-4 text-white sm:text-base sm:leading-6">{tile.title}</h3>
          <p className="mt-1 hidden text-sm leading-5 text-periwinkle/82 sm:line-clamp-2 sm:block">{tile.subtitle}</p>
        </div>
      </div>
    </button>
  );
}
