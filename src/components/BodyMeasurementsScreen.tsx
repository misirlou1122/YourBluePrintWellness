import { Plus, Printer, Ruler } from "lucide-react";
import { EntryActions } from "./EntryActions";
import { EmptyState } from "./EmptyState";
import { FormField, TextAreaField } from "./FormField";
import { CollapsibleSectionCard } from "./CollapsibleSectionCard";
import { SectionCard } from "./SectionCard";
import { printFocusedReport } from "../lib/printReports";
import { useLocalCollection, useLocalStorage } from "../lib/useLocalStorage";

interface BodyMeasurementEntry {
  id: string;
  date: string;
  weight: string;
  height: string;
  bustChest: string;
  underbust: string;
  waist: string;
  highWaist: string;
  lowerWaist: string;
  hips: string;
  stomachApronBelly: string;
  thighLeft: string;
  thighRight: string;
  calfLeft: string;
  calfRight: string;
  upperArmLeft: string;
  upperArmRight: string;
  forearmLeft: string;
  forearmRight: string;
  shoulderWidth: string;
  inseam: string;
  torsoLength: string;
  neck: string;
  ringSize: string;
  shoeSize: string;
  braSize: string;
  notes: string;
}

interface ShoppingReference {
  topsSizeNotes: string;
  bottomsSizeNotes: string;
  dressSizeNotes: string;
  braSizeNotes: string;
  shoeSizeNotes: string;
  favoriteFitNotes: string;
  brandsFitWell: string;
  brandsRunSmall: string;
  brandsRunLarge: string;
  onlineShoppingNotes: string;
}

const emptyMeasurement: Omit<BodyMeasurementEntry, "id"> = {
  date: "",
  weight: "",
  height: "",
  bustChest: "",
  underbust: "",
  waist: "",
  highWaist: "",
  lowerWaist: "",
  hips: "",
  stomachApronBelly: "",
  thighLeft: "",
  thighRight: "",
  calfLeft: "",
  calfRight: "",
  upperArmLeft: "",
  upperArmRight: "",
  forearmLeft: "",
  forearmRight: "",
  shoulderWidth: "",
  inseam: "",
  torsoLength: "",
  neck: "",
  ringSize: "",
  shoeSize: "",
  braSize: "",
  notes: ""
};

const emptyShoppingReference: ShoppingReference = {
  topsSizeNotes: "",
  bottomsSizeNotes: "",
  dressSizeNotes: "",
  braSizeNotes: "",
  shoeSizeNotes: "",
  favoriteFitNotes: "",
  brandsFitWell: "",
  brandsRunSmall: "",
  brandsRunLarge: "",
  onlineShoppingNotes: ""
};

const coreFields = [
  ["weight", "Weight optional"],
  ["height", "Height optional"],
  ["bustChest", "Bust/chest"],
  ["underbust", "Underbust"],
  ["waist", "Waist"],
  ["highWaist", "High waist"],
  ["lowerWaist", "Lower waist"],
  ["hips", "Hips"],
  ["stomachApronBelly", "Stomach/apron belly"]
] as const;

const lowerBodyFields = [
  ["thighLeft", "Thigh left"],
  ["thighRight", "Thigh right"],
  ["calfLeft", "Calf left"],
  ["calfRight", "Calf right"],
  ["inseam", "Inseam"]
] as const;

const upperBodyFields = [
  ["upperArmLeft", "Upper arm left"],
  ["upperArmRight", "Upper arm right"],
  ["forearmLeft", "Forearm left"],
  ["forearmRight", "Forearm right"],
  ["shoulderWidth", "Shoulder width"],
  ["torsoLength", "Torso length"],
  ["neck", "Neck"]
] as const;

const shoppingFields = [
  ["ringSize", "Ring size optional"],
  ["shoeSize", "Shoe size optional"],
  ["braSize", "Bra size optional"]
] as const;

const referenceFields = [
  ["topsSizeNotes", "Tops size notes"],
  ["bottomsSizeNotes", "Bottoms size notes"],
  ["dressSizeNotes", "Dress size notes"],
  ["braSizeNotes", "Bra size notes"],
  ["shoeSizeNotes", "Shoe size notes"],
  ["favoriteFitNotes", "Favorite fit notes"],
  ["brandsFitWell", "Brands that fit well"],
  ["brandsRunSmall", "Brands that run small"],
  ["brandsRunLarge", "Brands that run large"],
  ["onlineShoppingNotes", "Online shopping notes"]
] as const;

function sortedByDate(entries: BodyMeasurementEntry[]) {
  return [...entries].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

function MeasurementGrid({ entry }: { entry: BodyMeasurementEntry }) {
  const items = [
    ["Bust/chest", entry.bustChest],
    ["Waist", entry.waist],
    ["Hips", entry.hips],
    ["Inseam", entry.inseam],
    ["Shoe", entry.shoeSize],
    ["Bra", entry.braSize]
  ].filter(([, value]) => value);

  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
          <p className="text-[0.72rem] text-periwinkle/70">{label}</p>
          <p className="mt-1 text-sm font-semibold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function BodyMeasurementsScreen() {
  const { items, add, update, remove } = useLocalCollection<BodyMeasurementEntry>("ybw.bodyMeasurements", [], "measure");
  const [draft, setDraft] = useLocalStorage("ybw.bodyMeasurementsDraft", emptyMeasurement);
  const [editingId, setEditingId] = useLocalStorage<string | null>("ybw.bodyMeasurementsEditingId", null);
  const [shoppingReference, setShoppingReference] = useLocalStorage<ShoppingReference>("ybw.shoppingReference", emptyShoppingReference);

  const setField = (field: keyof typeof emptyMeasurement, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const setReferenceField = (field: keyof ShoppingReference, value: string) => {
    setShoppingReference((current) => ({ ...current, [field]: value }));
  };

  const resetDraft = () => {
    setDraft(emptyMeasurement);
    setEditingId(null);
  };

  const saveEntry = () => {
    if (!Object.values(draft).some((value) => value.trim())) {
      return;
    }

    const entry = {
      ...draft,
      date: draft.date || new Date().toISOString().slice(0, 10)
    };

    if (editingId) {
      update(editingId, entry);
    } else {
      add(entry);
    }

    resetDraft();
  };

  const startEdit = (entry: BodyMeasurementEntry) => {
    const { id: _id, ...rest } = entry;
    setDraft(rest);
    setEditingId(entry.id);
  };

  const history = sortedByDate(items);
  const latest = history[0];

  return (
    <div className="grid gap-4">
      {latest ? (
        <SectionCard eyebrow="Latest Measurements" title={latest.date || "Latest entry"} description="Quick reference for shopping and progress tracking.">
          <div className="flex items-start gap-3 rounded-2xl border border-ice/20 bg-ice/10 p-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-midnight/45 text-ice">
              <Ruler size={21} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <MeasurementGrid entry={latest} />
              {latest.notes ? <p className="mt-3 text-sm leading-6 text-periwinkle/85">{latest.notes}</p> : null}
            </div>
          </div>
        </SectionCard>
      ) : (
        <EmptyState title="No measurements yet" message="Add your first body measurement entry for shopping and wellness reference." icon={Ruler} />
      )}

      <CollapsibleSectionCard storageKey="ybw.measurements.formOpen" forceOpen={Boolean(editingId)} eyebrow={editingId ? "Edit measurements" : "Add measurements"} title={editingId ? "Update measurement entry" : "Measurement entry"} description="Use inches, centimeters, or your preferred units consistently." sectionLabel="Measurement History">
        <div className="grid gap-3">
          <FormField label="Date" type="date" value={draft.date} onChange={(value) => setField("date", value)} />
          <details open className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-white">Core measurements</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {coreFields.map(([field, label]) => (
                <FormField key={field} label={label} value={draft[field]} onChange={(value) => setField(field, value)} />
              ))}
            </div>
          </details>
          <details className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-white">Upper body</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {upperBodyFields.map(([field, label]) => (
                <FormField key={field} label={label} value={draft[field]} onChange={(value) => setField(field, value)} />
              ))}
            </div>
          </details>
          <details className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-white">Lower body</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {lowerBodyFields.map(([field, label]) => (
                <FormField key={field} label={label} value={draft[field]} onChange={(value) => setField(field, value)} />
              ))}
            </div>
          </details>
          <details className="rounded-2xl border border-white/10 bg-midnight/35 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-white">Shopping extras</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {shoppingFields.map(([field, label]) => (
                <FormField key={field} label={label} value={draft[field]} onChange={(value) => setField(field, value)} />
              ))}
            </div>
          </details>
          <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={saveEntry} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
            <Plus size={18} aria-hidden="true" />
            {editingId ? "Save changes" : "Add measurement entry"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetDraft} className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85">
              Cancel edit
            </button>
          ) : null}
        </div>
      </CollapsibleSectionCard>

      <SectionCard title="Shopping Reference" description="Keep fit notes handy while shopping online. These notes save locally as you type.">
        <div className="grid gap-3">
          {referenceFields.map(([field, label]) => (
            <TextAreaField key={field} label={label} value={shoppingReference[field]} onChange={(value) => setReferenceField(field, value)} rows={2} />
          ))}
        </div>
      </SectionCard>

      {history.length ? (
        <SectionCard title="Measurement history">
          <div className="grid gap-3">
            {history.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white">{entry.date}</h3>
                    <MeasurementGrid entry={entry} />
                    {entry.notes ? <p className="mt-3 text-sm leading-6 text-periwinkle/85">{entry.notes}</p> : null}
                  </div>
                  <EntryActions onEdit={() => startEdit(entry)} onDelete={() => remove(entry.id)} />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <button
        type="button"
        onClick={() => printFocusedReport("measurements")}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
      >
        <Printer size={18} aria-hidden="true" />
        Print Body Measurements / Shopping Reference
      </button>
    </div>
  );
}
