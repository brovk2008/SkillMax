'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Award } from 'lucide-react'

interface ReleasePaymentButtonProps {
  jobId: string
}

export function ReleasePaymentButton({ jobId }: ReleasePaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleRelease() {
    if (!confirm('Are you sure you want to release payment and finalize this job?')) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/jobs/${jobId}/mark-complete`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to release payment')
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
        onClick={handleRelease}
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Releasing Payment & Minting Badge...</span>
          </>
        ) : (
          <>
            <Award className="size-4 text-emerald-200" />
            <span>Release Payment & Approve</span>
            <CheckCircle2 className="size-4" />
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600 font-semibold text-center">{error}</p>}
    </div>
  )
}
