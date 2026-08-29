'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { CATEGORY_NAMES } from '@/lib/contracts'

interface Skill {
  id?: string
  title: string
  description: string
  category: string
  price_inr: string
  price_mon: string
  is_active: boolean
}

interface Props {
  initialSkill?: Partial<Skill>
  skillId?: string
  userId: string
}

export default function SkillForm({ initialSkill, skillId, userId }: Props) {
  const [form, setForm] = useState<Skill>({
    title: initialSkill?.title ?? '',
    description: initialSkill?.description ?? '',
    category: initialSkill?.category ?? 'Programming',
    price_inr: initialSkill?.price_inr?.toString() ?? '',
    price_mon: initialSkill?.price_mon?.toString() ?? '',
    is_active: initialSkill?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createBrowserClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      provider_id: userId,
      title: form.title,
      description: form.description,
      category: form.category,
      price_inr: form.price_inr ? parseInt(form.price_inr) : null,
      price_mon: form.price_mon ? parseFloat(form.price_mon) : null,
      is_active: form.is_active,
    }

    let error: any
    if (skillId) {
      const res = await supabase.from('skills').update(payload).eq('id', skillId).eq('provider_id', userId)
      error = res.error
    } else {
      const res = await supabase.from('skills').insert(payload)
      error = res.error
    }

    if (error) {
      setError(error.message)
    } else {
      router.push('/profile')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Skill title *</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Python tutoring, Logo design..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none text-gray-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none text-gray-900"
        >
          {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          placeholder="Describe what you offer, your experience, what's included..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none resize-none text-gray-900"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Price (INR)</label>
          <input
            type="number"
            min="0"
            value={form.price_inr}
            onChange={(e) => setForm({ ...form, price_inr: e.target.value })}
            placeholder="500"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none text-gray-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Price (MON)</label>
          <input
            type="number"
            min="0"
            step="0.001"
            value={form.price_mon}
            onChange={(e) => setForm({ ...form, price_mon: e.target.value })}
            placeholder="0.1"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none text-gray-900"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-sm text-gray-700">Visible on Explore page</span>
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : skillId ? 'Update Skill' : 'Create Skill'}
      </button>
    </form>
  )
}
