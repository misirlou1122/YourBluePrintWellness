import type { MetricTrend } from "../types/wellness";

function trendLabel(trend: MetricTrend["trend"]) {
  if (trend === "stable") {
    return "Stable";
  }

  return trend === "down" ? "Trending down" : "Trending up";
}

export function TrendCard({ metric }: { metric: MetricTrend }) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.065] p-4 shadow-lavender">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{metric.label}</h3>
          <p className="mt-1 text-xs text-periwinkle/70">Date: {metric.date}</p>
        </div>
        <span className="rounded-full border border-ice/20 bg-ice/10 px-3 py-1 text-xs font-semibold text-ice">
          {trendLabel(metric.trend)}
        </span>
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
        Goal/reference: <span className="text-white">{metric.goal}</span>
      </p>
      <p className="mt-2 text-sm leading-6 text-periwinkle/80">{metric.notes}</p>
    </article>
  );
}
