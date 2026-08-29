'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { ESCROW_ADDRESS, ESCROW_ABI } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'
import { Lock, Zap, Loader2, CheckCircle2 } from 'lucide-react'

interface FundEscrowButtonProps {
  jobId: string
  priceMon: number
  providerAddress?: string | null
  providerName: string
}

export function FundEscrowButton({
  jobId,
  priceMon,
  providerAddress,
  providerName,
}: FundEscrowButtonProps) {
  const [status, setStatus] = useState<'idle' | 'funding' | 'syncing' | 'done'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()
  const { address, isConnected, chain } = useAccount()

  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const isWrongChain = chain?.id !== monadTestnet.id

  async function handleFund() {
    if (!isConnected || !address) {
      alert('Please connect your Web3 wallet using the button in the top header.')
      return
    }

    if (isWrongChain) {
      alert('Please switch your wallet network to Monad Testnet (Chain ID 10143).')
      return
    }

    // Use provider's wallet address or default to the platform address if provider hasn't set one yet
    const targetProvider = providerAddress || address

    setStatus('funding')
    setError('')

    try {
      const txHash = await writeContractAsync({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'createJob',
        args: [targetProvider as `0x${string}`],
        value: parseEther(priceMon.toString()),
        chainId: monadTestnet.id,
      })

      setStatus('syncing')

      // Call API to record fund transfer
      const res = await fetch(`/api/jobs/${jobId}/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus('done')
        router.refresh()
      } else {
        setError(data.error || 'Failed to sync escrow status')
        setStatus('idle')
      }
    } catch (err: any) {
      console.error('Escrow funding error:', err)
      setError(err.message || 'Transaction rejected or failed')
      setStatus('idle')
    }
  }

  return (
    <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 p-4 space-y-2.5 shadow-xs">
      <div className="flex items-start gap-2.5">
        <div className="size-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Lock className="size-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">Action Required: Fund Smart Escrow</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Lock <strong>{priceMon} MON</strong> in the Monad smart contract. {providerName} will start work knowing payout is guaranteed.
          </p>
        </div>
      </div>

      <button
        onClick={handleFund}
        disabled={isPending || isConfirming || status === 'funding' || status === 'syncing' || status === 'done'}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        {isPending || status === 'funding' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Confirm in wallet...</span>
          </>
        ) : isConfirming || status === 'syncing' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Locking {priceMon} MON on Monad...</span>
          </>
        ) : status === 'done' ? (
          <>
            <CheckCircle2 className="size-4" />
            <span>Escrow Locked Successfully</span>
          </>
        ) : (
          <>
            <Zap className="size-4 text-emerald-200" />
            <span>Transfer {priceMon} MON to Escrow</span>
          </>
        )}
      </button>

      {error && <p className="text-[10px] text-red-600 font-semibold text-center">{error}</p>}
    </div>
  )
}
