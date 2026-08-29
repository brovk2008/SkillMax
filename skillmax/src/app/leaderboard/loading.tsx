export default function LeaderboardLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6 animate-pulse">
      <div className="h-32 rounded-2xl bg-slate-100 border border-slate-200" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-100 border border-slate-200" />
        ))}
      </div>
    </div>
  )
}
