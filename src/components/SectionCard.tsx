import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

interface SectionCardProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  sectionLabel?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  className = "",
  id,
  sectionLabel,
  collapsible = true,
  defaultOpen = true
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasHeader = Boolean(eyebrow || title || description);
  const canCollapse = collapsible && hasHeader;

  return (
    <section
      id={id}
      data-section-label={sectionLabel ?? title ?? eyebrow}
      className={`scroll-mt-5 max-w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 shadow-ice sm:rounded-[1.75rem] ${className}`}
    >
      {hasHeader && (
        <div className={isOpen ? "mb-4" : ""}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua/75">{eyebrow}</p> : null}
              {title ? <h2 className="mt-1 text-xl font-semibold leading-tight text-white sm:text-2xl">{title}</h2> : null}
              {description ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{description}</p> : null}
            </div>
            {canCollapse ? (
              <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="grid min-h-10 min-w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-ice"
                aria-expanded={isOpen}
                aria-label={isOpen ? "Minimize section" : "Expand section"}
              >
                {isOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
              </button>
            ) : null}
          </div>
        </div>
      )}
      {isOpen || !canCollapse ? children : null}
    </section>
  );
}
