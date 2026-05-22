import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Plus, UploadCloud } from "lucide-react";
import type { FeatureGroup, TileId, WellnessTile } from "../types/wellness";
import { Checklist } from "./Checklist";
import { DetailHeader } from "./DetailHeader";
import { EmptyState } from "./EmptyState";
import { FormField } from "./FormField";
import { ProgressBar } from "./ProgressBar";
import { QuickNotes } from "./QuickNotes";
import { SectionCard } from "./SectionCard";
import { TrendCard } from "./TrendCard";

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

function UploadPlaceholder({ kind }: { kind: "labs" | "documents" | "photos" }) {
  const message =
    kind === "labs"
      ? "Future lab PDFs can be processed later. OCR is not connected in this local sample version."
      : "Future uploads can be stored privately later. No real files are stored in this version.";

  return <EmptyState title="Upload placeholder" message={message} icon={UploadCloud} actionLabel="Choose file later" />;
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

function MetricCards({ tile }: { tile: WellnessTile }) {
  if (!tile.metrics?.length) {
    return null;
  }

  return (
    <div className="grid gap-3">
      {tile.metrics.map((metric) => (
        <TrendCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}

function TileSpecificContent({ tile }: { tile: WellnessTile }) {
  if (tile.id === "notes") {
    return <QuickNotes />;
  }

  if (tile.id === "labs") {
    return (
      <div className="grid gap-4">
        <UploadPlaceholder kind="labs" />
        <MetricCards tile={tile} />
      </div>
    );
  }

  if (tile.id === "food") {
    return (
      <div className="grid gap-3">
        <ProgressBar label="Water" value={70} detail="56 oz of 80 oz sample target" tone="aqua" />
        <ProgressBar label="Protein" value={62} detail="68 g of 110 g sample target" tone="lavender" />
        <ProgressBar label="Fiber" value={48} detail="12 g of 25 g sample target" tone="blue" />
      </div>
    );
  }

  if (tile.id === "documents" || tile.id === "photos") {
    return <UploadPlaceholder kind={tile.id === "photos" ? "photos" : "documents"} />;
  }

  if (tile.id === "appointments") {
    return (
      <SectionCard className="border-lavender/20 bg-lavender/10 shadow-lavender">
        <div className="flex items-center gap-2 text-lavender">
          <CalendarDays size={18} aria-hidden="true" />
          <h3 className="font-semibold text-white">Appointment summary preview</h3>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-periwinkle/85">
          <p>Doctor: Dr. Sample Rivera</p>
          <p>Specialty: Primary care</p>
          <p>Date/time: June 12, 2026 at 10:30 AM</p>
          <p>Location: Placeholder clinic</p>
          <p>Phone: (555) 010-2026</p>
        </div>
      </SectionCard>
    );
  }

  if (tile.id === "medications" || tile.id === "alcohol") {
    return (
      <SectionCard className="border-champagne/20 bg-champagne/10">
        <div className="flex items-start gap-3 text-champagne">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">
            Check with your doctor or pharmacist for medication interactions. This app does not provide medical advice.
          </p>
        </div>
      </SectionCard>
    );
  }

  return null;
}

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
