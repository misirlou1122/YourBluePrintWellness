import type { ReactNode } from "react";

interface SectionCardProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ eyebrow, title, description, children, className = "" }: SectionCardProps) {
  return (
    <section className={`rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-ice ${className}`}>
      {(eyebrow || title || description) && (
        <div className="mb-4">
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua/75">{eyebrow}</p> : null}
          {title ? <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2> : null}
          {description ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{description}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}
