import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { profileSettingsTile, wellnessTiles } from "./data/wellness";
import { defaultCustomTileIds, getTileIdsForProfile, type WellnessProfileId } from "./data/wellnessProfiles";
import type { TileId } from "./types/wellness";
import { useLocalStorage } from "./lib/useLocalStorage";
import { useSupabaseAuth } from "./lib/useSupabaseAuth";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AuthScreen } from "./components/AuthScreen";
import { HomeDashboard } from "./components/HomeDashboard";
import { MedicalDisclaimer } from "./components/MedicalDisclaimer";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { PublicLanding } from "./components/PublicLanding";
import { SectionPage } from "./components/SectionPage";

function tileFromUrl(): TileId | "home" {
  if (typeof window === "undefined") return "home";
  const tile = new URLSearchParams(window.location.search).get("tile");
  return tile ? (tile as TileId) : "home";
}

function PrivateDashboard({ user }: { user: User }) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("ybw.currentUserId", user.id);
  }

  const [activeTileId, setActiveTileId] = useState<TileId | "home">(tileFromUrl);
  const [storedProfile, setSelectedProfile] = useLocalStorage<WellnessProfileId>("ybw.wellnessProfile", "female");
  const [storedCustomTileIds, setCustomTileIds] = useLocalStorage<TileId[]>("ybw.customTileIds", defaultCustomTileIds);
  const selectedProfile: WellnessProfileId = ["female", "male", "general", "custom"].includes(storedProfile) ? storedProfile : "female";
  const customTileIds = Array.isArray(storedCustomTileIds) ? storedCustomTileIds : defaultCustomTileIds;

  const allTiles = useMemo(() => [...wellnessTiles, profileSettingsTile], []);

  const visibleTiles = useMemo(() => {
    const selectedTileIds = getTileIdsForProfile(selectedProfile, customTileIds);
    return selectedTileIds
      .map((tileId) => allTiles.find((tile) => tile.id === tileId))
      .filter((tile): tile is NonNullable<typeof tile> => Boolean(tile));
  }, [allTiles, customTileIds, selectedProfile]);

  const activeIndex = useMemo(
    () => visibleTiles.findIndex((tile) => tile.id === activeTileId),
    [activeTileId, visibleTiles]
  );
  const activeTile = activeTileId === "home" ? undefined : allTiles.find((tile) => tile.id === activeTileId);
  const previousTile = activeIndex > 0 ? visibleTiles[activeIndex - 1] : undefined;
  const nextTile = activeIndex >= 0 && activeIndex < visibleTiles.length - 1 ? visibleTiles[activeIndex + 1] : undefined;
  const printedDate = new Date().toLocaleDateString();
  const openTile = (tileId: TileId | "home") => {
    setActiveTileId(tileId);
    if (typeof window !== "undefined") {
      const nextUrl = tileId === "home" ? "/app" : `/app?tile=${encodeURIComponent(tileId)}`;
      if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
        window.history.pushState({}, "", nextUrl);
      }
    }
  };

  useEffect(() => {
    const syncTileFromHistory = () => setActiveTileId(tileFromUrl());
    window.addEventListener("popstate", syncTileFromHistory);
    return () => window.removeEventListener("popstate", syncTileFromHistory);
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl overflow-x-hidden px-3 pb-[env(safe-area-inset-bottom)] pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div className="print-only mb-4 border-b border-gray-300 pb-3 text-sm">
        <strong>Your Blueprint Wellness</strong>
        <span className="block">Date printed: {printedDate}</span>
      </div>
      {activeTile ? (
        <SectionPage
          tile={activeTile}
          previousTile={previousTile}
          nextTile={nextTile}
          onHome={() => openTile("home")}
          onOpenTile={openTile}
          selectedProfile={selectedProfile}
          customTileIds={customTileIds}
          onProfileChange={setSelectedProfile}
          onCustomTileIdsChange={setCustomTileIds}
        />
      ) : (
        <HomeDashboard
          tiles={visibleTiles}
          selectedProfile={selectedProfile}
          onOpenTile={openTile}
        />
      )}
      <MedicalDisclaimer />
    </div>
  );
}

function App() {
  const [path, setPath] = useState(() => (typeof window === "undefined" ? "/" : window.location.pathname));
  const { loading, session, user } = useSupabaseAuth();

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  const navigate = (nextPath: string) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  let content;
  if (path === "/login") {
    content = session && user ? <PrivateDashboard key={user.id} user={user} /> : <AuthScreen initialMode="login" onNavigate={navigate} />;
  } else if (path === "/signup") {
    content = session && user ? <PrivateDashboard key={user.id} user={user} /> : <AuthScreen initialMode="signup" onNavigate={navigate} />;
  } else if (path === "/reset-password") {
    content = <AuthScreen initialMode="reset" onNavigate={navigate} />;
  } else if (path === "/privacy") {
    content = <PrivacyPolicy onNavigate={navigate} />;
  } else if (path.startsWith("/app")) {
    if (loading) {
      content = (
        <main className="mx-auto grid min-h-screen w-full max-w-3xl content-center px-4 text-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-lavender">
            <p className="text-sm font-semibold text-ice">Checking sign-in...</p>
          </div>
        </main>
      );
    } else if (session && user) {
      content = <PrivateDashboard key={user.id} user={user} />;
    } else {
      content = <AuthScreen initialMode="login" onNavigate={navigate} />;
    }
  } else {
    content = <PublicLanding onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f5f0] text-white">
      <AppErrorBoundary>{content}</AppErrorBoundary>
    </div>
  );
}

export default App;
