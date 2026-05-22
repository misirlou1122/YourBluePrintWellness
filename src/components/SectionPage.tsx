import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  UploadCloud
} from "lucide-react";
import type { FeatureGroup, TileId, WellnessTile } from "../types/wellness";
import { ProgressBar } from "./ProgressBar";
import { QuickNotes } from "./QuickNotes";
import { tileIcons } from "./icons";

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

function TrendBadge({ trend }: { trend: "up" | "down" | "stable" }) {
  const label = trend === "stable" ? "Stable" : trend === "down" ? "Trending down" : "Trending up";
  return (
    <span className="rounded-full border border-ice/20 bg-ice/10 px-3 py-1 text-xs font-semibold text-ice">
      {label}
    </span>
  );
}

function UploadPlaceholder({ kind }: { kind: "labs" | "documents" | "photos" }) {
  const message =
    kind === "labs"
      ? "Future lab PDFs can be stored in Azure Blob Storage and processed by Azure AI Document Intelligence through Azure Functions."
      : "Future uploads can be stored privately in Azure Blob Storage behind authenticated access.";

  return (
    <div className="rounded-[1.75rem] border border-dashed border-ice/35 bg-ice/10 p-5 text-center shadow-ice">
      {/* Future Azure Blob Storage integration belongs behind Azure Functions with authenticated access checks. */}
      {/* Future lab parsing can use Azure AI Document Intelligence after upload review. */}
      <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/15 bg-midnight/50 text-ice">
        <UploadCloud size={26} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">Upload placeholder</h3>
      <p className="mt-2 text-sm leading-6 text-periwinkle/85">{message}</p>
      <button
        type="button"
        className="mt-4 inline-flex min-h-12 items-center justify-center rounded-2xl border border-lavender/30 bg-lavender/15 px-5 text-sm font-semibold text-lavender"
      >
        Choose file later
      </button>
    </div>
  );
}

function FieldEntry({ group }: { group: FeatureGroup }) {
  const fields = group.fields?.length ? group.fields : ["Title", "Date", "Notes"];

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-ice">
      <div className="flex items-center gap-2">
        <Plus size={18} className="text-ice" aria-hidden="true" />
        <h3 className="text-base font-semibold text-white">Manual entry placeholder</h3>
      </div>
      <div className="mt-4 grid gap-3">
        {fields.map((field) => (
          <label key={field} className="grid gap-1 text-sm text-periwinkle/85">
            <span>{field}</span>
            <input
              placeholder={`${field}...`}
              className="min-h-12 rounded-2xl border border-white/10 bg-midnight/55 px-4 text-sm text-white outline-none placeholder:text-periwinkle/45 focus:border-ice/60 focus:ring-2 focus:ring-ice/20"
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
      >
        Save sample entry
      </button>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <label
          key={item}
          className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white"
        >
          <input
            type="checkbox"
            defaultChecked={index === 0}
            className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}

function MetricCards({ tile }: { tile: WellnessTile }) {
  if (!tile.metrics?.length) {
    return null;
  }

  return (
    <div className="grid gap-3">
      {tile.metrics.map((metric) => (
        <article key={metric.label} className="rounded-[1.75rem] border border-white/10 bg-white/[0.065] p-4 shadow-lavender">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">{metric.label}</h3>
              <p className="mt-1 text-xs text-periwinkle/70">Date of result: {metric.date}</p>
            </div>
            <TrendBadge trend={metric.trend} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-ice/15 bg-ice/10 p-3">
              <p className="text-xs text-ice/75">Current value</p>
              <p className="mt-1 text-lg font-semibold text-white">{metric.current}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
              <p className="text-xs text-periwinkle/70">Previous value</p>
              <p className="mt-1 text-lg font-semibold text-white">{metric.previous}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-periwinkle/85">
            Goal range: <span className="text-white">{metric.goal}</span>
          </p>
          <p className="mt-2 text-sm leading-6 text-periwinkle/80">{metric.notes}</p>
        </article>
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
      <div className="rounded-[1.75rem] border border-lavender/20 bg-lavender/10 p-4 shadow-lavender">
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
      </div>
    );
  }

  if (tile.id === "medications" || tile.id === "alcohol") {
    return (
      <div className="rounded-[1.75rem] border border-champagne/20 bg-champagne/10 p-4 shadow-ice">
        <div className="flex items-start gap-3 text-champagne">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">
            Check with your doctor or pharmacist for medication interactions. This app does not provide medical advice.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export function SectionPage({ tile, previousTile, nextTile, onHome, onOpenTile }: SectionPageProps) {
  const [activeCategory, setActiveCategory] = useState(tile.subcategories[0]);
  const Icon = tileIcons[tile.icon] ?? tileIcons.sparkles;

  useEffect(() => {
    setActiveCategory(tile.subcategories[0]);
  }, [tile]);

  const activeGroup = useMemo(
    () => tile.groups.find((group) => group.title.toLowerCase() === activeCategory.toLowerCase()) ?? fallbackGroup(activeCategory),
    [activeCategory, tile.groups]
  );

  return (
    <main className="grid gap-5">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl">
        <button
          type="button"
          onClick={onHome}
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-ice/20 bg-ice/10 px-4 text-sm font-semibold text-ice transition hover:bg-ice/15"
        >
          <Home size={18} aria-hidden="true" />
          Return Home
        </button>
        <div className="mt-5 flex items-start gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-lavender/25 bg-gradient-to-br from-sapphire/45 via-lavender/25 to-aqua/20 text-ice shadow-lavender">
            <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lavender/75">Section</p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight text-white">{tile.title}</h1>
            <p className="mt-2 text-sm leading-6 text-periwinkle/85">{tile.subtitle}</p>
          </div>
        </div>
      </section>

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

      <section className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-ice">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua/75">Detail entry</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{activeGroup.title}</h2>
          <p className="mt-2 text-sm leading-6 text-periwinkle/85">{activeGroup.description}</p>
        </div>

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
      </section>

      {tile.futureNotes?.length ? (
        <section className="rounded-[1.75rem] border border-aqua/20 bg-aqua/10 p-4 shadow-ice">
          <h2 className="text-lg font-semibold text-white">Future Azure notes</h2>
          <div className="mt-3 grid gap-2">
            {tile.futureNotes.map((note) => (
              <p key={note} className="text-sm leading-6 text-ice/90">
                {note}
              </p>
            ))}
          </div>
        </section>
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
