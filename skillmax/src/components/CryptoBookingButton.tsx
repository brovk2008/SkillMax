'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConnect, useSwitchChain } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'
import { ESCROW_ADDRESS, ESCROW_ABI } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'
import { Zap, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface Props {
  skillId: string
  priceMon: number
  providerAddress: string
  providerUserId: string
}

export function CryptoBookingButton({ skillId, priceMon, providerAddress, providerUserId }: Props) {
  const { address, isConnected, chain } = useAccount()
  const { connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const [status, setStatus] = useState<'idle' | 'connecting' | 'approving' | 'syncing' | 'done'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const totalMon = priceMon.toString()
  const isWrongChain = isConnected && chain?.id !== monadTestnet.id

  // When transaction succeeds on-chain, record job in DB
  useEffect(() => {
    if (isSuccess && hash && !submitting) {
      createDbJob(hash)
    }
  }, [isSuccess, hash])

  async function handleBook() {
    setErrorMsg('')
    let activeAddress = address

    // 1. Connect wallet if not connected
    if (!isConnected || !activeAddress) {
      setStatus('connecting')
      try {
        const result = await connectAsync({ connector: injected(), chainId: monadTestnet.id })
        activeAddress = result.accounts[0]
      } catch (err: unknown) {
        console.error('Wallet connection failed:', err)
        setErrorMsg('Please connect your Web3 wallet (MetaMask / Monad).')
        setStatus('idle')
        return
      }
    }

    // 2. Switch network to Monad Testnet if on another chain
    if (chain?.id !== monadTestnet.id) {
      try {
        await switchChainAsync({ chainId: monadTestnet.id })
      } catch (err: unknown) {
        console.warn('Could not auto-switch network:', err)
      }
    }

    // 3. Prompt smart contract escrow transaction
    setStatus('approving')
    try {
      const txHash = await writeContractAsync({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'createJob',
        args: [providerAddress as `0x${string}`],
        value: parseEther(totalMon),
        chainId: monadTestnet.id,
      })

      setStatus('syncing')
      // If receipt is already available or wait for it
    } catch (err: unknown) {
      console.error('Escrow transaction error:', err)
      setErrorMsg((err as Error)?.message || 'Transaction was rejected.')
      setStatus('idle')
    }
  }

  async function createDbJob(txHash: string) {
    if (submitting) return
    setSubmitting(true)
    setStatus('syncing')

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
          txHash,
          priceMon: parseFloat(totalMon),
          chainJobId,
          clientAddress: address,
        }),
      })
      const data = await res.json()
      if (data.jobId) {
        setStatus('done')
        router.push(`/jobs/${data.jobId}`)
        router.refresh()
      } else {
        setErrorMsg(data.error || 'Failed to sync job state')
        setStatus('idle')
        setSubmitting(false)
      }
    } catch (e: unknown) {
      setErrorMsg((e as Error)?.message || 'Network sync error')
      setStatus('idle')
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleBook}
        disabled={isPending || isConfirming || status === 'approving' || status === 'syncing' || status === 'done'}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {status === 'connecting' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Connecting Wallet...</span>
          </>
        ) : isPending || status === 'approving' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Confirm in Wallet ({totalMon} MON)...</span>
          </>
        ) : isConfirming || status === 'syncing' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Locking in Monad Escrow...</span>
          </>
        ) : status === 'done' ? (
          <>
            <CheckCircle2 className="size-4" />
            <span>Escrow Locked! Redirecting...</span>
          </>
        ) : (
          <>
            <Zap className="size-4 text-emerald-200 fill-emerald-200" />
            <span>Pay {totalMon} MON (Smart Escrow)</span>
          </>
        )}
      </button>

      {errorMsg && (
        <div className="flex items-center gap-1.5 p-2 bg-red-50 text-red-700 text-[11px] rounded-lg">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  )
}
