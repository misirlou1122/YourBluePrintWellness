import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { SectionCard } from "./SectionCard";
import type { ReactNode } from "react";

interface CollapsibleSectionCardProps {
  storageKey: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  className?: string;
  sectionLabel?: string;
}

export function CollapsibleSectionCard({
  storageKey,
  eyebrow,
  title,
  description,
  children,
  defaultOpen = false,
  forceOpen = false,
  className = "",
  sectionLabel
}: CollapsibleSectionCardProps) {
  const [isOpen, setIsOpen] = useLocalStorage(storageKey, defaultOpen);
  const open = forceOpen || isOpen;

  return (
    <SectionCard eyebrow={eyebrow} title={title} description={description} className={className} sectionLabel={sectionLabel ?? title} collapsible={false}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-ice/25 bg-ice/10 px-4 text-ice shadow-ice"
        aria-expanded={open}
        aria-label={open ? "Collapse section" : "Expand section"}
      >
        {open ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </SectionCard>
  );
}
