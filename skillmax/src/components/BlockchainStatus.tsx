import { monadScanTx } from '@/lib/utils'

interface TxEntry {
  label: string
  hash: string | null | undefined
}

interface BlockchainStatusProps {
  entries: TxEntry[]
}

export function BlockchainStatus({ entries }: BlockchainStatusProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">On-Chain Status</p>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {entry.hash ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">✓</span>
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-gray-400 text-xs">○</span>
              )}
              <span className={`text-sm ${entry.hash ? 'text-gray-900' : 'text-gray-400'}`}>
                {entry.label}
              </span>
            </div>
            {entry.hash ? (
              <a
                href={monadScanTx(entry.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-emerald-600 hover:underline"
              >
                View on MonadScan ↗
              </a>
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
