import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { OnChainReputation } from '@/components/OnChainReputation'
import { SkillBadges } from '@/components/SkillBadges'
import { AchievementsGrid } from '@/components/AchievementsGrid'
import SkillCard from '@/components/SkillCard'
import Link from 'next/link'
import { UserStats } from '@/lib/achievements'
import { MapPin, Phone, User as UserIcon, Tag, CheckCircle2 } from 'lucide-react'

export default async function MyProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/onboard')
  const supabase = await createServerClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) redirect('/onboard')

  const { data: skills } = await supabase
    .from('skills')
    .select('id, title, category, price_inr, price_mon, is_active, profiles(username, full_name, city)')
    .eq('provider_id', user.id)
    .order('created_at', { ascending: false })

  const { data: providerJobs } = await supabase
    .from('jobs')
    .select('id, status, payment_method, price_mon, price_inr, category')
    .eq('provider_id', user.id)

  const completedJobs = (providerJobs ?? []).filter((j) => j.status === 'completed')
  const cryptoJobs = completedJobs.filter((j) => j.payment_method === 'crypto')
  const inrJobs = completedJobs.filter((j) => j.payment_method === 'razorpay')
  const disputedJobs = (providerJobs ?? []).filter((j) => j.status === 'disputed')
  const totalMonEarned = cryptoJobs.reduce((acc, curr) => acc + (curr.price_mon ?? 0), 0)
  const categoriesCount = new Set((skills ?? []).map((s) => s.category)).size
  const skillTags = (profile.skill_tags as string[]) ?? []

  const stats: UserStats = {
    skillsCount: skills?.length ?? 0,
    completedJobsCount: completedJobs.length,
    cryptoJobsCount: cryptoJobs.length,
    inrJobsCount: inrJobs.length,
    disputedJobsCount: disputedJobs.length,
    avgRating: completedJobs.length > 0 ? 4.9 : 5.0,
    totalMonEarned,
    totalInrEarned: 0,
    chatMessagesCount: 5,
    categoriesCount,
    city: profile.city ?? '',
    joinedYear: new Date(profile.created_at || '2026-01-01').getFullYear(),
  }

  const avatar = profile.avatar_url || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 bg-white">
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={profile.full_name}
              className="h-20 w-20 rounded-full object-cover border-2 border-emerald-500 shadow-sm shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{profile.full_name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Verified
                </span>
              </div>

              {profile.headline && (
                <p className="text-xs font-semibold text-emerald-700">{profile.headline}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  @{profile.username} · {profile.city}
                </span>
                {profile.gender && profile.gender !== 'Prefer not to say' && (
                  <span>· {profile.gender}</span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <Link
              href="/skills/new"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
            >
              + Offer Skill
            </Link>
            <Link
              href="/settings"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              Edit Settings
            </Link>
          </div>
        </div>

        {/* Skill Tags */}
        {skillTags.length > 0 && (
          <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Tag className="h-3 w-3 text-emerald-600" />
              Skill Tags:
            </span>
            {skillTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column — Monad Reputation */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">About & Experience</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{profile.bio || 'No bio written yet.'}</p>
          </div>

          {profile.wallet_address ? (
            <>
              <OnChainReputation walletAddress={profile.wallet_address} />
              <SkillBadges walletAddress={profile.wallet_address} />
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center">
              <p className="text-xs text-slate-500">No Monad wallet address linked.</p>
              <Link href="/settings" className="text-xs font-semibold text-emerald-600 hover:underline">
                Link Wallet in Settings →
              </Link>
            </div>
          )}
        </div>

        {/* Right Column — Offered Skills & Achievements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Offered Skills */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Offered Services ({skills?.length ?? 0})</h2>
                <p className="text-xs text-slate-500">Services listed for local clients</p>
              </div>
              <Link href="/skills/new" className="text-xs font-semibold text-emerald-700 hover:underline">
                + Create Listing
              </Link>
            </div>

            {!skills?.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-sm text-slate-500">You haven't listed any skills yet.</p>
                <Link
                  href="/skills/new"
                  className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Offer Your First Skill
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="relative">
                    <SkillCard skill={skill as any} />
                    {!skill.is_active && (
                      <span className="absolute top-3 right-3 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        Hidden
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Community Achievements */}
          <div className="pt-4 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Community Achievements</h2>
            <AchievementsGrid stats={stats} />
          </div>
        </div>
      </div>
    </div>
  )
}
