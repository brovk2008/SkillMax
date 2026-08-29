'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'
import { ESCROW_ADDRESS, ESCROW_ABI } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'
import { Zap, Loader2, CheckCircle2 } from 'lucide-react'

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
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const totalMon = (priceMon * quantity).toFixed(3)
  const isWrongChain = chain?.id !== monadTestnet.id

  async function handleBook() {
    if (!address) return alert('Please connect your Web3 wallet first using the top header button.')
    if (isWrongChain) return alert('Please switch your wallet network to Monad Testnet (Chain ID 10143).')
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
    if (submitting) return
    setSubmitting(true)

    let chainJobId: number | null = null
    if (receipt && receipt.logs && receipt.logs.length > 0) {
      try {
        const topic1 = receipt.logs[0].topics[1]
        if (topic1) {
          chainJobId = Number(BigInt(topic1))
        }
      } catch (e) {
        console.warn('Could not parse chainJobId from receipt:', e)
      }
    }

    try {
      const res = await fetch('/api/jobs/create-from-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId,
          providerUserId,
          txHash: hash,
          priceMon: parseFloat(totalMon),
          chainJobId,
        }),
      })
      const data = await res.json()
      if (data.jobId) {
        setStatus('done')
        router.push(`/jobs/${data.jobId}`)
        router.refresh()
      } else {
        setStatus('idle')
        setSubmitting(false)
      }
    } catch (err) {
      console.error('Job sync error:', err)
      setStatus('idle')
      setSubmitting(false)
    }
  }

  if (isSuccess && status === 'approving' && hash && !submitting) {
    createDbJob()
  }

  const label = isPending
    ? 'Approve in wallet...'
    : isConfirming
    ? 'Confirming on Monad Testnet...'
    : submitting
    ? 'Creating Escrow Job...'
    : status === 'done'
    ? 'Escrow Locked Successfully'
    : `Pay ${totalMon} MON (Smart Escrow)`

  return (
    <div className="space-y-2.5 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Quantity / Hours:</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="size-7 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
          >
            -
          </button>
          <span className="px-2 font-bold text-slate-900 text-sm tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="size-7 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleBook}
        disabled={isPending || isConfirming || submitting || status === 'done'}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        {isPending || isConfirming || submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : status === 'done' ? (
          <CheckCircle2 className="size-4 text-white" />
        ) : (
          <Zap className="size-4 text-emerald-200" />
        )}
        <span>{label}</span>
      </button>
    </div>
  )
}
