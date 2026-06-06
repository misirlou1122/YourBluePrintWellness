import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Home, Plus, ArrowUp } from "lucide-react";
import type { WellnessProfileId } from "../data/wellnessProfiles";
import type { FeatureGroup, TileId, WellnessTile } from "../types/wellness";
import { createId, useLocalStorage } from "../lib/useLocalStorage";
import { AppointmentsScreen } from "./AppointmentsScreen";
import { BodyMeasurementsScreen } from "./BodyMeasurementsScreen";
import { Checklist } from "./Checklist";
import { CollapsibleSectionCard } from "./CollapsibleSectionCard";
import { DailyTrackersScreen } from "./DailyTrackersScreen";
import { DetailHeader } from "./DetailHeader";
import { EntryActions } from "./EntryActions";
import { FormField } from "./FormField";
import { LabsScreen } from "./LabsScreen";
import { ProfileSettingsScreen } from "./ProfileSettingsScreen";
import { QuickNotes } from "./QuickNotes";
import { ReferenceRangeCard } from "./ReferenceRangeCard";
import { RemindersScreen } from "./RemindersScreen";
import { ReportsPanel } from "./ReportsPanel";
import { SectionCard } from "./SectionCard";
import { WeightScreen } from "./WeightScreen";
import { MedicationsScreen, MoodScreen, PeriodScreen, VitalsScreen } from "./trackers/BodyMindScreens";
import { DocumentsScreen, HairScreen, ProgressPhotosScreen, RecipesScreen, SkinScreen } from "./trackers/BeautyLibraryScreens";
import { AlcoholScreen, FitnessScreen, FoodHydrationScreen } from "./trackers/FoodAlcoholFitnessScreens";
import { vitalsReferenceRanges } from "../lib/referenceRanges";

interface SectionPageProps {
  tile: WellnessTile;
  previousTile?: WellnessTile;
  nextTile?: WellnessTile;
  onHome: () => void;
  onOpenTile: (id: TileId) => void;
  selectedProfile: WellnessProfileId;
  customTileIds: TileId[];
  onProfileChange: (profile: WellnessProfileId) => void;
  onCustomTileIdsChange: (tileIds: TileId[]) => void;
}

function fallbackGroup(title: string): FeatureGroup {
  return {
    title,
    description: `${title} is ready for future entries, charts, and secure storage.`,
    fields: ["Date", "Value or note", "Context", "Follow-up"]
  };
}

type GenericEntry = Record<string, string> & {
  id: string;
  savedAt: string;
};

function FieldEntry({ group, storageKey, inline = false }: { group: FeatureGroup; storageKey: string; inline?: boolean }) {
  const fields = group.fields?.length ? group.fields : ["Title", "Date", "Notes"];
  const [values, setValues] = useLocalStorage<Record<string, string>>(`${storageKey}.draft`, {});
  const [entries, setEntries] = useLocalStorage<GenericEntry[]>(storageKey, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const forceOpen = Boolean(editingId);

  useEffect(() => {
    if (entries.some((entry) => !entry.id)) {
      setEntries((current) => current.map((entry) => (entry.id ? entry : { ...entry, id: createId("entry") })));
    }
  }, [entries, setEntries]);

  const updateValue = (field: string, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const resetEntry = () => {
    setValues({});
    setEditingId(null);
  };

  const saveEntry = () => {
    if (!fields.some((field) => values[field]?.trim())) {
      return;
    }

    if (editingId) {
      setEntries((current) => current.map((entry) => (entry.id === editingId ? { ...entry, ...values, savedAt: new Date().toLocaleString() } : entry)));
    } else {
      setEntries([{ ...values, id: createId("entry"), savedAt: new Date().toLocaleString() }, ...entries]);
    }

    resetEntry();
  };

  const startEdit = (entry: GenericEntry) => {
    const { id: _id, savedAt: _savedAt, ...rest } = entry;
    setValues(rest);
    setEditingId(entry.id);
  };

  const entryFields = (
    <>
      <div className="grid gap-3">
        {fields.map((field) => (
          <FormField key={field} label={field} value={values[field] ?? ""} onChange={(value) => updateValue(field, value)} />
        ))}
      </div>
      <button
        type="button"
        onClick={saveEntry}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
      >
        {editingId ? "Save changes" : "Save entry locally"}
      </button>
      {editingId ? (
        <button
          type="button"
          onClick={resetEntry}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
        >
          Cancel edit
        </button>
      ) : null}
      {entries.length ? (
        <div className="mt-4 grid gap-3">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm text-periwinkle/85">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="mb-2 text-xs text-lavender/80">{entry.savedAt}</p>
                  {fields.map((field) =>
                    entry[field] ? (
                      <p key={field} className="leading-6">
                        <span className="text-white">{field}:</span> {entry[field]}
                      </p>
                    ) : null
                  )}
                </div>
                <EntryActions onEdit={() => startEdit(entry)} onDelete={() => setEntries((current) => current.filter((item) => item.id !== entry.id))} />
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </>
  );

  if (inline) {
    return entryFields;
  }

  return (
    <CollapsibleSectionCard
      storageKey={`${storageKey}.open`}
      title="Manual entry"
      defaultOpen={false}
      forceOpen={forceOpen}
      className="bg-white/[0.04]"
      sectionLabel={group.title}
    >
      <div className="mb-4 flex items-center gap-2">
        <Plus size={18} className="text-ice" aria-hidden="true" />
        <h3 className="text-base font-semibold text-white">Manual entry</h3>
      </div>
      {entryFields}
    </CollapsibleSectionCard>
  );
}

function TileSpecificContent({
  tile,
  selectedProfile,
  customTileIds,
  onProfileChange,
  onCustomTileIdsChange
}: Pick<SectionPageProps, "tile" | "selectedProfile" | "customTileIds" | "onProfileChange" | "onCustomTileIdsChange">) {
  if (tile.id === "settings") {
    return (
      <ProfileSettingsScreen
        selectedProfile={selectedProfile}
        customTileIds={customTileIds}
        onProfileChange={onProfileChange}
        onCustomTileIdsChange={onCustomTileIdsChange}
      />
    );
  }

  if (tile.id === "daily") {
    return <DailyTrackersScreen selectedProfile={selectedProfile} customTileIds={customTileIds} />;
  }

  if (tile.id === "reports") {
    return <ReportsPanel />;
  }

  if (tile.id === "labs") {
    return <LabsScreen />;
  }

  if (tile.id === "appointments") {
    return <AppointmentsScreen />;
  }

  if (tile.id === "notes") {
    return <QuickNotes />;
  }

  if (tile.id === "reminders") {
    return <RemindersScreen />;
  }

  if (tile.id === "food") {
    return <FoodHydrationScreen />;
  }

  if (tile.id === "alcohol") {
    return <AlcoholScreen />;
  }

  if (tile.id === "fitness") {
    return <FitnessScreen />;
  }

  if (tile.id === "medications") {
    return <MedicationsScreen />;
  }

  if (tile.id === "vitals") {
    return <VitalsScreen />;
  }

  if (tile.id === "health") {
    return (
      <ReferenceRangeCard
        title="Vitals reference guide"
        description="Quick common adult ranges for comparing saved entries without making medical decisions in the app."
        items={vitalsReferenceRanges}
      />
    );
  }

  if (tile.id === "weight") {
    return (
      <div className="grid gap-4">
        <WeightScreen />
        <BodyMeasurementsScreen />
      </div>
    );
  }

  if (tile.id === "measurements") {
    return <BodyMeasurementsScreen />;
  }

  if (tile.id === "period") {
    return <PeriodScreen />;
  }

  if (tile.id === "mood") {
    return <MoodScreen />;
  }

  if (tile.id === "skin") {
    return <SkinScreen />;
  }

  if (tile.id === "hair") {
    return <HairScreen />;
  }

  if (tile.id === "recipes") {
    return <RecipesScreen />;
  }

  if (tile.id === "documents") {
    return <DocumentsScreen />;
  }

  if (tile.id === "photos") {
    return <ProgressPhotosScreen />;
  }

  return null;
}

const fullScreenTiles: TileId[] = [
  "daily",
  "reports",
  "labs",
  "appointments",
  "medications",
  "vitals",
  "weight",
  "measurements",
  "fitness",
  "food",
  "alcohol",
  "period",
  "mood",
  "skin",
  "hair",
  "recipes",
  "documents",
  "notes",
  "reminders",
  "photos",
  "settings"
];

export function SectionPage({
  tile,
  previousTile,
  nextTile,
  onHome,
  onOpenTile,
  selectedProfile,
  customTileIds,
  onProfileChange,
  onCustomTileIdsChange
}: SectionPageProps) {
  const [activeCategory, setActiveCategory] = useState(tile.subcategories[0]);

  useEffect(() => {
    setActiveCategory(tile.subcategories[0]);
  }, [tile]);

  const activeGroup = useMemo(
    () => tile.groups.find((group) => group.title.toLowerCase() === activeCategory.toLowerCase()) ?? fallbackGroup(activeCategory),
    [activeCategory, tile.groups]
  );

  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const scrollToSection = (subcategory: string) => {
    setActiveCategory(subcategory);
    window.setTimeout(() => {
      const content = document.getElementById("tile-detail-content");
      const normalizedTarget = normalize(subcategory);
      const candidates = Array.from(content?.querySelectorAll<HTMLElement>("[data-section-label], h2, h3, article, label") ?? []);
      const match = candidates.find((element) => normalize(element.dataset.sectionLabel ?? element.textContent ?? "").includes(normalizedTarget));

      (match ?? content)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const backToTop = () => {
    document.getElementById("tile-detail-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main id="tile-detail-top" className="detail-page grid min-w-0 gap-5">
      <DetailHeader tile={tile} onHome={onHome} />

      <nav aria-label={`${tile.title} subcategories`} className="-mx-3 overflow-x-auto px-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex min-w-max gap-2 pb-1">
          {tile.subcategories.map((subcategory) => (
            <button
              key={subcategory}
              type="button"
              onClick={() => scrollToSection(subcategory)}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${
                activeCategory === subcategory
                  ? "border-ice/70 bg-ice/15 text-ice shadow-ice"
                  : "border-white/10 bg-white/[0.05] text-periwinkle/80 hover:border-lavender/50 hover:text-white"
              }`}
            >
              {subcategory}
            </button>
          ))}
        </div>
      </nav>

      <div id="tile-detail-content" className="grid gap-5">
        <TileSpecificContent
          tile={tile}
          selectedProfile={selectedProfile}
          customTileIds={customTileIds}
          onProfileChange={onProfileChange}
          onCustomTileIdsChange={onCustomTileIdsChange}
        />

        {!fullScreenTiles.includes(tile.id) ? (
          <SectionCard eyebrow="Detail entry" title={activeGroup.title} description={activeGroup.description} sectionLabel={activeGroup.title}>
            <div className="grid gap-4">
              {activeGroup.checklist?.length ? <Checklist items={activeGroup.checklist} /> : null}
              {activeGroup.cards?.length ? (
                <div className="grid gap-3">
                  {activeGroup.cards.map((card) => (
                    <article key={card.title} className="rounded-2xl border border-white/10 bg-midnight/45 p-4" data-section-label={card.title}>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-ice" aria-hidden="true" />
                        <div>
                          <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-periwinkle/85">{card.body}</p>
                          {card.meta ? <p className="mt-2 text-xs text-lavender/75">{card.meta}</p> : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
              <FieldEntry
                key={`${tile.id}-${activeGroup.title}`}
                group={activeGroup}
                storageKey={`ybw.genericEntries.${tile.id}.${activeGroup.title}`}
                inline={tile.id === "health" && activeGroup.title.toLowerCase() === "vitals"}
              />
            </div>
          </SectionCard>
        ) : null}
      </div>

      {tile.futureNotes?.length ? (
        <SectionCard title="Future notes" className="border-aqua/20 bg-aqua/10">
          <div className="grid gap-2">
            {tile.futureNotes.map((note) => (
              <p key={note} className="text-sm leading-6 text-ice/90">
                {note}
              </p>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!previousTile}
          onClick={() => previousTile && onOpenTile(previousTile.id)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-periwinkle/85 disabled:opacity-45"
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Previous
        </button>
        <button
          type="button"
          disabled={!nextTile}
          onClick={() => nextTile && onOpenTile(nextTile.id)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-periwinkle/85 disabled:opacity-45"
        >
          Next
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onHome}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice"
        >
          <Home size={18} aria-hidden="true" />
          Return Home
        </button>
        <button
          type="button"
          onClick={backToTop}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lavender/25 bg-lavender/10 px-4 text-sm font-semibold text-lavender shadow-lavender"
        >
          <ArrowUp size={18} aria-hidden="true" />
          Back to Top
        </button>
      </div>
    </main>
  );
}
