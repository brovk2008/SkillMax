import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CATEGORY_NAMES } from '@/lib/contracts'
import { ClipboardList, MapPin, Search, Plus, ArrowRight, CheckCircle2, Zap, MessageSquare } from 'lucide-react'
import { formatINR } from '@/lib/utils'

interface Props {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function TasksBoardPage({ searchParams }: Props) {
  const supabase = await createServerClient()
  const { category, q } = await searchParams

  let query = supabase
    .from('task_postings')
    .select('*, client_profile:profiles!client_id(full_name, username, avatar_url, city)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: tasks } = await query

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 bg-white">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              <ClipboardList className="h-3.5 w-3.5 text-emerald-700" />
              Community Help Wanted
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Open Task Requests
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Browse tasks posted by local neighbors seeking help. Accept a task to earn INR or MON tokens with Monad escrow protection.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Link
              href="/tasks/new"
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Post a Task</span>
            </Link>
            <Link
              href="/skills/new"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              Offer Help / Skill
            </Link>
          </div>
        </div>

        {/* Search Bar & Filters */}
        <form action="/tasks" method="GET" className="flex gap-2 pt-2">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-xl px-3.5 py-2">
            <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search requested tasks (e.g. Plumbing, Tutoring, Smart Contract)..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/80">
          {['All', ...CATEGORY_NAMES].map((cat) => {
            const active = (category ?? 'All') === cat
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/tasks' : `/tasks?category=${encodeURIComponent(cat)}`}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Task Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-slate-500">
          Showing {tasks?.length ?? 0} open {tasks?.length === 1 ? 'task' : 'tasks'}
          {category && category !== 'All' ? ` in ${category}` : ''}
        </p>
      </div>

      {/* Tasks Grid */}
      {tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task: any) => {
            const client = task.client_profile
            const avatar = client?.avatar_url || '/logo.png'

            return (
              <div
                key={task.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {task.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Open Request
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Posted By */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <img src={avatar} alt={client?.full_name} className="h-7 w-7 rounded-full object-cover border border-slate-200" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{client?.full_name}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {task.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Budget & Action */}
                <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    {task.budget_inr && (
                      <p className="text-base font-extrabold text-slate-900">{formatINR(task.budget_inr)}</p>
                    )}
                    {task.budget_mon && (
                      <p className="text-xs font-mono font-semibold text-emerald-600">{task.budget_mon} MON</p>
                    )}
                  </div>

                  <Link
                    href={`/messages`}
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Accept Task</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-600">No open task requests matching your search.</p>
          <Link
            href="/tasks/new"
            className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
          >
            + Post the First Task Request
          </Link>
        </div>
      )}
    </div>
  )
}
