import type { TileId } from "../types/wellness";

export type WellnessProfileId = "female" | "male" | "general" | "custom";

export interface WellnessProfileOption {
  id: WellnessProfileId;
  label: string;
  description: string;
}

export interface CustomTileOption {
  id: TileId;
  label: string;
  group: "Core tiles" | "Optional reproductive / hormone tiles";
}

const dashboardUtilityTileIds: TileId[] = ["daily", "settings"];
const hiddenDashboardTileIds = new Set<TileId>([
  "reports",
  "vitals",
  "food",
  "notes",
  "reminders",
  "photos",
  "cycle-symptoms",
  "birth-control",
  "ovulation",
  "fertility",
  "menopause"
]);

export const wellnessProfileOptions: WellnessProfileOption[] = [
  {
    id: "female",
    label: "Female Wellness",
    description: "General wellness plus optional reproductive, cycle, and hormone tracking."
  },
  {
    id: "male",
    label: "Male Wellness",
    description: "General wellness plus optional hormone, prostate, energy, and recovery tracking."
  },
  {
    id: "general",
    label: "General Wellness",
    description: "Broad wellness tracking without reproductive-specific tiles by default."
  },
  {
    id: "custom",
    label: "Custom",
    description: "Choose exactly which tiles appear on your dashboard."
  }
];

export const coreTileIds: TileId[] = [
  "alcohol",
  "appointments",
  "measurements",
  "daily",
  "documents",
  "hair",
  "health",
  "fitness",
  "labs",
  "medications",
  "mood",
  "recipes",
  "settings",
  "skin",
  "weight"
];

export const femaleTileIds: TileId[] = [
  ...coreTileIds,
  "period",
  "hormone-notes",
];

export const maleTileIds: TileId[] = [
  ...coreTileIds,
  "testosterone",
  "muscle-strength",
  "mens-health",
  "prostate",
  "libido-energy-mood",
  "hair-loss",
  "sleep-recovery",
  "hormone-notes"
];

export const generalTileIds: TileId[] = [...coreTileIds];

export const defaultCustomTileIds: TileId[] = [...coreTileIds];

export const customTileOptions: CustomTileOption[] = [
  { id: "daily", label: "Daily Snapshot", group: "Core tiles" },
  { id: "settings", label: "Account / Profile", group: "Core tiles" },
  { id: "alcohol", label: "Alcohol Tracker", group: "Core tiles" },
  { id: "appointments", label: "Doctor Appointments", group: "Core tiles" },
  { id: "measurements", label: "Body Measurements", group: "Core tiles" },
  { id: "documents", label: "Documents & Uploads", group: "Core tiles" },
  { id: "fitness", label: "Fitness", group: "Core tiles" },
  { id: "hair", label: "Hair Care", group: "Core tiles" },
  { id: "health", label: "Health & Vitals", group: "Core tiles" },
  { id: "labs", label: "Bloodwork / Labs", group: "Core tiles" },
  { id: "medications", label: "Medications & Supplements", group: "Core tiles" },
  { id: "mood", label: "Mood / Mental Health + Notes", group: "Core tiles" },
  { id: "recipes", label: "Recipes", group: "Core tiles" },
  { id: "skin", label: "Skin & Beauty", group: "Core tiles" },
  { id: "weight", label: "Weight / BMI", group: "Core tiles" },
  { id: "period", label: "Period Tracker", group: "Optional reproductive / hormone tiles" },
  { id: "hormone-notes", label: "Hormone & Cycle Notes", group: "Optional reproductive / hormone tiles" },
  { id: "testosterone", label: "Testosterone Tracker", group: "Optional reproductive / hormone tiles" },
  { id: "muscle-strength", label: "Muscle / Strength Progress", group: "Optional reproductive / hormone tiles" },
  { id: "mens-health", label: "Men's Health", group: "Optional reproductive / hormone tiles" },
  { id: "prostate", label: "Prostate Health Notes", group: "Optional reproductive / hormone tiles" },
  { id: "libido-energy-mood", label: "Libido / Energy / Mood Tracking", group: "Optional reproductive / hormone tiles" },
  { id: "hair-loss", label: "Hair Loss Notes", group: "Optional reproductive / hormone tiles" },
  { id: "sleep-recovery", label: "Sleep / Recovery", group: "Optional reproductive / hormone tiles" }
];

export function getTileIdsForProfile(profile: WellnessProfileId, customTileIds: TileId[]) {
  if (profile === "female") return femaleTileIds;
  if (profile === "male") return maleTileIds;
  if (profile === "custom") {
    return Array.from(new Set([...dashboardUtilityTileIds, ...customTileIds.filter((tileId) => !hiddenDashboardTileIds.has(tileId))]));
  }
  return generalTileIds;
}

export function getProfileLabel(profile: WellnessProfileId) {
  return wellnessProfileOptions.find((option) => option.id === profile)?.label ?? "General Wellness";
}
