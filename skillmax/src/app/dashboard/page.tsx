import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import JobCard from '@/components/JobCard'
import Link from 'next/link'
import { Plus, Trophy, Wallet, Coins, IndianRupee, CheckCircle2, Award, ShieldCheck } from 'lucide-react'
import { formatINR } from '@/lib/utils'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/onboard')
  const supabase = await createServerClient()

  const [{ data: initialProfile }, { data: clientJobs }, { data: providerJobs }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, username, city')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('jobs')
      .select('id, status, payment_method, price_mon, price_inr, created_at, skills(title), provider_profile:profiles!provider_id(full_name)')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('jobs')
      .select('id, status, payment_method, price_mon, price_inr, created_at, skills(title), client_profile:profiles!client_id(full_name)')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  let profile = initialProfile
  if (!profile && user.email) {
    const { data: pByEmail } = await supabase
      .from('profiles')
      .select('full_name, username, city')
      .eq('email', user.email)
      .maybeSingle()
    if (pByEmail) profile = pByEmail
  }

  if (!profile) {
    const { data: pLatest } = await supabase
      .from('profiles')
      .select('full_name, username, city')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (pLatest) profile = pLatest
  }

  // Financial Earnings Calculations
  const completedProviderJobs = (providerJobs ?? []).filter((j) => j.status === 'completed')

  const totalMonEarned = completedProviderJobs
    .filter((j) => j.payment_method === 'crypto')
    .reduce((acc, curr) => acc + (curr.price_mon ?? 0), 0)

  const totalInrEarned = completedProviderJobs
    .filter((j) => j.payment_method === 'razorpay' || j.payment_method === 'fiat')
    .reduce((acc, curr) => acc + (curr.price_inr ?? 0), 0)

  const activeEscrowMon = (providerJobs ?? [])
    .filter((j) => (j.status === 'created' || j.status === 'provider_done') && j.payment_method === 'crypto')
    .reduce((acc, curr) => acc + (curr.price_mon ?? 0), 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 bg-white">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {profile?.full_name ?? 'User'} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your earnings, service bookings, and active Monad escrow contracts.
          </p>
        </div>

        <Link
          href="/skills/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Offer New Skill</span>
        </Link>
      </div>

      {/* FINANCIAL EARNINGS & METRICS OVERVIEW */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Wallet className="h-4 w-4 text-emerald-600" />
          <span>Financial Earnings &amp; Escrow Overview</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total MON Earned */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total MON Earned</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {totalMonEarned.toFixed(2)} <span className="text-xs font-bold text-emerald-600">MON</span>
            </p>
            <p className="text-[11px] text-slate-400">On-chain Monad testnet escrows</p>
          </div>

          {/* Total INR Earned */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total INR Earned</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <IndianRupee className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {formatINR(totalInrEarned)}
            </p>
            <p className="text-[11px] text-slate-400">Razorpay UPI &amp; Fiat payouts</p>
          </div>

          {/* Active Escrow Locked */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Escrow Locked</span>
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {activeEscrowMon.toFixed(2)} <span className="text-xs font-bold text-blue-600">MON</span>
            </p>
            <p className="text-[11px] text-slate-400">Pending client completion approval</p>
          </div>

          {/* Completed Jobs Count */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Jobs Completed</span>
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {completedProviderJobs.length} <span className="text-xs font-semibold text-slate-500">Jobs</span>
            </p>
            <p className="text-[11px] text-slate-400">Successfully fulfilled services</p>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/skills/new"
          className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 hover:border-emerald-500 hover:shadow-xs transition-all group"
        >
          <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Plus className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">Offer a Skill</h3>
          <p className="text-xs text-slate-500 mt-0.5">List a new service in INR or MON tokens</p>
        </Link>

        <Link
          href="/profile"
          className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 hover:border-emerald-500 hover:shadow-xs transition-all group"
        >
          <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">My Offered Skills &amp; Badges</h3>
          <p className="text-xs text-slate-500 mt-0.5">View your listed skills and Monad achievements</p>
        </Link>

        <Link
          href="/leaderboard"
          className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 hover:border-emerald-500 hover:shadow-xs transition-all group"
        >
          <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Trophy className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">Community Leaderboard</h3>
          <p className="text-xs text-slate-500 mt-0.5">Check city provider rankings and points</p>
        </Link>
      </div>

      {/* Client Jobs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Services I Booked (Client)</h2>
          <Link href="/explore" className="text-xs font-semibold text-emerald-700 hover:underline">
            Book another service →
          </Link>
        </div>

        {clientJobs?.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">You haven't booked any local services yet.</p>
            <Link
              href="/explore"
              className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Explore Skills
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {clientJobs?.map((job) => (
              <JobCard key={job.id} job={job as unknown as React.ComponentProps<typeof JobCard>['job']} perspective="client" />
            ))}
          </div>
        )}
      </section>

      {/* Provider Jobs */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Bookings Received (Provider)</h2>
          <Link href="/profile" className="text-xs font-semibold text-emerald-700 hover:underline">
            Manage my skills →
          </Link>
        </div>

        {providerJobs?.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">No client bookings received yet.</p>
            <Link
              href="/skills/new"
              className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              List a New Skill
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {providerJobs?.map((job) => (
              <JobCard key={job.id} job={job as unknown as React.ComponentProps<typeof JobCard>['job']} perspective="provider" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
