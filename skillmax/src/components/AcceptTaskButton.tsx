'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, ArrowRight, User } from 'lucide-react'

interface AcceptTaskButtonProps {
  taskId: string
  taskClientId: string
  currentUserId?: string | null
}

export function AcceptTaskButton({ taskId, taskClientId, currentUserId }: AcceptTaskButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const isOwnTask = currentUserId === taskClientId

  if (isOwnTask) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200">
        <User className="size-3 text-slate-400" />
        <span>Your Task</span>
      </span>
    )
  }

  async function handleAccept() {
    if (!currentUserId) {
      router.push('/onboard')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/tasks/${taskId}/accept`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to accept task')
        setLoading(false)
        return
      }

      // Success: Navigate directly to the active job
      router.push(`/jobs/${data.jobId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Network error')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleAccept}
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        title="Accept this task and start working"
      >
        {loading ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Accepting...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="size-3.5" />
            <span>Accept Task</span>
            <ArrowRight className="size-3" />
          </>
        )}
      </button>
      {error && <span className="text-[10px] text-red-600 font-semibold">{error}</span>}
    </div>
  )
}
