import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: LucideIcon;
}

export function EmptyState({ title, message, icon: Icon = Sparkles }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-ice/35 bg-ice/10 p-5 text-center shadow-ice">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/15 bg-midnight/50 text-ice">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-periwinkle/85">{message}</p>
    </div>
  );
}
