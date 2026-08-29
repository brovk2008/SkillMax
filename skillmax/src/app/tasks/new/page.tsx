'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { CATEGORY_NAMES } from '@/lib/contracts'
import { ClipboardList, ArrowRight } from 'lucide-react'

export default function NewTaskPostingPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Programming')
  const [city, setCity] = useState('Delhi NCR')
  const [budgetInr, setBudgetInr] = useState('')
  const [budgetMon, setBudgetMon] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/onboard')
      return
    }

    const { error: insertErr } = await supabase.from('task_postings').insert({
      client_id: user.id,
      title,
      description,
      category,
      city,
      budget_inr: budgetInr ? parseInt(budgetInr) : null,
      budget_mon: budgetMon ? parseFloat(budgetMon) : null,
    })

    if (insertErr) {
      setError(insertErr.message)
      setLoading(false)
    } else {
      router.push('/tasks')
      router.refresh()
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 bg-white space-y-6">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
          <ClipboardList className="h-3.5 w-3.5 text-emerald-600" />
          Need Something Done?
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Post a Task Request</h1>
        <p className="text-xs text-slate-500">Describe what you need help with so local skilled providers can accept your task.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Need kitchen sink fixed today at 4pm"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
          >
            {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">City / Location *</label>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Delhi NCR"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Task Details / Instructions</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Explain what help you need, time preferences, requirements..."
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Budget (INR)</label>
            <input
              type="number"
              value={budgetInr}
              onChange={(e) => setBudgetInr(e.target.value)}
              placeholder="500"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Budget (MON)</label>
            <input
              type="number"
              step="0.001"
              value={budgetMon}
              onChange={(e) => setBudgetMon(e.target.value)}
              placeholder="0.1"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>{loading ? 'Posting task...' : 'Post Task to Community Board'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
