'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { CATEGORY_NAMES } from '@/lib/contracts'

type Step = 'auth' | 'profile' | 'skill'

export default function OnboardPage() {
  const [step, setStep] = useState<Step>('auth')
  const [email, setEmail] = useState('')
  const [authMode, setAuthMode] = useState<'magic' | 'signup'>('magic')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Profile fields
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  // Skill fields
  const [wantToList, setWantToList] = useState(false)
  const [skillTitle, setSkillTitle] = useState('')
  const [skillDesc, setSkillDesc] = useState('')
  const [skillCat, setSkillCat] = useState('Programming')
  const [priceInr, setPriceInr] = useState('')
  const [priceMon, setPriceMon] = useState('')

  const supabase = createBrowserClient()
  const router = useRouter()

  async function handleMagicLink() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/onboard?step=profile` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  async function handleSaveProfile() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not signed in'); setLoading(false); return }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      username,
      city,
      bio,
      wallet_address: walletAddress,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setStep('skill')
    setLoading(false)
  }

  async function handleSaveSkill() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (wantToList && skillTitle) {
      await supabase.from('skills').insert({
        provider_id: user.id,
        title: skillTitle,
        description: skillDesc,
        category: skillCat,
        price_inr: priceInr ? parseInt(priceInr) : null,
        price_mon: priceMon ? parseFloat(priceMon) : null,
      })
    }
    setLoading(false)
    router.push('/dashboard')
  }

  // ─── Auth Step ────────────────────────────────────────────────────────────
  if (step === 'auth') {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="text-2xl font-semibold text-gray-900">Get started</h1>
        <p className="mt-2 text-sm text-gray-500">Create an account or sign in to list or hire skills.</p>
        {sent ? (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-700">✓ Magic link sent to <strong>{email}</strong>. Check your inbox.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              onClick={handleMagicLink}
              disabled={loading || !email}
              className="w-full rounded-md bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ─── Profile Step ─────────────────────────────────────────────────────────
  if (step === 'profile') {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="text-2xl font-semibold text-gray-900">Your profile</h1>
        <p className="mt-2 text-sm text-gray-500">This is visible to potential clients.</p>
        <div className="mt-6 space-y-4">
          {[
            { label: 'Full name', value: fullName, set: setFullName, placeholder: 'Riya Sharma' },
            { label: 'Username', value: username, set: setUsername, placeholder: 'riya_sharma' },
            { label: 'City', value: city, set: setCity, placeholder: 'Mumbai' },
            { label: 'Wallet address (optional)', value: walletAddress, set: setWalletAddress, placeholder: '0x...' },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bio (optional)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            onClick={handleSaveProfile}
            disabled={loading || !fullName || !username || !city}
            className="w-full rounded-md bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    )
  }

  // ─── Skill Step ───────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-semibold text-gray-900">List a skill?</h1>
      <p className="mt-2 text-sm text-gray-500">You can always add skills later from your profile.</p>
      <div className="mt-6 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={wantToList}
            onChange={(e) => setWantToList(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700">Yes, I want to list a skill</span>
        </label>
        {wantToList && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Skill title</label>
              <input value={skillTitle} onChange={(e) => setSkillTitle(e.target.value)} placeholder="Python tutoring" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select value={skillCat} onChange={(e) => setSkillCat(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none">
                {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price (INR)</label>
                <input type="number" value={priceInr} onChange={(e) => setPriceInr(e.target.value)} placeholder="500" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price (MON)</label>
                <input type="number" value={priceMon} onChange={(e) => setPriceMon(e.target.value)} placeholder="0.1" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
              </div>
            </div>
          </>
        )}
        <button
          onClick={handleSaveSkill}
          disabled={loading}
          className="w-full rounded-md bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Go to Dashboard →'}
        </button>
      </div>
    </div>
  )
}
