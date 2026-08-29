'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { CitySelector } from '@/components/CitySelector'
import { AvatarUploader } from '@/components/AvatarUploader'
import { PhoneInput } from '@/components/PhoneInput'
import { CheckCircle2 } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  username: string
  city: string
  bio: string | null
  wallet_address: string | null
  avatar_url?: string | null
  headline?: string | null
  gender?: string | null
  phone?: string | null
}

export default function SettingsForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    full_name: profile.full_name,
    username: profile.username,
    city: profile.city,
    headline: profile.headline ?? '',
    avatar_url: profile.avatar_url ?? 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    gender: profile.gender ?? 'Prefer not to say',
    phone: profile.phone ?? '',
    bio: profile.bio ?? '',
    wallet_address: profile.wallet_address ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createBrowserClient()
  const router = useRouter()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setError('')

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        username: form.username,
        city: form.city,
        headline: form.headline || null,
        avatar_url: form.avatar_url || null,
        gender: form.gender,
        phone: form.phone || null,
        bio: form.bio || null,
        wallet_address: form.wallet_address || null,
      })
      .eq('id', profile.id)

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
      <AvatarUploader
        value={form.avatar_url || ''}
        onChange={(url) => setForm({ ...form, avatar_url: url })}
        label="Profile Avatar Photo"
      />

      {[
        { label: 'Full name *', key: 'full_name', placeholder: 'Riya Sharma' },
        { label: 'Username *', key: 'username', placeholder: 'riya_sharma' },
        { label: 'Headline / Tagline', key: 'headline', placeholder: 'e.g. Senior Software Engineer & Guitar Teacher' },
      ].map((f) => (
        <div key={f.key}>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{f.label}</label>
          <input
            value={(form as any)[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-emerald-600 focus:outline-none text-slate-900"
          />
        </div>
      ))}

      <CitySelector value={form.city} onChange={(city) => setForm({ ...form, city })} label="City *" />

      <PhoneInput value={form.phone || ''} onChange={(p) => setForm({ ...form, phone: p })} location={form.city} />

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Monad Wallet Address</label>
        <input
          value={form.wallet_address || ''}
          onChange={(e) => setForm({ ...form, wallet_address: e.target.value })}
          placeholder="0x..."
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-emerald-600 focus:outline-none text-slate-900 font-mono"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-emerald-600 focus:outline-none text-slate-900"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Non-binary</option>
          <option>Prefer not to say</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">About / Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-emerald-600 focus:outline-none resize-none text-slate-900"
        />
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</p>}
      {saved && (
        <p className="text-xs text-emerald-600 flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Profile saved successfully!
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}
