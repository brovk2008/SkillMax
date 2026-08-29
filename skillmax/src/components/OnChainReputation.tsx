'use client'

import { useReadContract } from 'wagmi'
import { ESCROW_ABI, ESCROW_ADDRESS } from '@/lib/contracts'
import { shortenAddress, monadScanAddress } from '@/lib/utils'
import { Star, ExternalLink, ShieldCheck } from 'lucide-react'

interface Props {
  walletAddress: string | null
}

export function OnChainReputation({ walletAddress }: Props) {
  const { data: rep, isLoading } = useReadContract({
    address: ESCROW_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'getReputation',
    args: walletAddress ? [walletAddress as `0x${string}`] : undefined,
    query: {
      enabled: Boolean(walletAddress),
    },
  })

  if (!walletAddress) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-400">No wallet connected for on-chain reputation query.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 animate-pulse">
        <p className="text-xs text-gray-400">Querying Monad smart contract...</p>
      </div>
    )
  }

  const [jobsCount, avgRating100] = (rep as any) ?? [0n, 0n]
  const jobs = Number(jobsCount ?? 0n)
  const avgDisplay = jobs > 0 ? (Number(avgRating100 ?? 0n) / 100).toFixed(1) : 'No ratings'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-fuchsia-600" />
          On-Chain Monad Reputation
        </span>
        <span className="inline-flex items-center rounded-full bg-fuchsia-50 px-2 py-0.5 text-xs font-medium text-fuchsia-700">
          Live Escrow Data
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
        <div>
          <p className="text-xs text-gray-400">Completed Jobs</p>
          <p className="text-xl font-bold text-gray-900">{jobs}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Average Rating</p>
          <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {avgDisplay}
          </p>
        </div>
      </div>

      <a
        href={monadScanAddress(walletAddress)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-mono text-xs text-fuchsia-600 hover:underline pt-1"
      >
        <span>{shortenAddress(walletAddress)}</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}
