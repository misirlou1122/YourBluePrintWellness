interface ProgressBarProps {
  label: string;
  value: number;
  detail: string;
  tone?: "blue" | "lavender" | "aqua";
}

const toneClass = {
  blue: "from-sapphire via-periwinkle to-ice",
  lavender: "from-lavender via-periwinkle to-ice",
  aqua: "from-aqua via-ice to-periwinkle"
};

export function ProgressBar({ label, value, detail, tone = "lavender" }: ProgressBarProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-ice">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-xs text-ice/80">{Math.round(value)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${toneClass[tone]} shadow-[0_0_18px_rgba(211,156,255,0.75)] transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-periwinkle/80">{detail}</p>
    </div>
  );
}
