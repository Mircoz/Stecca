export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="border border-line rounded-lg divide-y divide-line bg-white/50 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex items-center justify-between animate-pulse-soft">
          <div className="space-y-2">
            <div className="h-3.5 w-40 rounded bg-ink/10" />
            <div className="h-3 w-24 rounded bg-ink/5" />
          </div>
          <div className="h-5 w-16 rounded-full bg-ink/10" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-line rounded-lg p-5 bg-white/50 animate-pulse-soft">
          <div className="h-3 w-24 rounded bg-ink/10 mb-3" />
          <div className="h-7 w-12 rounded bg-ink/10" />
        </div>
      ))}
    </div>
  )
}
