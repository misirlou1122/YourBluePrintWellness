import { ChevronDown, ChevronUp, Plus, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { WellnessProfileId } from "../data/wellnessProfiles";
import type { TileId } from "../types/wellness";
import {
  getDailyTracker,
  mergeDailyTracker,
  resetDailyTracker,
  todayKey,
  totalFoodNutrition,
  type DailyFoodEntry,
  type DailyTrackerEntry,
  type DailyTrackerMap,
  type DailyWaterEntry
} from "../lib/dailyTracking";
import { estimateFoodNutrition } from "../lib/nutritionEstimator";
import { createId, useLocalStorage } from "../lib/useLocalStorage";
import { FormField, SelectField } from "./FormField";
import { ProgressBar } from "./ProgressBar";
import { ProgressRing } from "./ProgressRing";
import { SectionCard } from "./SectionCard";

interface DailyTrackersScreenProps {
  selectedProfile: WellnessProfileId;
  customTileIds: TileId[];
}

interface SavedMealProduct {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fiber: number;
  quantityLabel: string;
  createdAt: string;
  updatedAt: string;
  lastLoggedAt?: string;
}

const waterGoal = 80;
const proteinGoal = 110;
const fiberGoal = 25;
const calorieGoal = 2000;

const dailyDefaults = {
  mood: "not checked in",
  medicationStatus: "not taken",
  workoutStatus: "not logged",
  alcohol: "none logged"
};

const moodOptions = [
  { value: "😭 Very low", emoji: "😭", label: "Very low" },
  { value: "😔 Low", emoji: "😔", label: "Low" },
  { value: "😐 Okay", emoji: "😐", label: "Okay" },
  { value: "🙂 Good", emoji: "🙂", label: "Good" },
  { value: "😄 Really happy", emoji: "😄", label: "Really happy" }
];

const alcoholDrinkOptions = [
  "Shot of vodka",
  "Shot of tequila",
  "Vodka soda",
  "Margarita",
  "Vodka Red Bull",
  "Cocktail",
  "Beer",
  "Wine",
  "Hard seltzer",
  "Martini",
  "Mojito",
  "Old fashioned",
  "Bloody Mary",
  "Other"
];

function dailyDisplayValue(value: string, defaultValue: string) {
  return value.trim() ? value : defaultValue;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function formatMacro(value: number, unit: string) {
  return `${formatNumber(Math.round(value * 10) / 10)} ${unit}`;
}

function progress(value: number, goal: number) {
  return Math.min(100, Math.round((value / goal) * 100));
}

function isFilled(value: string, defaultValue: string) {
  return Boolean(value.trim()) && value !== defaultValue;
}

function buildAlcoholSummary(drinkType: string, amount: number) {
  const safeDrinkType = drinkType || alcoholDrinkOptions[0];
  const safeAmount = Math.max(0, amount);
  const amountLabel = `${formatNumber(safeAmount)} standard drink${safeAmount === 1 ? "" : "s"}`;
  return `${amountLabel} | ${safeDrinkType}`;
}

function parsePositiveAmount(value: string) {
  const amount = Number.parseFloat(value.match(/\d+(?:\.\d+)?/)?.[0] ?? "");
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 10) / 10 : 0;
}

function savedProductKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSavedProducts(products: SavedMealProduct[]) {
  return Array.isArray(products) ? products.filter((product) => product?.name?.trim()) : [];
}

function findSavedProduct(input: string, products: SavedMealProduct[]) {
  const normalizedInput = savedProductKey(input);
  if (!normalizedInput) return null;

  return (
    products.find((product) => savedProductKey(product.name) === normalizedInput) ??
    products.find((product) => {
      const productKey = savedProductKey(product.name);
      return productKey.length > 4 && normalizedInput.includes(productKey);
    }) ??
    null
  );
}

function CheckToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm font-semibold text-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
      />
      {label}
    </label>
  );
}

export function DailyTrackersScreen({ selectedProfile, customTileIds }: DailyTrackersScreenProps) {
  const [dailyTrackers, setDailyTrackers] = useLocalStorage<DailyTrackerMap>("ybw.dailyTrackers", {});
  const [lastDailyDate, setLastDailyDate] = useLocalStorage("ybw.lastDailyTrackingDate", todayKey());
  const [manualNutritionOpen, setManualNutritionOpen] = useLocalStorage("ybw.daily.manualNutritionOpen", false);
  const [savedProductsOpen, setSavedProductsOpen] = useLocalStorage("ybw.daily.savedProductsOpen", true);
  const [savedMealProducts, setSavedMealProducts] = useLocalStorage<SavedMealProduct[]>("ybw.savedMealProducts", []);
  const [waterInput, setWaterInput] = useState("");
  const [foodInput, setFoodInput] = useState("");
  const [manualFoodName, setManualFoodName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualFiber, setManualFiber] = useState("");
  const today = todayKey();
  const todayTracker = getDailyTracker(dailyTrackers, today);
  const waterAmount = parsePositiveAmount(waterInput);
  const savedProducts = useMemo(() => normalizeSavedProducts(savedMealProducts), [savedMealProducts]);
  const savedProductMatch = useMemo(() => findSavedProduct(foodInput, savedProducts), [foodInput, savedProducts]);
  const foodEstimate = useMemo(
    () =>
      savedProductMatch
        ? {
            input: foodInput.trim() || savedProductMatch.name,
            matchedFoodName: savedProductMatch.name,
            quantityLabel: savedProductMatch.quantityLabel || "saved serving",
            calories: savedProductMatch.calories,
            protein: savedProductMatch.protein,
            fiber: savedProductMatch.fiber
          }
        : estimateFoodNutrition(foodInput),
    [foodInput, savedProductMatch]
  );
  const manualCaloriesAmount = parsePositiveAmount(manualCalories);
  const manualProteinAmount = parsePositiveAmount(manualProtein);
  const manualFiberAmount = parsePositiveAmount(manualFiber);
  const manualEntryReady = Boolean(manualFoodName.trim()) && Boolean(manualCaloriesAmount || manualProteinAmount || manualFiberAmount);
  const showCycle = selectedProfile === "female" || (selectedProfile === "custom" && customTileIds.includes("period"));
  const medicationChecked = todayTracker.medicationStatus === "taken";
  const workoutChecked = isFilled(todayTracker.workoutStatus, dailyDefaults.workoutStatus);
  const alcoholChecked = isFilled(todayTracker.alcohol, dailyDefaults.alcohol);
  const dailyHistory = Object.keys(dailyTrackers)
    .filter((date) => date !== today)
    .map((date) => getDailyTracker(dailyTrackers, date))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  useEffect(() => {
    setDailyTrackers((current) => (current[today] ? current : mergeDailyTracker(current, today, {})));

    if (lastDailyDate !== today) {
      setLastDailyDate(today);
    }
  }, [lastDailyDate, setDailyTrackers, setLastDailyDate, today]);

  const updateToday = (updates: Partial<DailyTrackerEntry>) => {
    setDailyTrackers((current) => mergeDailyTracker(current, today, updates));
  };

  const saveWaterEntry = () => {
    if (!waterAmount) {
      return;
    }

    const nextWaterEntry: DailyWaterEntry = {
      id: createId("daily-water"),
      amount: waterAmount,
      createdAt: new Date().toISOString()
    };

    setDailyTrackers((current) => {
      const currentEntry = getDailyTracker(current, today);
      return mergeDailyTracker(current, today, {
        waterEntries: [nextWaterEntry, ...currentEntry.waterEntries],
        water: Math.round((currentEntry.water + waterAmount) * 10) / 10
      });
    });
    setWaterInput("");
  };

  const removeWaterEntry = (entryId: string) => {
    setDailyTrackers((current) => {
      const currentEntry = getDailyTracker(current, today);
      const removedEntry = currentEntry.waterEntries.find((entry) => entry.id === entryId);
      const waterEntries = currentEntry.waterEntries.filter((entry) => entry.id !== entryId);
      const nextWater = Math.max(0, currentEntry.water - (removedEntry?.amount ?? 0));
      return mergeDailyTracker(current, today, {
        waterEntries,
        water: Math.round(nextWater * 10) / 10
      });
    });
  };

  const logFoodEntry = (foodEntry: Omit<DailyFoodEntry, "id" | "createdAt">) => {
    const nextFoodEntry: DailyFoodEntry = {
      ...foodEntry,
      id: createId("daily-food"),
      createdAt: new Date().toISOString()
    };

    setDailyTrackers((current) => {
      const currentEntry = getDailyTracker(current, today);
      const foodEntries = [nextFoodEntry, ...currentEntry.foodEntries];
      return mergeDailyTracker(current, today, {
        foodEntries,
        ...totalFoodNutrition(foodEntries)
      });
    });
  };

  const touchSavedProduct = (productId: string) => {
    const now = new Date().toISOString();
    setSavedMealProducts((current) => {
      const products = normalizeSavedProducts(current);
      const product = products.find((item) => item.id === productId);
      if (!product) return products;

      const updatedProduct = { ...product, lastLoggedAt: now, updatedAt: now };
      return [updatedProduct, ...products.filter((item) => item.id !== productId)];
    });
  };

  const upsertSavedMealProduct = (product: Pick<SavedMealProduct, "name" | "calories" | "protein" | "fiber" | "quantityLabel">) => {
    const now = new Date().toISOString();
    const productName = product.name.trim();
    if (!productName) return;

    setSavedMealProducts((current) => {
      const products = normalizeSavedProducts(current);
      const productKey = savedProductKey(productName);
      const existing = products.find((item) => savedProductKey(item.name) === productKey);
      const savedProduct: SavedMealProduct = {
        id: existing?.id ?? createId("saved-food"),
        name: productName,
        quantityLabel: product.quantityLabel || "saved serving",
        calories: Math.round(product.calories),
        protein: product.protein,
        fiber: product.fiber,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        lastLoggedAt: now
      };

      return [savedProduct, ...products.filter((item) => item.id !== existing?.id)].slice(0, 60);
    });
  };

  const logSavedMealProduct = (product: SavedMealProduct) => {
    logFoodEntry({
      input: product.name,
      matchedFoodName: product.name,
      quantityLabel: product.quantityLabel || "saved serving",
      calories: product.calories,
      protein: product.protein,
      fiber: product.fiber
    });
    touchSavedProduct(product.id);
  };

  const removeSavedMealProduct = (productId: string) => {
    setSavedMealProducts((current) => normalizeSavedProducts(current).filter((product) => product.id !== productId));
  };

  const saveFoodEntry = () => {
    if (!foodEstimate) {
      return;
    }

    logFoodEntry(foodEstimate);
    if (savedProductMatch) {
      touchSavedProduct(savedProductMatch.id);
    }
    setFoodInput("");
  };

  const saveManualFoodEntry = () => {
    if (!manualEntryReady) {
      return;
    }

    const label = manualFoodName.trim();
    const nextFoodEntry: DailyFoodEntry = {
      id: createId("daily-food"),
      input: label,
      matchedFoodName: "Manual nutrition entry",
      quantityLabel: "manual entry",
      calories: Math.round(manualCaloriesAmount),
      protein: manualProteinAmount,
      fiber: manualFiberAmount,
      createdAt: new Date().toISOString()
    };

    logFoodEntry(nextFoodEntry);
    upsertSavedMealProduct({
      name: label,
      quantityLabel: "saved serving",
      calories: Math.round(manualCaloriesAmount),
      protein: manualProteinAmount,
      fiber: manualFiberAmount
    });
    setManualFoodName("");
    setManualCalories("");
    setManualProtein("");
    setManualFiber("");
  };

  const removeFoodEntry = (entryId: string) => {
    setDailyTrackers((current) => {
      const currentEntry = getDailyTracker(current, today);
      const foodEntries = currentEntry.foodEntries.filter((entry) => entry.id !== entryId);
      return mergeDailyTracker(current, today, {
        foodEntries,
        ...totalFoodNutrition(foodEntries)
      });
    });
  };

  const updateAlcohol = (drinkType: string, amount: number) => {
    updateToday({
      alcoholDrinkType: drinkType,
      alcoholAmount: amount,
      alcohol: buildAlcoholSummary(drinkType, amount)
    });
  };

  const toggleAlcohol = (checked: boolean) => {
    if (!checked) {
      updateToday({ alcohol: dailyDefaults.alcohol, alcoholDrinkType: "", alcoholAmount: 0 });
      return;
    }

    updateAlcohol(todayTracker.alcoholDrinkType || alcoholDrinkOptions[0], todayTracker.alcoholAmount || 1);
  };

  const resetToday = () => {
    if (window.confirm("Reset today's daily tracker values? This will not delete saved entries or daily history.")) {
      setDailyTrackers((current) => resetDailyTracker(current, today));
      setWaterInput("");
      setFoodInput("");
      setManualFoodName("");
      setManualCalories("");
      setManualProtein("");
      setManualFiber("");
    }
  };

  const snapshotItems = [
    { label: "Date", value: today, detail: "Daily values reset by date" },
    { label: "Mood", value: dailyDisplayValue(todayTracker.mood, dailyDefaults.mood), detail: isFilled(todayTracker.mood, dailyDefaults.mood) ? "Mood checked in" : "Not checked in" },
    { label: "Water intake", value: formatMacro(todayTracker.water, "oz"), detail: `Goal: ${waterGoal} oz` },
    { label: "Protein", value: formatMacro(todayTracker.protein, "g"), detail: "From logged food" },
    { label: "Fiber", value: formatMacro(todayTracker.fiber, "g"), detail: "From logged food" },
    { label: "Calories", value: `${Math.round(todayTracker.calories)} kcal`, detail: "From logged food" },
    { label: "Medication", value: medicationChecked ? "Taken" : dailyDefaults.medicationStatus, detail: medicationChecked ? "Marked for today" : "Not marked yet" },
    ...(showCycle ? [{ label: "Cycle day", value: "Add note", detail: "Track in Period Tracker" }] : []),
    { label: "Workout", value: workoutChecked ? "Completed" : dailyDefaults.workoutStatus, detail: todayTracker.workoutCalories ? `${Math.round(todayTracker.workoutCalories)} kcal estimated` : workoutChecked ? "Marked for today" : "Not marked yet" },
    { label: "Alcohol", value: dailyDisplayValue(todayTracker.alcohol, dailyDefaults.alcohol), detail: alcoholChecked ? "Logged for today" : "None logged" }
  ];

  return (
    <div className="grid gap-4">
      <SectionCard title="Today at a glance" description="A clean snapshot of today's daily tracking.">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua/75">Daily Snapshot</p>
          <ShieldCheck size={22} className="text-ice" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {snapshotItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
              <p className="text-xs text-periwinkle/70">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-[0.72rem] leading-4 text-periwinkle/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-3 lg:grid-cols-4">
        <ProgressRing label="Daily consistency" value={todayTracker.dailyConsistency} caption={`${today}: today's daily tracker`} />
        <div className="grid gap-3 md:grid-cols-2 lg:col-span-3">
          <ProgressBar label="Water" value={progress(todayTracker.water, waterGoal)} detail={`${formatMacro(todayTracker.water, "oz")} of ${waterGoal} oz target`} tone="aqua" />
          <ProgressBar label="Protein" value={progress(todayTracker.protein, proteinGoal)} detail={`${formatMacro(todayTracker.protein, "g")} of ${proteinGoal} g target`} tone="lavender" />
          <ProgressBar label="Fiber" value={progress(todayTracker.fiber, fiberGoal)} detail={`${formatMacro(todayTracker.fiber, "g")} of ${fiberGoal} g target`} tone="blue" />
          <ProgressBar label="Calories" value={progress(todayTracker.calories, calorieGoal)} detail={`${Math.round(todayTracker.calories)} kcal of ${calorieGoal.toLocaleString()} kcal target`} tone="aqua" />
        </div>
      </div>

      <SectionCard title="Today's daily tracker" description="These values save by date and reset automatically when a new day starts.">
        <div className="grid gap-4">
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <FormField label="Water tracker" value={waterInput} onChange={setWaterInput} placeholder="16.9 or 24 ounces" />
              <button
                type="button"
                onClick={saveWaterEntry}
                disabled={!waterAmount}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow disabled:opacity-50 sm:mt-6"
              >
                <Plus size={18} aria-hidden="true" />
                Log water
              </button>
            </div>
            {todayTracker.waterEntries.length ? (
              <div className="grid gap-2">
                {todayTracker.waterEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-midnight/45 p-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{formatMacro(entry.amount, "oz")}</p>
                      <p className="mt-1 text-xs leading-5 text-periwinkle/75">{new Date(entry.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWaterEntry(entry.id)}
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-periwinkle/80"
                      aria-label={`Remove ${formatMacro(entry.amount, "oz")} water entry`}
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <FormField label="Meal tracker" value={foodInput} onChange={setFoodInput} placeholder="eggs and toast, chicken rice and broccoli" />
              <button
                type="button"
                onClick={saveFoodEntry}
                disabled={!foodEstimate}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow disabled:opacity-50 sm:mt-6"
              >
                <Plus size={18} aria-hidden="true" />
                Log food
              </button>
            </div>
            {foodInput.trim() ? (
              <p className={`rounded-2xl border p-3 text-sm leading-6 ${foodEstimate ? "border-ice/20 bg-ice/10 text-ice" : "border-champagne/20 bg-champagne/10 text-champagne"}`}>
                {foodEstimate
                  ? `${foodEstimate.quantityLabel} ${foodEstimate.matchedFoodName}: ${Math.round(foodEstimate.calories)} kcal | ${formatMacro(foodEstimate.protein, "g protein")} | ${formatMacro(foodEstimate.fiber, "g fiber")}`
                  : "No estimate found yet"}
              </p>
            ) : null}
            {savedProducts.length ? (
              <div className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
                <button
                  type="button"
                  onClick={() => setSavedProductsOpen((current) => !current)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm font-semibold text-ice"
                  aria-expanded={savedProductsOpen}
                >
                  <span>Saved foods</span>
                  <span className="inline-flex items-center gap-2 text-xs text-periwinkle/75">
                    {savedProducts.length}
                    {savedProductsOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                  </span>
                </button>
                {savedProductsOpen ? (
                  <div className="mt-3 grid gap-2">
                    {savedProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-midnight/45 p-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{product.name}</p>
                          <p className="mt-1 text-xs leading-5 text-periwinkle/75">
                            {Math.round(product.calories)} kcal | {formatMacro(product.protein, "g protein")} | {formatMacro(product.fiber, "g fiber")}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => logSavedMealProduct(product)}
                            className="inline-flex size-10 items-center justify-center rounded-2xl border border-ice/25 bg-ice/10 text-ice"
                            aria-label={`Log ${product.name}`}
                          >
                            <Plus size={17} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSavedMealProduct(product.id)}
                            className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-periwinkle/80"
                            aria-label={`Remove saved food ${product.name}`}
                          >
                            <Trash2 size={17} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
              <button
                type="button"
                onClick={() => setManualNutritionOpen((current) => !current)}
                className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm font-semibold text-ice"
                aria-expanded={manualNutritionOpen}
              >
                Manual nutrition
                {manualNutritionOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
              </button>
              {manualNutritionOpen ? (
                <div className="mt-3 grid gap-3">
                  <FormField label="Food name" value={manualFoodName} onChange={setManualFoodName} placeholder="Costco steak bites + Fiber One brownie" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField label="Calories" type="number" value={manualCalories} onChange={setManualCalories} placeholder="kcal" />
                    <FormField label="Protein" type="number" value={manualProtein} onChange={setManualProtein} placeholder="grams" />
                    <FormField label="Fiber" type="number" value={manualFiber} onChange={setManualFiber} placeholder="grams" />
                  </div>
                  <button
                    type="button"
                    onClick={saveManualFoodEntry}
                    disabled={!manualEntryReady}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice disabled:opacity-50"
                  >
                    <Plus size={18} aria-hidden="true" />
                    Log and save nutrition
                  </button>
                </div>
              ) : null}
            </div>
            {todayTracker.foodEntries.length ? (
              <div className="grid gap-2">
                {todayTracker.foodEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-midnight/45 p-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{entry.input}</p>
                      <p className="mt-1 text-xs leading-5 text-periwinkle/75">
                        {entry.matchedFoodName} | {Math.round(entry.calories)} kcal | {formatMacro(entry.protein, "g protein")} | {formatMacro(entry.fiber, "g fiber")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFoodEntry(entry.id)}
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-periwinkle/80"
                      aria-label={`Remove ${entry.input}`}
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3">
            <p className="text-sm text-periwinkle/85">Mood</p>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateToday({ mood: option.value })}
                  className={`grid min-h-20 place-items-center rounded-2xl border px-2 text-center text-xs font-semibold ${
                    todayTracker.mood === option.value ? "border-ice/70 bg-ice/15 text-ice shadow-ice" : "border-white/10 bg-white/[0.05] text-periwinkle/80"
                  }`}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {option.emoji}
                  </span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <CheckToggle label="Medication" checked={medicationChecked} onChange={(checked) => updateToday({ medicationStatus: checked ? "taken" : dailyDefaults.medicationStatus })} />
            <CheckToggle label="Workout" checked={workoutChecked} onChange={(checked) => updateToday({ workoutStatus: checked ? "completed" : dailyDefaults.workoutStatus })} />
            <CheckToggle label="Alcohol" checked={alcoholChecked} onChange={toggleAlcohol} />
          </div>

          {alcoholChecked ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Alcohol type"
                options={alcoholDrinkOptions}
                value={todayTracker.alcoholDrinkType || alcoholDrinkOptions[0]}
                onChange={(value) => updateAlcohol(value, todayTracker.alcoholAmount || 1)}
              />
              <FormField
                label="Alcohol amount"
                type="number"
                value={todayTracker.alcoholAmount ? String(todayTracker.alcoholAmount) : ""}
                onChange={(value) => updateAlcohol(todayTracker.alcoholDrinkType || alcoholDrinkOptions[0], Number.parseFloat(value) || 0)}
                placeholder="standard drinks"
              />
            </div>
          ) : null}

          <button
            type="button"
            onClick={resetToday}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lavender/25 bg-lavender/10 px-4 text-sm font-semibold text-lavender"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Reset Today
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Daily History" description="Previous daily tracker entries are kept by date.">
        {dailyHistory.length ? (
          <div className="grid gap-3">
            {dailyHistory.map((entry) => (
              <article key={entry.date} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{entry.date}</h3>
                    <p className="mt-1 text-xs text-lavender/80">{entry.dailyConsistency}% daily consistency</p>
                  </div>
                  <p className="text-xs text-periwinkle/70">{dailyDisplayValue(entry.medicationStatus, dailyDefaults.medicationStatus)}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-periwinkle/85">
                  Water {entry.water} oz | Calories {Math.round(entry.calories)} kcal | Protein {formatMacro(entry.protein, "g")} | Fiber {formatMacro(entry.fiber, "g")} | Mood {dailyDisplayValue(entry.mood, dailyDefaults.mood)} | Workout {dailyDisplayValue(entry.workoutStatus, dailyDefaults.workoutStatus)}{entry.workoutCalories ? ` | Workout calories ${Math.round(entry.workoutCalories)} kcal` : ""} | Alcohol {dailyDisplayValue(entry.alcohol, dailyDefaults.alcohol)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-midnight/45 p-4 text-sm text-periwinkle/85">No daily history yet. Tomorrow, today's tracker will appear here.</p>
        )}
      </SectionCard>
    </div>
  );
}
