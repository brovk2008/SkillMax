'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Award, Zap } from 'lucide-react'
import { useWriteContract, useAccount } from 'wagmi'
import { ESCROW_ABI, ESCROW_ADDRESS } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'

interface ReleasePaymentButtonProps {
  jobId: string
  isCrypto?: boolean
  chainJobId?: number | null
}

export function ReleasePaymentButton({ jobId, isCrypto = false, chainJobId }: ReleasePaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { isConnected, chain } = useAccount()

  const { writeContractAsync } = useWriteContract()

  async function handleRelease() {
    if (!confirm('Are you sure you want to release escrow funds and finalize this job?')) return

    setLoading(true)
    setError('')

    try {
      let txHash: string | undefined = undefined

      // If crypto job and on-chain job ID is available, execute smart contract release on Monad!
      if (isCrypto && chainJobId && isConnected && chain?.id === monadTestnet.id) {
        try {
          txHash = await writeContractAsync({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: 'markComplete',
            args: [BigInt(chainJobId)],
            chainId: monadTestnet.id,
          })
        } catch (chainErr: unknown) {
          console.warn('On-chain release error:', chainErr)
          // Allow fallback to database completion if chain transaction was rejected by RPC
          if (!confirm('On-chain transaction could not complete. Mark job as complete in SkillMax protocol anyway?')) {
            setLoading(false)
            return
          }
        }
      }

      const res = await fetch(`/api/jobs/${jobId}/mark-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to release payment')
        setLoading(false)
        return
      }

      router.refresh()
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Network error')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleRelease}
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Releasing Escrow & Minting Badge...</span>
          </>
        ) : (
          <>
            {isCrypto ? <Zap className="size-4 text-emerald-200" /> : <Award className="size-4 text-emerald-200" />}
            <span>Release Payment & Approve</span>
            <CheckCircle2 className="size-4" />
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600 font-semibold text-center">{error}</p>}
    </div>
  )
}
