import { HeartPulse } from "lucide-react";
import { SectionCard } from "./SectionCard";
import type { ReferenceRangeItem } from "../lib/referenceRanges";

interface ReferenceRangeCardProps {
  title: string;
  description?: string;
  items: ReferenceRangeItem[];
}

export function ReferenceRangeCard({ title, description, items }: ReferenceRangeCardProps) {
  return (
    <SectionCard title={title} description={description} className="border-ice/15 bg-ice/[0.07]">
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-midnight/45 p-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl border border-lavender/20 bg-lavender/15 p-2 text-lavender shadow-glow">
                <HeartPulse size={16} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-periwinkle/85">{item.range}</p>
                {item.rangeLines?.length ? (
                  <ul className="mt-2 grid gap-1.5 text-sm leading-6 text-periwinkle/90">
                    {item.rangeLines.map((line) => (
                      <li key={line} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.note ? <p className="mt-1 text-xs leading-5 text-champagne">{item.note}</p> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-2xl border border-champagne/20 bg-champagne/10 p-3 text-sm leading-6 text-white">
        These are general reference ranges for personal tracking only. Your doctor can tell you what range is right for you.
      </p>
    </SectionCard>
  );
}
