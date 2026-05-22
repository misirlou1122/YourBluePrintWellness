import { CheckCircle2, Settings } from "lucide-react";
import { customTileOptions, getProfileLabel, wellnessProfileOptions, type WellnessProfileId } from "../data/wellnessProfiles";
import type { TileId } from "../types/wellness";

interface WellnessProfileSelectorProps {
  selectedProfile: WellnessProfileId;
  customTileIds: TileId[];
  onProfileChange: (profile: WellnessProfileId) => void;
  onCustomTileIdsChange: (tileIds: TileId[]) => void;
  onOpenSettings?: () => void;
  showCustomControls?: boolean;
}

const optionGroups = ["Core tiles", "Optional reproductive / hormone tiles"] as const;

export function WellnessProfileSelector({
  selectedProfile,
  customTileIds,
  onProfileChange,
  onCustomTileIdsChange,
  onOpenSettings,
  showCustomControls = true
}: WellnessProfileSelectorProps) {
  const toggleCustomTile = (tileId: TileId) => {
    if (customTileIds.includes(tileId)) {
      onCustomTileIdsChange(customTileIds.filter((id) => id !== tileId));
      return;
    }

    onCustomTileIdsChange([...customTileIds, tileId]);
  };

  return (
    <section className="rounded-[1.75rem] border border-lavender/20 bg-lavender/10 p-4 shadow-lavender">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender/75">Wellness Profile</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{getProfileLabel(selectedProfile)}</h2>
          <p className="mt-2 text-sm leading-6 text-periwinkle/85">
            Choose the tracking areas that fit you. Profiles only show or hide tiles; they do not erase saved entries.
          </p>
        </div>
        {onOpenSettings ? (
          <button
            type="button"
            onClick={onOpenSettings}
            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-2xl border border-ice/20 bg-ice/10 text-ice"
            aria-label="Open wellness profile settings"
          >
            <Settings size={20} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {wellnessProfileOptions.map((option) => {
          const isSelected = selectedProfile === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onProfileChange(option.id)}
              className={`min-h-28 rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-ice/65 bg-ice/15 shadow-ice"
                  : "border-white/10 bg-midnight/45 hover:border-lavender/45 hover:bg-white/[0.07]"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold text-white">{option.label}</span>
                  <span className="mt-2 block text-xs leading-5 text-periwinkle/80">{option.description}</span>
                </span>
                {isSelected ? <CheckCircle2 className="shrink-0 text-ice" size={19} aria-hidden="true" /> : null}
              </span>
            </button>
          );
        })}
      </div>

      {selectedProfile === "custom" && showCustomControls ? (
        <div className="mt-5 grid gap-4">
          {optionGroups.map((group) => (
            <div key={group} className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
              <h3 className="text-sm font-semibold text-white">{group}</h3>
              <div className="mt-3 grid gap-2">
                {customTileOptions
                  .filter((option) => option.group === group)
                  .map((option) => (
                    <label key={option.id} className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-sm text-periwinkle/90">
                      <input
                        type="checkbox"
                        checked={customTileIds.includes(option.id)}
                        onChange={() => toggleCustomTile(option.id)}
                        className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
