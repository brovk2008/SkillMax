'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'

interface MarkDoneButtonProps {
  jobId: string
}

export function MarkDoneButton({ jobId }: MarkDoneButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleMarkDone() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/jobs/${jobId}/mark-done`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to mark job as done')
        setLoading(false)
        return
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Network error')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleMarkDone}
        disabled={loading}
        className="w-full rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-800 px-4 py-2.5 text-xs font-bold hover:bg-emerald-100 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Updating job status...</span>
          </>
        ) : (
          <>
            <Check className="size-3.5 text-emerald-600 stroke-[3]" />
            <span>Mark Work Complete (Provider Sign-off)</span>
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600 font-semibold text-center">{error}</p>}
    </div>
  )
}
