import { useMemo, useState } from "react";
import { wellnessTiles } from "./data/wellness";
import type { TileId } from "./types/wellness";
import { HomeDashboard } from "./components/HomeDashboard";
import { MedicalDisclaimer } from "./components/MedicalDisclaimer";
import { SectionPage } from "./components/SectionPage";

function App() {
  const [activeTileId, setActiveTileId] = useState<TileId | "home">("home");

  const activeIndex = useMemo(
    () => wellnessTiles.findIndex((tile) => tile.id === activeTileId),
    [activeTileId]
  );
  const activeTile = activeIndex >= 0 ? wellnessTiles[activeIndex] : undefined;
  const previousTile = activeIndex > 0 ? wellnessTiles[activeIndex - 1] : undefined;
  const nextTile = activeIndex >= 0 && activeIndex < wellnessTiles.length - 1 ? wellnessTiles[activeIndex + 1] : undefined;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(145deg,#05081d_0%,#09153b_42%,#171046_74%,#05081d_100%)] text-white">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-[env(safe-area-inset-bottom)] pt-4 sm:px-6 lg:px-8">
        {activeTile ? (
          <SectionPage
            tile={activeTile}
            previousTile={previousTile}
            nextTile={nextTile}
            onHome={() => setActiveTileId("home")}
            onOpenTile={setActiveTileId}
          />
        ) : (
          <HomeDashboard onOpenTile={setActiveTileId} />
        )}
        <MedicalDisclaimer />
      </div>
    </div>
  );
}

export default App;
