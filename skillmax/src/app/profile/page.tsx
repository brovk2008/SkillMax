import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { OnChainReputation } from '@/components/OnChainReputation'
import { SkillBadges } from '@/components/SkillBadges'
import { AchievementsGrid } from '@/components/AchievementsGrid'
import SkillCard from '@/components/SkillCard'
import Link from 'next/link'
import { UserStats } from '@/lib/achievements'

export default async function MyProfilePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/onboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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

  // Compute user stats for achievements
  const completedJobs = (providerJobs ?? []).filter((j) => j.status === 'completed')
  const cryptoJobs = completedJobs.filter((j) => j.payment_method === 'crypto')
  const inrJobs = completedJobs.filter((j) => j.payment_method === 'razorpay')
  const disputedJobs = (providerJobs ?? []).filter((j) => j.status === 'disputed')
  const totalMonEarned = cryptoJobs.reduce((acc, curr) => acc + (curr.price_mon ?? 0), 0)
  const categoriesCount = new Set((skills ?? []).map((s) => s.category)).size

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
    joinedYear: new Date(profile.created_at ?? Date.now()).getFullYear(),
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 bg-white">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{profile.full_name}</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">@{profile.username} · {profile.city}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/skills/new"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
          >
            + Offer New Skill
          </Link>
          <Link
            href="/settings"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            Edit Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column — Monad On-Chain Details */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bio</h3>
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
          {/* Offered Skills Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Offered Skills</h2>
                <p className="text-xs text-slate-500">Services you offer to local clients</p>
              </div>
              <Link
                href="/skills/new"
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
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

          {/* Community Achievements Section */}
          <div className="pt-4 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Community Achievements</h2>
            <AchievementsGrid stats={stats} />
          </div>
        </div>
      </div>
    </div>
  )
}
