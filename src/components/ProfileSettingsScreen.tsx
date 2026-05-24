import { ShieldCheck } from "lucide-react";
import type { WellnessProfileId } from "../data/wellnessProfiles";
import type { TileId } from "../types/wellness";
import { LoginPreview } from "./LoginPreview";
import { ProblemReportPanel } from "./ProblemReportPanel";
import { SectionCard } from "./SectionCard";

interface ProfileSettingsScreenProps {
  selectedProfile: WellnessProfileId;
  customTileIds: TileId[];
  onProfileChange: (profile: WellnessProfileId) => void;
  onCustomTileIdsChange: (tileIds: TileId[]) => void;
}

export function ProfileSettingsScreen({
  selectedProfile,
  customTileIds,
  onProfileChange,
  onCustomTileIdsChange
}: ProfileSettingsScreenProps) {
  return (
    <div className="grid gap-4">
      <LoginPreview
        selectedProfile={selectedProfile}
        customTileIds={customTileIds}
        onProfileChange={onProfileChange}
        onCustomTileIdsChange={onCustomTileIdsChange}
        showProfileSelector
      />

      <SectionCard title="Body Measurements / Shopping Reference" description="Body Measurements can stay visible in any profile and can be turned on or off in Custom.">
        <div className="rounded-2xl border border-ice/20 bg-ice/10 p-4 text-sm leading-6 text-periwinkle/90">
          Use it for online clothes shopping, fit notes, and body progress tracking. Entries stay local in this browser.
        </div>
      </SectionCard>

      <ProblemReportPanel />

      <SectionCard className="border-ice/20 bg-ice/10">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-ice" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">
            This app is for personal tracking and organization only. It does not diagnose, treat, or replace medical advice.
            Always consult a licensed medical professional.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
