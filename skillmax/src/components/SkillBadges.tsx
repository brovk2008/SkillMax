'use client'

import { useReadContract } from 'wagmi'
import { BADGE_ABI, BADGE_ADDRESS, CATEGORY_NAMES } from '@/lib/contracts'

export function SkillBadges({ walletAddress }: { walletAddress: string }) {
  const { data, isLoading } = useReadContract({
    address: BADGE_ADDRESS,
    abi: BADGE_ABI,
    functionName: 'getBadges',
    args: [walletAddress as `0x${string}`],
  })

  if (isLoading || !data) return null

  const counts = (data as unknown) as bigint[]
  const earned = counts
    .map((count, i) => ({ name: CATEGORY_NAMES[i], count: Number(count) }))
    .filter((b) => b.count > 0)

  if (earned.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Skill Badges</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {earned.map((b) => (
          <span
            key={b.name}
            className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
          >
            {b.name} ×{b.count}
          </span>
        ))}
      </div>
    </div>
  )
}
