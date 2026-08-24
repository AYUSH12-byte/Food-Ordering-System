export const SkeletonText = ({ className = "h-4 w-full" }) => (
  <div className={`animate-shimmer rounded-md bg-slate-200 ${className}`} />
);

export const SkeletonCard = ({ className = "" }) => (
  <div className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 ${className}`}>
    <div className="animate-shimmer h-48 w-full rounded-xl bg-slate-200" />
    <div className="mt-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="animate-shimmer h-5 w-2/3 rounded-md bg-slate-200" />
        <div className="animate-shimmer h-5 w-16 rounded-md bg-slate-200" />
      </div>
      <div className="animate-shimmer h-4 w-full rounded-md bg-slate-200" />
      <div className="animate-shimmer h-4 w-4/5 rounded-md bg-slate-200" />
      <div className="animate-shimmer h-10 w-full rounded-xl bg-slate-200 mt-4" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4">
    <div className="flex gap-4 pb-3 border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="animate-shimmer h-5 flex-1 rounded bg-slate-200" />
      ))}
    </div>
    <div className="space-y-4 pt-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="animate-shimmer h-4 flex-1 rounded bg-slate-200" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonMetric = () => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
    <div className="animate-shimmer h-4 w-24 rounded bg-slate-200" />
    <div className="animate-shimmer h-8 w-32 rounded bg-slate-200" />
  </div>
);

export default SkeletonCard;
