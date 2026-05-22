export type TileId =
  | "health"
  | "labs"
  | "appointments"
  | "medications"
  | "vitals"
  | "fitness"
  | "food"
  | "alcohol"
  | "period"
  | "mood"
  | "skin"
  | "hair"
  | "recipes"
  | "documents"
  | "notes"
  | "reminders"
  | "photos";

export type TrendDirection = "up" | "down" | "stable";

export interface DailySnapshotItem {
  label: string;
  value: string;
  detail: string;
}

export interface ProfileSummary {
  name: string;
  age: string;
  height: string;
  sex: string;
  mainGoals: string[];
}

export interface MetricTrend {
  label: string;
  current: string;
  previous: string;
  goal: string;
  trend: TrendDirection;
  date: string;
  notes: string;
}

export interface FeatureCard {
  title: string;
  body: string;
  meta?: string;
}

export interface FeatureGroup {
  title: string;
  description: string;
  fields?: string[];
  checklist?: string[];
  cards?: FeatureCard[];
}

export interface WellnessTile {
  id: TileId;
  title: string;
  subtitle: string;
  icon: string;
  subcategories: string[];
  groups: FeatureGroup[];
  metrics?: MetricTrend[];
  futureNotes?: string[];
}

export interface ReportExport {
  title: string;
  description: string;
}
