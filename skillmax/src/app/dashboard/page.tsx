import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import JobCard from '@/components/JobCard'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/onboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username')
    .eq('id', user.id)
    .single()

  const [{ data: clientJobs }, { data: providerJobs }] = await Promise.all([
    supabase
      .from('jobs')
      .select('id, status, payment_method, price_mon, price_inr, created_at, skills(title), provider_profile:profiles!provider_id(full_name)')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('jobs')
      .select('id, status, payment_method, price_mon, price_inr, created_at, skills(title), client_profile:profiles!client_id(full_name)')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <Link
          href="/profile"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          My Profile →
        </Link>
      </div>

      {/* Client jobs */}
      <section className="mt-10">
        <h2 className="text-base font-medium text-gray-900">Jobs I booked</h2>
        {clientJobs?.length === 0 && (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm text-gray-500">No jobs yet. <Link href="/explore" className="text-emerald-600 hover:underline">Browse skills →</Link></p>
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {clientJobs?.map((job) => (
            <JobCard key={job.id} job={job as any} perspective="client" />
          ))}
        </div>
      </section>

      {/* Provider jobs */}
      <section className="mt-10">
        <h2 className="text-base font-medium text-gray-900">Jobs for me to complete</h2>
        {providerJobs?.length === 0 && (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm text-gray-500">No bookings yet. <Link href="/profile" className="text-emerald-600 hover:underline">Add a skill →</Link></p>
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {providerJobs?.map((job) => (
            <JobCard key={job.id} job={job as any} perspective="provider" />
          ))}
        </div>
      </section>
    </div>
  )
}
