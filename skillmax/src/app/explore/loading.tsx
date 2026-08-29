export default function ExploreLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 animate-pulse">
      <div className="h-32 rounded-xl bg-slate-100 border border-slate-200" />
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-slate-200 shrink-0" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-slate-100 border border-slate-200" />
        ))}
      </div>
    </div>
  )
}
