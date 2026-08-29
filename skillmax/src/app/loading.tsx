export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-44 rounded-2xl bg-slate-100 border border-slate-200" />

      {/* Grid skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded-md bg-slate-200" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 border border-slate-200" />
          ))}
        </div>
      </div>
    </div>
  )
}
