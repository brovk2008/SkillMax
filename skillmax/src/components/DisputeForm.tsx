'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWriteContract, useAccount } from 'wagmi'
import { ESCROW_ABI, ESCROW_ADDRESS } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface Props {
  jobId: string
  isCrypto: boolean
  chainJobId?: number | null
}

export default function DisputeForm({ jobId, isCrypto, chainJobId }: Props) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const { address, chain } = useAccount()
  const router = useRouter()

  const { writeContractAsync } = useWriteContract()

  async function submitDispute(txHash?: string) {
    const res = await fetch(`/api/jobs/${jobId}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, txHash }),
    })
    if (res.ok) {
      router.push(`/jobs/${jobId}`)
      router.refresh()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let txHash: string | undefined = undefined

      if (isCrypto && chainJobId && address && chain?.id === monadTestnet.id) {
        try {
          txHash = await writeContractAsync({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: 'raiseDispute',
            args: [BigInt(chainJobId)],
            chainId: monadTestnet.id,
          })
        } catch (chainErr) {
          console.warn('On-chain dispute call:', chainErr)
        }
      }

      await submitDispute(txHash)
    } catch (err) {
      console.error('Dispute submission error:', err)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Detailed Reason for Arbitration
        </label>
        <textarea
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Explain specifically what deliverables or requirements were not met..."
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none resize-none text-slate-900 shadow-2xs"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !reason.trim()}
        className="w-full rounded-xl border border-red-300 bg-red-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Transmitting to Monad Arbiter...</span>
          </>
        ) : (
          <>
            <AlertTriangle className="size-4 text-red-200" />
            <span>Submit Dispute to Monad Arbitration</span>
          </>
        )}
      </button>
    </form>
  )
}
