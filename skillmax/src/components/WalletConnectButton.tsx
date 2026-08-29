'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { monadTestnet } from '@/lib/wagmi/config'
import { shortenAddress } from '@/lib/utils'

export function WalletConnectButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const isWrongNetwork = isConnected && chain?.id !== monadTestnet.id

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {isWrongNetwork && (
          <button
            onClick={() => connect({ connector: injected(), chainId: monadTestnet.id })}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            Switch to Monad
          </button>
        )}
        <button
          onClick={() => disconnect()}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          {shortenAddress(address)}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injected(), chainId: monadTestnet.id })}
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
    >
      Connect Wallet
    </button>
  )
}
