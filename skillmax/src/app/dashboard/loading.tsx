export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-pulse">
      <div className="flex justify-between items-center pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-md bg-slate-200" />
          <div className="h-4 w-96 rounded-md bg-slate-100" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-emerald-100" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-100 border border-slate-200" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-72 rounded-2xl bg-slate-100 border border-slate-200" />
        <div className="h-72 rounded-2xl bg-slate-100 border border-slate-200" />
      </div>
    </div>
  )
}
