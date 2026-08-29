'use client'

import { monadScanTx } from '@/lib/utils'
import { CheckCircle2, ExternalLink } from 'lucide-react'

interface TxEntry {
  label: string
  hash?: string
  status: 'idle' | 'pending' | 'success' | 'failed'
}

interface Props {
  entries: TxEntry[]
}

export function BlockchainStatus({ entries }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Monad Blockchain Activity
      </p>

      <div className="space-y-2">
        {entries.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2">
              {entry.status === 'success' && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
              )}
              {entry.status === 'pending' && (
                <span className="h-3 w-3 rounded-full bg-amber-400 animate-ping" />
              )}
              {entry.status === 'idle' && (
                <span className="h-2 w-2 rounded-full bg-gray-300" />
              )}
              <span className="font-medium text-gray-800">{entry.label}</span>
            </div>

            {entry.hash ? (
              <a
                href={monadScanTx(entry.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-fuchsia-600 hover:underline"
              >
                <span>View on MonadScan</span>
                <ExternalLink className="h-3 w-3" />
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
