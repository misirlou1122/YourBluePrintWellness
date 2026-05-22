interface ProgressRingProps {
  label: string;
  value: number;
  caption: string;
}

export function ProgressRing({ label, value, caption }: ProgressRingProps) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-lavender">
      <div className="relative size-28 shrink-0">
        <svg className="size-28 rotate-[-90deg]" viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#ringGlow)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="ringGlow" x1="0" x2="120" y1="0" y2="120">
              <stop stopColor="#d39cff" />
              <stop offset="0.5" stopColor="#8da2ff" />
              <stop offset="1" stopColor="#d8f7ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <span className="text-xl font-semibold text-white">{value}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-sm leading-6 text-periwinkle/85">{caption}</p>
      </div>
    </div>
  );
}
