import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { FeatureGroup, TileId, WellnessTile } from "../types/wellness";
import { AppointmentsScreen } from "./AppointmentsScreen";
import { Checklist } from "./Checklist";
import { DetailHeader } from "./DetailHeader";
import { FormField } from "./FormField";
import { LabsScreen } from "./LabsScreen";
import { QuickNotes } from "./QuickNotes";
import { RemindersScreen } from "./RemindersScreen";
import { SectionCard } from "./SectionCard";
import { MedicationsScreen, MoodScreen, PeriodScreen, VitalsScreen } from "./trackers/BodyMindScreens";
import { DocumentsScreen, HairScreen, ProgressPhotosScreen, RecipesScreen, SkinScreen } from "./trackers/BeautyLibraryScreens";
import { AlcoholScreen, FitnessScreen, FoodHydrationScreen } from "./trackers/FoodAlcoholFitnessScreens";

interface SectionPageProps {
  tile: WellnessTile;
  previousTile?: WellnessTile;
  nextTile?: WellnessTile;
  onHome: () => void;
  onOpenTile: (id: TileId) => void;
}

function fallbackGroup(title: string): FeatureGroup {
  return {
    title,
    description: `${title} is ready for future entries, charts, and secure storage.`,
    fields: ["Date", "Value or note", "Context", "Follow-up"]
  };
}

function FieldEntry({ group }: { group: FeatureGroup }) {
  const fields = group.fields?.length ? group.fields : ["Title", "Date", "Notes"];

  return (
    <SectionCard className="bg-white/[0.04]">
      <div className="mb-4 flex items-center gap-2">
        <Plus size={18} className="text-ice" aria-hidden="true" />
        <h3 className="text-base font-semibold text-white">Manual entry placeholder</h3>
      </div>
      <div className="grid gap-3">
        {fields.map((field) => (
          <FormField key={field} label={field} />
        ))}
      </div>
      <button
        type="button"
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
      >
        Save sample entry
      </button>
    </SectionCard>
  );
}

function TileSpecificContent({ tile }: { tile: WellnessTile }) {
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
  "labs",
  "appointments",
  "medications",
  "vitals",
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
  "photos"
];

export function SectionPage({ tile, previousTile, nextTile, onHome, onOpenTile }: SectionPageProps) {
  const [activeCategory, setActiveCategory] = useState(tile.subcategories[0]);

  useEffect(() => {
    setActiveCategory(tile.subcategories[0]);
  }, [tile]);

  const activeGroup = useMemo(
    () => tile.groups.find((group) => group.title.toLowerCase() === activeCategory.toLowerCase()) ?? fallbackGroup(activeCategory),
    [activeCategory, tile.groups]
  );

  return (
    <main className="grid gap-5">
      <DetailHeader tile={tile} onHome={onHome} />

      <nav aria-label={`${tile.title} subcategories`} className="-mx-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-2 pb-1">
          {tile.subcategories.map((subcategory) => (
            <button
              key={subcategory}
              type="button"
              onClick={() => setActiveCategory(subcategory)}
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

      <TileSpecificContent tile={tile} />

      {!fullScreenTiles.includes(tile.id) ? (
        <SectionCard eyebrow="Detail entry" title={activeGroup.title} description={activeGroup.description}>
          <div className="grid gap-4">
            {activeGroup.checklist?.length ? <Checklist items={activeGroup.checklist} /> : null}
            {activeGroup.cards?.length ? (
              <div className="grid gap-3">
                {activeGroup.cards.map((card) => (
                  <article key={card.title} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
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
            <FieldEntry group={activeGroup} />
          </div>
        </SectionCard>
      ) : null}

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
    </main>
  );
}
