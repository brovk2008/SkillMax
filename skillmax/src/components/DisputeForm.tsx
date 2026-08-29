'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { ESCROW_ABI, ESCROW_ADDRESS } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'

interface Props {
  jobId: string
  isCrypto: boolean
}

export default function DisputeForm({ jobId, isCrypto }: Props) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const { address, chain } = useAccount()
  const router = useRouter()

  const { writeContract, data: hash } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  async function submitDispute(txHash?: string) {
    const res = await fetch(`/api/jobs/${jobId}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, txHash }),
    })
    if (res.ok) router.push(`/jobs/${jobId}`)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (isCrypto && address && chain?.id === monadTestnet.id) {
      // Raise on-chain too
      writeContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'raiseDispute',
        // Note: chain jobId ≠ db jobId — for MVP we pass 0 as placeholder
        args: [BigInt(0)],
        chainId: monadTestnet.id,
      })
    } else {
      await submitDispute()
      setLoading(false)
    }
  }

  // Submit DB record after chain tx
  if (isSuccess && hash) {
    submitDispute(hash)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Reason for dispute</label>
        <textarea
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Explain what went wrong..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-fuchsia-500 focus:outline-none resize-none text-gray-900"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !reason.trim()}
        className="w-full rounded-md border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Dispute'}
      </button>
    </form>
  )
}
