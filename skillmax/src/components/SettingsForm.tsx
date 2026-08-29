'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { CheckCircle2 } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  username: string
  city: string
  bio: string | null
  wallet_address: string | null
}

export default function SettingsForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    full_name: profile.full_name,
    username: profile.username,
    city: profile.city,
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
        bio: form.bio,
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
    <form onSubmit={handleSave} className="space-y-4">
      {[
        { label: 'Full name', key: 'full_name', placeholder: 'Riya Sharma' },
        { label: 'Username', key: 'username', placeholder: 'riya_sharma' },
        { label: 'City', key: 'city', placeholder: 'Mumbai' },
        { label: 'Wallet address', key: 'wallet_address', placeholder: '0x...' },
      ].map((f) => (
        <div key={f.key}>
          <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
          <input
            value={(form as any)[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none text-gray-900"
          />
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none resize-none text-gray-900"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {saved && (
        <p className="text-xs text-emerald-600 flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Profile saved successfully
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
