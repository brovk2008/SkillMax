'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'
import { ESCROW_ADDRESS, ESCROW_ABI } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'

interface Props {
  skillId: string
  priceMon: number
  providerAddress: string
  providerUserId: string
}

export function CryptoBookingButton({ skillId, priceMon, providerAddress, providerUserId }: Props) {
  const { address, chain } = useAccount()
  const [status, setStatus] = useState<'idle' | 'approving' | 'done'>('idle')
  const [dbJobId, setDbJobId] = useState<string | null>(null)
  const router = useRouter()

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

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
        value: parseEther(priceMon.toString()),
        chainId: monadTestnet.id,
      })
    } catch {
      setStatus('idle')
    }
  }

  // After tx confirmed → create DB record
  async function createDbJob() {
    const res = await fetch('/api/jobs/create-from-chain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillId,
        providerUserId,
        txHash: hash,
        priceMon,
      }),
    })
    const { jobId } = await res.json()
    if (jobId) {
      setDbJobId(jobId)
      setStatus('done')
      router.push(`/jobs/${jobId}`)
    }
  }

  // Trigger DB creation after chain confirmation
  if (isSuccess && status === 'approving' && hash) {
    createDbJob()
  }

  const label = isPending
    ? 'Confirm in wallet...'
    : isConfirming
    ? 'Confirming on Monad...'
    : status === 'done'
    ? 'Booked Successfully'
    : `Book · ${priceMon} MON`

  return (
    <button
      onClick={handleBook}
      disabled={isPending || isConfirming || status === 'done'}
      className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  )
}
