import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import JobChat from '@/components/JobChat'
import { BlockchainStatus } from '@/components/BlockchainStatus'
import { ReleasePaymentButton } from '@/components/ReleasePaymentButton'
import { MarkDoneButton } from '@/components/MarkDoneButton'
import { FundEscrowButton } from '@/components/FundEscrowButton'
import { STATUS_CLASSES, formatINR } from '@/lib/utils'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, ArrowLeft, Lock } from 'lucide-react'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/onboard')
  const supabase = await createServerClient()
  const { id } = await params

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
  const jobTitle = job.skills?.title || job.custom_title || 'Neighborhood Task Escrow'

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <Link href="/dashboard" className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="size-3" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{jobTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`self-start rounded-full px-3 py-1 text-xs font-bold capitalize shadow-2xs ${statusClass}`}>
            {job.status.replace('_', ' ')}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="size-3 text-emerald-600" />
            <span>Escrow Protected</span>
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
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
          
          {/* Client Action Needed: Fund Escrow from Wallet if not funded yet */}
          {isClient && job.payment_method === 'crypto' && !job.chain_tx_create && job.price_mon && !isClosed && (
            <FundEscrowButton
              jobId={job.id}
              priceMon={job.price_mon}
              providerAddress={(job.provider_profile as any)?.wallet_address}
              providerName={(job.provider_profile as any)?.full_name || 'Provider'}
            />
          )}

          {/* Job info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Escrow Details</h3>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Client</span>
              <span className="font-bold text-slate-900">{(job.client_profile as any)?.full_name || 'Client'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Provider</span>
              <span className="font-bold text-slate-900">{(job.provider_profile as any)?.full_name || 'Provider'}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2.5">
              <span className="text-slate-500 font-medium">Escrow Value</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {job.payment_method === 'crypto'
                  ? `${job.price_mon} MON`
                  : formatINR(job.price_inr ?? 0)}
              </span>
            </div>
          </div>

          {/* On-chain status */}
          {job.payment_method === 'crypto' && (
            <BlockchainStatus entries={[
              { label: 'Escrow locked', hash: job.chain_tx_create, status: job.chain_tx_create ? 'success' : 'idle' },
              { label: 'Job completed & paid', hash: job.chain_tx_complete, status: job.chain_tx_complete ? 'success' : 'idle' },
              { label: 'Dispute raised', hash: job.chain_tx_dispute, status: job.chain_tx_dispute ? 'success' : 'idle' },
            ]} />
          )}

          {/* Action Triggers */}
          {!isClosed ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Workflow Actions</h3>
              
              {/* Provider: Mark Work Done */}
              {isProvider && job.status === 'active' && (
                <MarkDoneButton jobId={job.id} />
              )}

              {/* Client: Release Payment (Available when provider marks done OR directly by client) */}
              {isClient && (job.status === 'provider_done' || job.status === 'active') && (
                <div className="space-y-1.5">
                  <ReleasePaymentButton
                    jobId={job.id}
                    isCrypto={job.payment_method === 'crypto'}
                    chainJobId={job.chain_job_id}
                  />
                  <p className="text-[11px] text-slate-400 text-center">
                    Releases locked funds to provider and mints Soulbound ERC-1155 proof of work.
                  </p>
                </div>
              )}

              {/* Raise Dispute button */}
              {(isClient || isProvider) && !['disputed', 'completed', 'resolved', 'cancelled'].includes(job.status) && (
                <Link
                  href={`/jobs/${job.id}/dispute`}
                  className="block w-full rounded-xl border border-red-200 bg-red-50/50 py-2.5 text-center text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                >
                  Raise Dispute (Monad Arbitration)
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center space-y-2">
              <CheckCircle2 className="size-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Job Completed & Settled</h4>
              <p className="text-xs text-emerald-700">
                Payment has been released and an immutable Proof of Reputation badge is minted.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
