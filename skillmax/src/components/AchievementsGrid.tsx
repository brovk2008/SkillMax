'use client'

import { useState, useMemo } from 'react'
import { COMMUNITY_ACHIEVEMENTS, UserStats } from '@/lib/achievements'
import { Trophy, Award, Lock, CheckCircle2, Flame, ShieldCheck } from 'lucide-react'

interface Props {
  stats: UserStats
}

export function AchievementsGrid({ stats }: Props) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  const { items, totalPoints, unlockedCount } = useMemo(() => {
    const list = COMMUNITY_ACHIEVEMENTS.map((ach) => {
      const { unlocked, progress, maxProgress } = ach.checkUnlocked(stats)
      return {
        ...ach,
        unlocked,
        progress,
        maxProgress,
      }
    })
    const points = list.filter((i) => i.unlocked).reduce((acc, i) => acc + i.points, 0)
    const count = list.filter((i) => i.unlocked).length
    return { items: list, totalPoints: points, unlockedCount: count }
  }, [stats])

  const filteredItems = items.filter((item) => {
    if (filter === 'unlocked') return item.unlocked
    if (filter === 'locked') return !item.unlocked
    return true
  })

  // Level calculation
  const level = Math.floor(totalPoints / 250) + 1
  const levelTitle =
    level >= 5
      ? 'Legendary Community Champion'
      : level >= 3
      ? 'Senior Local Helper'
      : level >= 2
      ? 'Active Community Member'
      : 'Novice Helper'

  return (
    <div className="space-y-6">
      {/* Reputation & Level Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              Community Level {level}
            </span>
            <h2 className="text-2xl font-bold text-slate-900">{levelTitle}</h2>
            <p className="text-xs text-slate-500">
              Unlocked {unlockedCount} of {COMMUNITY_ACHIEVEMENTS.length} community milestones
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs shrink-0">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Reputation Score</p>
              <p className="text-2xl font-extrabold text-slate-900">{totalPoints} <span className="text-xs font-semibold text-emerald-600">PTS</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          {[
            { id: 'all', label: `All (${items.length})` },
            { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
            { id: 'locked', label: `In Progress (${items.length - unlockedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((ach) => {
          const Icon = ach.icon
          return (
            <div
              key={ach.id}
              className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'border-emerald-200 bg-white shadow-xs hover:border-emerald-300'
                  : 'border-slate-200 bg-slate-50/60 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      ach.unlocked
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      ach.unlocked
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    +{ach.points} PTS
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{ach.title}</span>
                  {ach.unlocked ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  )}
                </h3>

                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{ach.progress} / {ach.maxProgress}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      ach.unlocked ? 'bg-emerald-600' : 'bg-slate-400'
                    }`}
                    style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
