import Link from 'next/link'
import { STATUS_CLASSES, formatINR } from '@/lib/utils'

interface JobCardProps {
  job: {
    id: string
    status: string
    payment_method: string
    price_mon: number | null
    price_inr: number | null
    created_at: string
    skills: { title: string } | null
    client_profile?: { full_name: string } | null
    provider_profile?: { full_name: string } | null
  }
  perspective: 'client' | 'provider'
}

export default function JobCard({ job, perspective }: JobCardProps) {
  const counterparty = perspective === 'client'
    ? job.provider_profile?.full_name
    : job.client_profile?.full_name

  const statusClass = STATUS_CLASSES[job.status] ?? 'bg-gray-50 text-gray-500'

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{job.skills?.title ?? 'Skill'}</p>
            <p className="mt-0.5 text-xs text-gray-500">with {counterparty}</p>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${statusClass}`}>
            {job.status.replace('_', ' ')}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {new Date(job.created_at).toLocaleDateString('en-IN')}
          </p>
          {job.payment_method === 'crypto'
            ? <p className="text-xs font-medium text-gray-700">{job.price_mon} MON</p>
            : <p className="text-xs font-medium text-gray-700">{formatINR(job.price_inr ?? 0)}</p>
          }
        </div>
      </div>
    </Link>
  )
}
