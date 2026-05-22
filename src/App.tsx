import { useMemo, useState } from "react";
import { profileSettingsTile, wellnessTiles } from "./data/wellness";
import { defaultCustomTileIds, getTileIdsForProfile, type WellnessProfileId } from "./data/wellnessProfiles";
import type { TileId } from "./types/wellness";
import { useLocalStorage } from "./lib/useLocalStorage";
import { HomeDashboard } from "./components/HomeDashboard";
import { MedicalDisclaimer } from "./components/MedicalDisclaimer";
import { PublicLanding } from "./components/PublicLanding";
import { SectionPage } from "./components/SectionPage";

function App() {
  const isPrivateApp = typeof window === "undefined" ? true : window.location.pathname.startsWith("/app");
  const [activeTileId, setActiveTileId] = useState<TileId | "home">("home");
  const [selectedProfile, setSelectedProfile] = useLocalStorage<WellnessProfileId>("ybw.wellnessProfile", "female");
  const [customTileIds, setCustomTileIds] = useLocalStorage<TileId[]>("ybw.customTileIds", defaultCustomTileIds);

  const visibleTiles = useMemo(() => {
    const selectedTileIds = getTileIdsForProfile(selectedProfile, customTileIds);
    const selectedSet = new Set(selectedTileIds);
    return wellnessTiles.filter((tile) => selectedSet.has(tile.id));
  }, [customTileIds, selectedProfile]);

  const allTiles = useMemo(() => [...wellnessTiles, profileSettingsTile], []);

  const activeIndex = useMemo(
    () => visibleTiles.findIndex((tile) => tile.id === activeTileId),
    [activeTileId, visibleTiles]
  );
  const activeTile = activeTileId === "home" ? undefined : allTiles.find((tile) => tile.id === activeTileId);
  const previousTile = activeIndex > 0 ? visibleTiles[activeIndex - 1] : undefined;
  const nextTile = activeIndex >= 0 && activeIndex < visibleTiles.length - 1 ? visibleTiles[activeIndex + 1] : undefined;
  const printedDate = new Date().toLocaleDateString();

  if (!isPrivateApp) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(145deg,#05081d_0%,#09153b_42%,#171046_74%,#05081d_100%)] text-white">
        <PublicLanding />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(145deg,#05081d_0%,#09153b_42%,#171046_74%,#05081d_100%)] text-white">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-[env(safe-area-inset-bottom)] pt-4 sm:px-6 lg:px-8">
        <div className="print-only mb-4 border-b border-gray-300 pb-3 text-sm">
          <strong>Your Blueprint Wellness</strong>
          <span className="block">Date printed: {printedDate}</span>
        </div>
        {activeTile ? (
          <SectionPage
            tile={activeTile}
            previousTile={previousTile}
            nextTile={nextTile}
            onHome={() => setActiveTileId("home")}
            onOpenTile={setActiveTileId}
            selectedProfile={selectedProfile}
            customTileIds={customTileIds}
            onProfileChange={setSelectedProfile}
            onCustomTileIdsChange={setCustomTileIds}
          />
        ) : (
          <HomeDashboard
            tiles={visibleTiles}
            selectedProfile={selectedProfile}
            customTileIds={customTileIds}
            onOpenTile={setActiveTileId}
            onOpenSettings={() => setActiveTileId("settings")}
            onProfileChange={setSelectedProfile}
            onCustomTileIdsChange={setCustomTileIds}
          />
        )}
        <MedicalDisclaimer />
      </div>
    </div>
  );
}

export default App;
