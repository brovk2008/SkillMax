import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import SkillCard from '@/components/SkillCard'

export default async function HomePage() {
  const supabase = await createServerClient()
  const { data: featuredSkills } = await supabase
    .from('skills')
    .select('id, title, category, price_inr, price_mon, profiles(username, full_name, city)')
    .eq('is_active', true)
    .limit(6)
    .order('created_at', { ascending: false })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Local skills.<br />
            <span className="text-purple-600">On-chain trust.</span>
          </h1>
          <p className="mt-4 text-base text-gray-600">
            Hire local talent and pay securely. Every job is escrowed on Monad.
            Every reputation is immutable on-chain.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/explore"
              className="rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
            >
              Browse Skills
            </Link>
            <Link
              href="/onboard"
              className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              List Your Skill
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-lg font-semibold text-gray-900">How it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Find a skill',
                desc: 'Browse verified local providers by category and price.',
              },
              {
                step: '2',
                title: 'Book & Escrow',
                desc: 'Pay MON into escrow on Monad — or pay INR via Razorpay. Funds are locked until you confirm.',
              },
              {
                step: '3',
                title: 'Mark complete',
                desc: 'Once done, release funds. Your on-chain reputation updates instantly.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-lg border border-gray-200 p-5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                  {item.step}
                </span>
                <h3 className="mt-3 text-sm font-medium text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      {featuredSkills && featuredSkills.length > 0 && (
        <section className="border-t border-gray-200 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Skills</h2>
              <Link href="/explore" className="text-sm font-medium text-purple-600 hover:underline">
                View all →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats bar */}
      <section className="border-t border-gray-200 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { label: 'Skills listed', value: '—' },
              { label: 'Jobs completed', value: '—' },
              { label: 'Avg rating', value: '—' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
