import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import DisputeForm from '@/components/DisputeForm'
import Link from 'next/link'

export default async function DisputePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/onboard')
  const supabase = await createServerClient()
  const { id } = await params

  const { data: job } = await supabase
    .from('jobs')
    .select('*, skills(title)')
    .eq('id', id)
    .single()

  if (!job) notFound()
  if (job.client_id !== user.id && job.provider_id !== user.id) redirect('/dashboard')
  if (['disputed', 'completed', 'resolved', 'cancelled'].includes(job.status)) {
    redirect(`/jobs/${id}`)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <p className="text-xs text-gray-400">
        <Link href={`/jobs/${id}`} className="hover:underline">← Back to Job</Link>
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-gray-900">Raise a Dispute</h1>
      <p className="mt-1 text-sm text-gray-500">
        For: <strong>{(job.skills as { title?: string } | null)?.title}</strong>
      </p>
      <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4">
        <p className="text-sm text-red-700">
          Disputes are reviewed by the platform arbiter. Funds remain in escrow until resolved.
          Please only raise a dispute if you genuinely cannot resolve the issue directly.
        </p>
      </div>
      <div className="mt-6">
        <DisputeForm
          jobId={id}
          isCrypto={job.payment_method === 'crypto'}
          chainJobId={job.chain_job_id}
        />
      </div>
    </div>
  )
}
