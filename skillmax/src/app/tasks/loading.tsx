export default function TasksLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 animate-pulse">
      <div className="h-28 rounded-xl bg-slate-100 border border-slate-200" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-slate-100 border border-slate-200" />
        ))}
      </div>
    </div>
  )
}
