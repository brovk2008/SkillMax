'use client'

import { useEffect, useState } from 'react'
import { Award, Shield } from 'lucide-react'
import { CATEGORY_NAMES, BADGE_ABI, BADGE_ADDRESS } from '@/lib/contracts'
import { useReadContract } from 'wagmi'

interface Props {
  earnedBadges?: { categoryId: number; badgeCount: number }[]
  walletAddress?: string | null
}

export function SkillBadges({ earnedBadges, walletAddress }: Props) {
  const [earned, setEarned] = useState<{ name: string; count: number }[]>([])

  const { data: contractBadges } = useReadContract({
    address: BADGE_ADDRESS as `0x${string}`,
    abi: BADGE_ABI,
    functionName: 'getBadges',
    args: walletAddress ? [walletAddress as `0x${string}`] : undefined,
    query: {
      enabled: Boolean(walletAddress && !earnedBadges),
    },
  })

  useEffect(() => {
    if (earnedBadges) {
      const list = earnedBadges
        .filter((b) => b.badgeCount > 0)
        .map((b) => ({
          name: CATEGORY_NAMES[b.categoryId] ?? `Category #${b.categoryId}`,
          count: b.badgeCount,
        }))
      setEarned(list)
    } else if (contractBadges) {
      const [ids, balances] = (contractBadges as any) ?? [[], []]
      const list: { name: string; count: number }[] = []
      for (let i = 0; i < ids.length; i++) {
        const count = Number(balances[i] ?? 0n)
        if (count > 0) {
          const catId = Number(ids[i])
          list.push({
            name: CATEGORY_NAMES[catId] ?? `Category #${catId}`,
            count,
          })
        }
      }
      setEarned(list)
    }
  }, [earnedBadges, contractBadges])

  if (earned.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 text-center">
        <p className="text-xs text-gray-400">No soulbound skill badges earned yet.</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Badges are auto-minted on Monad upon job completion.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        <Shield className="h-3.5 w-3.5 text-blue-600" />
        Soulbound Monad Badges
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {earned.map((b) => (
          <span
            key={b.name}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
          >
            <Award className="h-3.5 w-3.5 text-blue-600" />
            <span>{b.name} ×{b.count}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
