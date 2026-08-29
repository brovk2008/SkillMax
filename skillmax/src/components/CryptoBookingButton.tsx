'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'
import { ESCROW_ADDRESS, ESCROW_ABI } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'
import { ShieldCheck, Zap } from 'lucide-react'

interface Props {
  skillId: string
  priceMon: number
  providerAddress: string
  providerUserId: string
}

export function CryptoBookingButton({ skillId, priceMon, providerAddress, providerUserId }: Props) {
  const { address, chain } = useAccount()
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState<'idle' | 'approving' | 'done'>('idle')
  const [dbJobId, setDbJobId] = useState<string | null>(null)
  const router = useRouter()

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const totalMon = (priceMon * quantity).toFixed(3)
  const isWrongChain = chain?.id !== monadTestnet.id

  async function handleBook() {
    if (!address) return alert('Connect your wallet first')
    if (isWrongChain) return alert('Switch to Monad Testnet')
    setStatus('approving')
    try {
      writeContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'createJob',
        args: [providerAddress as `0x${string}`],
        value: parseEther(totalMon.toString()),
        chainId: monadTestnet.id,
      })
    } catch {
      setStatus('idle')
    }
  }

  async function createDbJob() {
    const res = await fetch('/api/jobs/create-from-chain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillId,
        providerUserId,
        txHash: hash,
        priceMon: parseFloat(totalMon),
      }),
    })
    const { jobId } = await res.json()
    if (jobId) {
      setDbJobId(jobId)
      setStatus('done')
      router.push(`/jobs/${jobId}`)
    }
  }

  if (isSuccess && status === 'approving' && hash) {
    createDbJob()
  }

  const label = isPending
    ? 'Confirm in wallet...'
    : isConfirming
    ? 'Confirming on Monad...'
    : status === 'done'
    ? 'Booked Successfully'
    : `Pay ${totalMon} MON (Monad Escrow)`

  return (
    <div className="space-y-2 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Quantity / Hours:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-6 w-6 rounded border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
          >
            -
          </button>
          <span className="px-2 font-bold text-slate-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="h-6 w-6 rounded border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleBook}
        disabled={isPending || isConfirming || status === 'done'}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-1.5"
      >
        <Zap className="h-3.5 w-3.5" />
        <span>{label}</span>
      </button>
    </div>
  )
}
