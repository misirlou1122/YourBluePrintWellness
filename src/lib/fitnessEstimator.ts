export type FitnessActivityType = "cardio" | "strength" | "mind-body";

export interface FitnessSetEntry {
  id: string;
  reps: string;
  weight: string;
}

export interface FitnessActivityEntry {
  id: string;
  optionId: string;
  type: FitnessActivityType;
  name: string;
  minutes: string;
  met?: number;
  speed?: string;
  incline?: string;
  sets?: FitnessSetEntry[];
}

export interface FitnessActivityOption {
  id: string;
  label: string;
  type: FitnessActivityType;
  defaultMinutes: string;
  met: number;
  defaultSpeed?: string;
  defaultIncline?: string;
  defaultWeights?: string[];
}

export interface QuickWorkoutOption {
  id: string;
  label: string;
  activityOptionId?: string;
}

export const quickWorkoutOptions: QuickWorkoutOption[] = [
  { id: "treadmill", label: "Treadmill", activityOptionId: "treadmill-walk" },
  { id: "strength-machines", label: "Strength machines" },
  { id: "pilates", label: "Pilates", activityOptionId: "pilates-mat" },
  { id: "yoga", label: "Yoga", activityOptionId: "yoga-gentle" },
  { id: "stretching", label: "Stretching", activityOptionId: "stretching-mobility" },
  { id: "recovery", label: "Recovery" }
];

export const cardioOptions: FitnessActivityOption[] = [
  { id: "treadmill-walk", label: "Treadmill walk", type: "cardio", defaultMinutes: "30", met: 3.4 },
  { id: "outdoor-walk", label: "Outdoor walk", type: "cardio", defaultMinutes: "30", met: 3.3 },
  { id: "elliptical", label: "Elliptical", type: "cardio", defaultMinutes: "30", met: 5 },
  { id: "stationary-bike", label: "Stationary bike", type: "cardio", defaultMinutes: "30", met: 4.8 },
  { id: "swimming", label: "Swimming", type: "cardio", defaultMinutes: "30", met: 6 }
];

export const strengthMachineOptions: FitnessActivityOption[] = [
  { id: "inner-outer-thighs", label: "Inner / outer thighs", type: "strength", defaultMinutes: "12", met: 3.5, defaultWeights: ["25", "30", "45"] },
  { id: "leg-press", label: "Leg press", type: "strength", defaultMinutes: "12", met: 3.8, defaultWeights: ["25", "25", "25"] },
  { id: "leg-extension", label: "Leg extension", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["25", "30", "35"] },
  { id: "leg-curl", label: "Leg curl", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["25", "30", "35"] },
  { id: "glute-kickback", label: "Glute kickback", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["20", "25", "30"] },
  { id: "calf-raise", label: "Calf raise", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["25", "35", "45"] },
  { id: "chest-press", label: "Chest press", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["20", "25", "30"] },
  { id: "lat-pulldown", label: "Lat pulldown", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["30", "35", "40"] },
  { id: "seated-row", label: "Seated row", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["25", "30", "35"] },
  { id: "shoulder-press", label: "Shoulder press", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["15", "20", "25"] },
  { id: "core-machine", label: "Core machine", type: "strength", defaultMinutes: "10", met: 3.5, defaultWeights: ["20", "25", "30"] }
];

export const mindBodyOptions: FitnessActivityOption[] = [
  { id: "pilates-mat", label: "Pilates", type: "mind-body", defaultMinutes: "45", met: 3 },
  { id: "pilates-reformer", label: "Reformer Pilates", type: "mind-body", defaultMinutes: "45", met: 3.5 },
  { id: "yoga-gentle", label: "Gentle yoga", type: "mind-body", defaultMinutes: "30", met: 2.5 },
  { id: "yoga-flow", label: "Yoga flow", type: "mind-body", defaultMinutes: "45", met: 3.3 },
  { id: "stretching-mobility", label: "Stretching", type: "mind-body", defaultMinutes: "20", met: 2.3 }
];

export const fitnessActivityOptions = [...cardioOptions, ...strengthMachineOptions, ...mindBodyOptions];

export function getFitnessActivityOption(optionId: string) {
  return fitnessActivityOptions.find((option) => option.id === optionId);
}

export function buildFitnessActivity(option: FitnessActivityOption, id: string, setIds: string[] = []): FitnessActivityEntry {
  return {
    id,
    optionId: option.id,
    type: option.type,
    name: option.label,
    minutes: option.defaultMinutes,
    met: option.met,
    speed: option.defaultSpeed,
    incline: option.defaultIncline,
    sets:
      option.type === "strength"
        ? (option.defaultWeights ?? ["25", "25", "25"]).map((weight, index) => ({
            id: setIds[index] ?? `${id}-set-${index + 1}`,
            reps: "10",
            weight
          }))
        : undefined
  };
}

export function parsePositiveNumber(value: string | number | undefined | null) {
  const numeric = Number.parseFloat(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function treadmillMet(activity: FitnessActivityEntry) {
  const speedMph = parsePositiveNumber(activity.speed) || 2.5;
  const inclinePercent = parsePositiveNumber(activity.incline);
  const metersPerMinute = speedMph * 26.8224;
  const grade = inclinePercent / 100;
  const vo2 =
    speedMph >= 5
      ? 0.2 * metersPerMinute + 0.9 * metersPerMinute * grade + 3.5
      : 0.1 * metersPerMinute + 1.8 * metersPerMinute * grade + 3.5;

  return Math.max(1.5, vo2 / 3.5);
}

export function calculateActivityMet(activity: FitnessActivityEntry) {
  if (activity.optionId === "treadmill-walk") {
    return treadmillMet(activity);
  }

  return activity.met ?? getFitnessActivityOption(activity.optionId)?.met ?? 3;
}

export function calculateActivityCalories(activity: FitnessActivityEntry, weightPounds: number) {
  const minutes = parsePositiveNumber(activity.minutes);
  if (!minutes || !weightPounds) return 0;

  const weightKg = weightPounds / 2.20462;
  return Math.round(((calculateActivityMet(activity) * 3.5 * weightKg) / 200) * minutes);
}

export function calculateWorkoutCalories(activities: FitnessActivityEntry[], weightPounds: number) {
  return activities.reduce((total, activity) => total + calculateActivityCalories(activity, weightPounds), 0);
}

export function summarizeWorkout(activities: FitnessActivityEntry[], selectedPlanIds: string[] = []) {
  if (activities.length) {
    return activities.map((activity) => activity.name).join(" + ");
  }

  return selectedPlanIds
    .map((planId) => quickWorkoutOptions.find((option) => option.id === planId)?.label)
    .filter((label): label is string => Boolean(label))
    .join(" + ");
}
