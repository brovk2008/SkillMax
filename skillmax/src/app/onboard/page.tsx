'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { CATEGORY_NAMES } from '@/lib/contracts'

type AuthTab = 'signin' | 'signup'

export default function OnboardPage() {
  const [tab, setTab] = useState<AuthTab>('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'auth' | 'skill'>('auth')

  // Auth fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Profile fields (for Sign Up)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  // Skill fields (optional post-signup step)
  const [wantToList, setWantToList] = useState(false)
  const [skillTitle, setSkillTitle] = useState('')
  const [skillDesc, setSkillDesc] = useState('')
  const [skillCat, setSkillCat] = useState('Programming')
  const [priceInr, setPriceInr] = useState('')
  const [priceMon, setPriceMon] = useState('')

  const supabase = createBrowserClient()
  const router = useRouter()

  // Handle Sign In (Email + Password)
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  // Handle Sign Up (Create Account + Store Profile in DB)
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Create auth user
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const user = data.user
    if (!user) {
      setError('Failed to create account. Please try again.')
      setLoading(false)
      return
    }

    // 2. Store profile in Supabase profiles table
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      username: username.toLowerCase().trim(),
      city,
      bio: bio || null,
      wallet_address: walletAddress || null,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('skill')
  }

  // Handle Skill Listing
  async function handleSaveSkill() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user && wantToList && skillTitle) {
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
    router.refresh()
  }

  // ─── Step 1: Auth (Sign In / Sign Up) ──────────────────────────────────────
  if (step === 'auth') {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {tab === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {tab === 'signup'
              ? 'Join SkillMax to hire local talent or offer your skills on-chain.'
              : 'Sign in with your email and password.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mt-6 flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => { setTab('signup'); setError('') }}
            className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors ${
              tab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setTab('signin'); setError('') }}
            className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors ${
              tab === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        {tab === 'signup' ? (
          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Riya Sharma"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Username *</label>
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="riya_sharma"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Delhi"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Wallet Address (Optional)</label>
              <input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0xA0C474dDF6b88ae1F0EdC111BB688741b044aaA3"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bio (Optional)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Tell others what you do..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account & Continue →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        )}
      </div>
    )
  }

  // ─── Step 2: Post-Signup Skill Creation (Optional) ─────────────────────────
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold text-gray-900">List your first skill?</h1>
      <p className="mt-1 text-sm text-gray-500">You can also skip this and add skills anytime from your profile.</p>

      <div className="mt-6 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={wantToList}
            onChange={(e) => setWantToList(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-medium text-gray-700">Yes, I want to list a skill now</span>
        </label>

        {wantToList && (
          <div className="space-y-4 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Skill Title *</label>
              <input
                value={skillTitle}
                onChange={(e) => setSkillTitle(e.target.value)}
                placeholder="Python Tutoring, Web Design..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                value={skillCat}
                onChange={(e) => setSkillCat(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              >
                {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={skillDesc}
                onChange={(e) => setSkillDesc(e.target.value)}
                rows={3}
                placeholder="Describe your service..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price (INR)</label>
                <input
                  type="number"
                  value={priceInr}
                  onChange={(e) => setPriceInr(e.target.value)}
                  placeholder="500"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price (MON)</label>
                <input
                  type="number"
                  step="0.001"
                  value={priceMon}
                  onChange={(e) => setPriceMon(e.target.value)}
                  placeholder="0.1"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSaveSkill}
          disabled={loading}
          className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Finish & Go to Dashboard →'}
        </button>
      </div>
    </div>
  )
}
