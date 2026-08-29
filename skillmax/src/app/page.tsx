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

  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="mx-auto max-w-4xl text-center px-4 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Local skills.{' '}
          <span className="text-emerald-600">On-chain trust.</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          SkillMax connects local service providers with clients using non-custodial smart contract escrows on Monad and seamless Razorpay local payments.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/explore"
            className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 shadow-sm"
          >
            Explore Skills
          </Link>
          <Link
            href="/onboard"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Offer a Skill
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-b border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 mb-8">
            How SkillMax Works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Find or Offer',
                desc: 'Browse local services or list your own skills with custom pricing in INR or MON.',
              },
              {
                step: '2',
                title: 'Book & Escrow',
                desc: 'Funds are securely locked in non-custodial Monad smart contract escrows or Razorpay.',
              },
              {
                step: '3',
                title: 'Complete & Earn',
                desc: 'Funds release upon client approval, updating your immutable on-chain reputation and soulbound badges.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Featured Skills</h2>
          <Link href="/explore" className="text-sm font-medium text-emerald-600 hover:underline">
            View all →
          </Link>
        </div>

        {featuredSkills && featuredSkills.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSkills.map((skill: any) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">No skills listed yet. Be the first to offer one!</p>
            <Link
              href="/onboard"
              className="mt-4 inline-block text-xs font-medium text-emerald-600 hover:underline"
            >
              Get started →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
