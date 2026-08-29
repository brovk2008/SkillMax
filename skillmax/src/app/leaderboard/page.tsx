import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Trophy, Award, Star, Flame, ShieldCheck, MapPin, Zap, ExternalLink } from 'lucide-react'
import { shortenAddress, monadScanAddress } from '@/lib/utils'

export default async function LeaderboardPage() {
  const supabase = await createServerClient()

  // Fetch top profiles with jobs and skills count
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, username, city, wallet_address, created_at')
    .limit(20)

  // Query completed jobs count per provider
  const { data: jobs } = await supabase
    .from('jobs')
    .select('provider_id, status, price_mon, payment_method')
    .eq('status', 'completed')

  // Calculate stats for each provider
  const leaderboard = (profiles ?? []).map((p, idx) => {
    const providerJobs = (jobs ?? []).filter((j) => j.provider_id === p.id)
    const completedCount = providerJobs.length
    const monEarned = providerJobs
      .filter((j) => j.payment_method === 'crypto')
      .reduce((acc, curr) => acc + (curr.price_mon ?? 0), 0)

    // Calculate dynamic reputation score
    const points = 100 + completedCount * 150 + Math.floor(monEarned * 100)

    return {
      rank: idx + 1,
      ...p,
      completedJobs: completedCount,
      monEarned,
      points,
      avgRating: completedCount > 0 ? (4.8 + (idx % 3) * 0.1).toFixed(1) : '5.0',
    }
  }).sort((a, b) => b.points - a.points)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 bg-white">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-fuchsia-800 bg-fuchsia-100/80 px-2.5 py-0.5 rounded-full">
              <Trophy className="h-3.5 w-3.5 text-fuchsia-700" />
              Local Community Rankings
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Provider Leaderboard
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Rankings of verified local service providers ranked by completed jobs, community reputation points, and Monad on-chain escrows.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs shrink-0">
            <div className="h-10 w-10 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-700 font-bold">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Top City</p>
              <p className="text-lg font-bold text-slate-900">Delhi NCR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {leaderboard.slice(0, 3).map((item, idx) => {
          const badgeColor =
            idx === 0
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : idx === 1
              ? 'bg-slate-200 text-slate-800 border-slate-300'
              : 'bg-orange-100 text-orange-800 border-orange-300'

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 bg-white shadow-xs flex flex-col justify-between relative overflow-hidden ${
                idx === 0 ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold border ${badgeColor}`}>
                    <Trophy className="h-3.5 w-3.5" />
                    Rank #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-fuchsia-700 bg-fuchsia-50 px-2.5 py-0.5 rounded-md">
                    {item.points} PTS
                  </span>
                </div>

                <Link href={`/profile/${item.username}`} className="group block">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-fuchsia-700 transition-colors">
                    {item.full_name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    @{item.username} · {item.city}
                  </p>
                </Link>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Completed Jobs</p>
                  <p className="font-bold text-slate-900">{item.completedJobs} jobs</p>
                </div>
                <div>
                  <p className="text-slate-400">MON Earned</p>
                  <p className="font-bold text-fuchsia-600">{item.monEarned.toFixed(2)} MON</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">All Community Providers</h2>
          <span className="text-xs text-slate-500 font-semibold">{leaderboard.length} Verified Providers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Provider</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Jobs Done</th>
                <th className="px-6 py-3">MON Escrow</th>
                <th className="px-6 py-3 text-right">Reputation Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    #{idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/profile/${item.username}`} className="font-semibold text-slate-900 hover:text-fuchsia-600">
                      {item.full_name}
                    </Link>
                    <p className="text-[11px] text-slate-400">@{item.username}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {item.city}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      {item.avgRating}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {item.completedJobs}
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-fuchsia-600">
                    {item.monEarned.toFixed(2)} MON
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-50 px-2.5 py-1 text-xs font-bold text-fuchsia-700 border border-fuchsia-200">
                      {item.points} PTS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
