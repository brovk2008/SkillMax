'use client'

import { useReadContract } from 'wagmi'
import { ESCROW_ABI, ESCROW_ADDRESS } from '@/lib/contracts'
import { shortenAddress, monadScanAddress } from '@/lib/utils'

export function OnChainReputation({ walletAddress }: { walletAddress: string }) {
  const { data, isLoading } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'getReputation',
    args: [walletAddress as `0x${string}`],
  })

  if (isLoading) return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs text-gray-400">Loading on-chain data...</p>
    </div>
  )

  if (!data) return null

  const [completed, disputed, ratingCount, avgRating100] = data as [bigint, bigint, bigint, bigint]
  const avgDisplay = ratingCount > BigInt(0)
    ? (Number(avgRating100) / 100).toFixed(1)
    : '—'

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">On-Chain Reputation</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xl font-semibold text-gray-900">{completed.toString()}</p>
          <p className="text-xs text-gray-500">Verified jobs</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-900">★ {avgDisplay}</p>
          <p className="text-xs text-gray-500">Avg rating</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-900">{disputed.toString()}</p>
          <p className="text-xs text-gray-500">Disputes</p>
        </div>
      </div>
      <a
        href={monadScanAddress(walletAddress)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block font-mono text-xs text-purple-600 hover:underline"
      >
        {shortenAddress(walletAddress)} ↗ MonadScan
      </a>
    </div>
  )
}
