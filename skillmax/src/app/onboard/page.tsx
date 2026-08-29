'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { CATEGORY_NAMES } from '@/lib/contracts'
import {
  User,
  Search,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  ShieldCheck,
  Camera,
  Tag,
  Phone,
  Briefcase,
} from 'lucide-react'

type AuthTab = 'signin' | 'signup'
type SurveyStep = 'auth' | 'profile_survey' | 'skill_tags' | 'offer_skill'

const POPULAR_SKILL_TAGS = [
  'Python', 'JavaScript', 'React', 'Next.js', 'Solidity', 'Web Design',
  'UI/UX Design', 'Logo Design', 'Plumbing', 'Electrician', 'Home Cleaning',
  'Appliance Repair', 'Math Tutoring', 'English Tutoring', 'Guitar Lessons',
  'Piano', 'Fitness Trainer', 'Yoga Instructor', 'Cooking', 'Baking',
  'Photography', 'Video Editing', 'Content Writing', 'SEO Optimization',
  'Car Wash', 'Pet Grooming', 'Tax Consultation', 'Legal Advisory',
]

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
]

export default function OnboardPage() {
  const [tab, setTab] = useState<AuthTab>('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<SurveyStep>('auth')

  // Auth fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Step 1: Profile fields
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [city, setCity] = useState('')

  // Step 2: Survey fields
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0])
  const [headline, setHeadline] = useState('')
  const [gender, setGender] = useState('Prefer not to say')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  // Step 3: Skill Tags
  const [tagSearch, setTagSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState('')

  // Step 4: Offer Skill fields
  const [skillTitle, setSkillTitle] = useState('')
  const [skillDesc, setSkillDesc] = useState('')
  const [skillCat, setSkillCat] = useState('Programming')
  const [priceInr, setPriceInr] = useState('')
  const [priceMon, setPriceMon] = useState('')

  const supabase = createBrowserClient()
  const router = useRouter()

  // Handle Sign In
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

  // Handle Sign Up Step 1
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

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

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      username: username.toLowerCase().trim(),
      city,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('profile_survey')
  }

  // Handle Save Step 2 (Profile Details)
  async function handleSaveProfileSurvey(skip = false) {
    if (!skip) {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({
          avatar_url: avatarUrl,
          headline: headline || null,
          gender,
          phone: phone || null,
          bio: bio || null,
          wallet_address: walletAddress || null,
        }).eq('id', user.id)
      }
      setLoading(false)
    }
    setStep('skill_tags')
  }

  // Handle Save Step 3 (Skill Tags)
  async function handleSaveSkillTags(skip = false) {
    if (!skip && selectedTags.length > 0) {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({
          skill_tags: selectedTags,
        }).eq('id', user.id)
      }
      setLoading(false)
    }
    setStep('offer_skill')
  }

  // Handle Save Step 4 (Skill Service Offer)
  async function handleSaveInitialSkill(skip = false) {
    if (!skip && skillTitle) {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
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
    }
    router.push('/dashboard')
    router.refresh()
  }

  // Tag helper
  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  function addCustomTag() {
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      setSelectedTags([...selectedTags, customTagInput.trim()])
      setCustomTagInput('')
    }
  }

  const filteredTags = POPULAR_SKILL_TAGS.filter((t) =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  )

  // ─── STEP 1: AUTH ──────────────────────────────────────────────────────────
  if (step === 'auth') {
    return (
      <div className="mx-auto max-w-md px-4 py-12 bg-white">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Step 1 of 4: Account Setup
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {tab === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-xs text-slate-500">
            {tab === 'signup'
              ? 'Join SkillMax to hire local talent or offer your skills on-chain.'
              : 'Sign in with your email and password.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mt-6 flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => { setTab('signup'); setError('') }}
            className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
              tab === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setTab('signin'); setError('') }}
            className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
              tab === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {tab === 'signup' ? (
          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Riya Sharma"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Username *</label>
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="riya_sharma"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Home City *</label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Delhi NCR"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{loading ? 'Creating account...' : 'Create Account & Start Survey'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    )
  }

  // ─── STEP 2: PROFILE PERSONA & SURVEY ───────────────────────────────────────
  if (step === 'profile_survey') {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 bg-white space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            <User className="h-3.5 w-3.5 text-emerald-600" />
            Step 2 of 4: Build Profile Persona
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Personalize Your Profile</h1>
          <p className="text-xs text-slate-500">Help clients & neighbors get to know you better.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-5">
          {/* Avatar Photo Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Profile Avatar Photo</label>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="h-14 w-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Paste custom photo URL..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Select a preset photo below or paste your own URL</p>
              </div>
            </div>
            <div className="flex gap-2">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`h-9 w-9 rounded-full overflow-hidden border-2 transition-all ${
                    avatarUrl === url ? 'border-emerald-600 scale-105' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Professional Headline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Tagline / Headline</label>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer, Certified Electrician, Music Teacher"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Gender & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Monad Wallet Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Monad Wallet Address (Optional)</label>
            <input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0xA0C474dDF6b88ae1F0EdC111BB688741b044aaA3"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none font-mono"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">About / Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Describe your background, services offered, or what you enjoy helping neighbors with..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSaveProfileSurvey(true)}
            className="flex-1 rounded-lg border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Skip for Later
          </button>
          <button
            type="button"
            onClick={() => handleSaveProfileSurvey(false)}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>{loading ? 'Saving...' : 'Save & Select Skill Tags'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // ─── STEP 3: INTERACTIVE MULTI-SKILL SEARCH & TAG PICKER ───────────────────
  if (step === 'skill_tags') {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 bg-white space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            <Tag className="h-3.5 w-3.5 text-emerald-600" />
            Step 3 of 4: Select Your Skill Tags
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">What Skills Do You Have?</h1>
          <p className="text-xs text-slate-500">Search and select all skills you can help clients with.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Search skills (e.g. Python, Plumbing, Figma, Tutoring)..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none shadow-xs"
            />
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-semibold text-slate-700">Selected Skills ({selectedTags.length}):</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-xs cursor-pointer hover:bg-red-600 transition-colors"
                    title="Click to remove"
                  >
                    <span>{tag}</span>
                    <span className="text-emerald-200">×</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Popular Tag Catalog */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill Catalog</p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {filteredTags.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs scale-105'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Tag Input */}
          <div className="pt-2 border-t border-slate-200 flex gap-2">
            <input
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
              placeholder="Add custom skill tag..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSaveSkillTags(true)}
            className="flex-1 rounded-lg border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Skip for Later
          </button>
          <button
            type="button"
            onClick={() => handleSaveSkillTags(false)}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>{loading ? 'Saving...' : 'Save & Offer Service'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // ─── STEP 4: OFFER INITIAL SERVICE (OPTIONAL) ──────────────────────────────
  return (
    <div className="mx-auto max-w-lg px-4 py-10 bg-white space-y-6">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
          <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
          Step 4 of 4: List Your Service
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Offer Your First Service</h1>
        <p className="text-xs text-slate-500">List a service with custom pricing in INR or Monad MON.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Service Title *</label>
          <input
            value={skillTitle}
            onChange={(e) => setSkillTitle(e.target.value)}
            placeholder="e.g. Python Tutoring, Web Design, Emergency Plumbing..."
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
          <select
            value={skillCat}
            onChange={(e) => setSkillCat(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
          >
            {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            value={skillDesc}
            onChange={(e) => setSkillDesc(e.target.value)}
            rows={3}
            placeholder="Describe what your service includes, delivery time, etc..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Price (INR)</label>
            <input
              type="number"
              value={priceInr}
              onChange={(e) => setPriceInr(e.target.value)}
              placeholder="500"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Price (MON)</label>
            <input
              type="number"
              step="0.001"
              value={priceMon}
              onChange={(e) => setPriceMon(e.target.value)}
              placeholder="0.1"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleSaveInitialSkill(true)}
          className="flex-1 rounded-lg border border-slate-300 bg-white py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Skip & Go to Dashboard →
        </button>
        <button
          type="button"
          onClick={() => handleSaveInitialSkill(false)}
          disabled={loading}
          className="flex-1 rounded-lg bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
        >
          {loading ? 'Saving...' : 'Complete & Launch Dashboard →'}
        </button>
      </div>
    </div>
  )
}
