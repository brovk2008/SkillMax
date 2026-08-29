'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { monadTestnet } from '@/lib/wagmi/config'
import { shortenAddress } from '@/lib/utils'
import { Wallet } from 'lucide-react'

export function WalletConnectButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const isWrongNetwork = isConnected && chain?.id !== monadTestnet.id

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        {isWrongNetwork && (
          <button
            onClick={() => connect({ connector: injected(), chainId: monadTestnet.id })}
            className="rounded-lg bg-red-600 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white hover:bg-red-700 shadow-2xs shrink-0"
          >
            Switch Network
          </button>
        )}
        <button
          onClick={() => disconnect()}
          className="rounded-lg border border-slate-300 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 shadow-2xs shrink-0 flex items-center gap-1"
          title="Click to disconnect wallet"
        >
          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
          <span>{shortenAddress(address)}</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injected(), chainId: monadTestnet.id })}
      className="rounded-lg border border-slate-300 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs flex items-center gap-1.5 shrink-0"
    >
      <Wallet className="size-3.5 text-emerald-600 shrink-0" />
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Wallet</span>
    </button>
  )
}
