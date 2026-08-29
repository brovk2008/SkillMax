import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import JobChat from '@/components/JobChat'
import { BlockchainStatus } from '@/components/BlockchainStatus'
import { STATUS_CLASSES, formatINR } from '@/lib/utils'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/onboard')

  const { data: job } = await supabase
    .from('jobs')
    .select(`
      *,
      skills(title, description, category),
      client_profile:profiles!client_id(id, full_name, username),
      provider_profile:profiles!provider_id(id, full_name, username, wallet_address)
    `)
    .eq('id', id)
    .single()

  if (!job) notFound()

  const isClient = user.id === job.client_id
  const isProvider = user.id === job.provider_id
  if (!isClient && !isProvider) redirect('/dashboard')

  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id, content, created_at, profiles(full_name)')
    .eq('job_id', job.id)
    .order('created_at', { ascending: true })

  const isClosed = ['completed', 'resolved', 'cancelled'].includes(job.status)
  const statusClass = STATUS_CLASSES[job.status] ?? 'bg-gray-50 text-gray-500'

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400"><Link href="/dashboard" className="hover:underline">← Dashboard</Link></p>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">{job.skills?.title}</h1>
        </div>
        <span className={`self-start rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}>
          {job.status.replace('_', ' ')}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Chat — 3/5 */}
        <div className="lg:col-span-3">
          <JobChat
            jobId={job.id}
            currentUserId={user.id}
            initialMessages={(messages ?? []) as any}
            disabled={isClosed}
          />
        </div>

        {/* Sidebar — 2/5 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Job info */}
          <div className="rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Client</span>
              <span className="font-medium text-gray-900">{(job.client_profile as any).full_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Provider</span>
              <span className="font-medium text-gray-900">{(job.provider_profile as any).full_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium text-gray-900">
                {job.payment_method === 'crypto'
                  ? `${job.price_mon} MON`
                  : formatINR(job.price_inr ?? 0)}
              </span>
            </div>
          </div>

          {/* On-chain status */}
          {job.payment_method === 'crypto' && (
            <BlockchainStatus entries={[
              { label: 'Escrow created', hash: job.chain_tx_create, status: job.chain_tx_create ? 'success' : 'idle' },
              { label: 'Job completed', hash: job.chain_tx_complete, status: job.chain_tx_complete ? 'success' : 'idle' },
              { label: 'Dispute raised', hash: job.chain_tx_dispute, status: job.chain_tx_dispute ? 'success' : 'idle' },
            ]} />
          )}

          {/* Actions */}
          {!isClosed && (
            <div className="rounded-lg border border-gray-200 p-4 space-y-2">
              {isClient && job.status === 'provider_done' && (
                <form action={`/api/jobs/${job.id}/mark-complete`} method="POST">
                  <button className="w-full rounded-md bg-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-700">
                    <span className="flex items-center justify-center gap-1.5">
                      <span>Release Payment</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  </button>
                </form>
              )}
              {(isClient || isProvider) && !['disputed', 'completed', 'resolved', 'cancelled'].includes(job.status) && (
                <Link
                  href={`/jobs/${job.id}/dispute`}
                  className="block w-full rounded-md border border-red-300 px-4 py-2 text-center text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Raise Dispute
                </Link>
              )}
              {isProvider && job.status === 'active' && (
                <form action={`/api/jobs/${job.id}/mark-done`} method="POST">
                  <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Mark as Done (Provider)
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
