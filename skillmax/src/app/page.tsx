import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import SkillCard from '@/components/SkillCard'
import { CATEGORY_NAMES } from '@/lib/contracts'
import {
  Code2,
  Palette,
  BookOpen,
  Music,
  Dumbbell,
  Languages,
  Camera,
  Wrench,
  UtensilsCrossed,
  Zap,
  Search,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, any> = {
  Programming: Code2,
  Design: Palette,
  Tutoring: BookOpen,
  Music: Music,
  Fitness: Dumbbell,
  Languages: Languages,
  Photography: Camera,
  Repair: Wrench,
  Cooking: UtensilsCrossed,
  Other: Zap,
}

export default async function HomePage() {
  const supabase = await createServerClient()
  const { data: featuredSkills } = await supabase
    .from('skills')
    .select('id, title, category, price_inr, price_mon, profiles(username, full_name, city)')
    .eq('is_active', true)
    .limit(6)

  return (
    <div className="space-y-12 py-6">
      {/* Urban Company Hero Banner */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl bg-gradient-to-r from-gray-900 via-neutral-900 to-black p-8 md:p-12 text-white shadow-xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              Instant On-Chain Escrow & Local Booking
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Home services & local skills at your doorstep.
            </h1>
            <p className="text-sm text-gray-300 sm:text-base leading-relaxed">
              Book top-rated local professionals backed by non-custodial Monad escrow trust and instant Razorpay payments.
            </p>

            {/* Hero Search Input */}
            <form action="/explore" method="GET" className="mt-6 flex flex-col sm:flex-row gap-2 pt-2">
              <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 text-gray-900 shadow-inner">
                <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search for services (e.g. Electrician, Tutoring, Design)..."
                  className="w-full bg-transparent text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-md shrink-0 flex items-center justify-center gap-2"
              >
                <span>Find Professional</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Urban Company Category Grid */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">What are you looking for?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {CATEGORY_NAMES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat] ?? Zap
            return (
              <Link
                key={cat}
                href={`/explore?category=${encodeURIComponent(cat)}`}
                className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-emerald-50 transition-colors">
                  <IconComponent className="h-5 w-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                </div>
                <span className="text-xs font-semibold text-gray-900 group-hover:text-emerald-700">
                  {cat}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Urban Company Guarantee Banner */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Verified Professionals</h4>
                <p className="mt-0.5 text-xs text-gray-500">Every provider undergoes identity & skill verification.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Monad Escrow Protection</h4>
                <p className="mt-0.5 text-xs text-gray-500">Funds released only after you confirm job satisfaction.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <Award className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Soulbound Credentials</h4>
                <p className="mt-0.5 text-xs text-gray-500">Immutable ERC-1155 proof of work badges on Monad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Trending Services</h2>
            <p className="text-xs text-gray-500">Most booked skills by local clients</p>
          </div>
          <Link href="/explore" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
            <span>See all services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featuredSkills && featuredSkills.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSkills.map((skill: any) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center bg-white">
            <p className="text-sm text-gray-500">No active services listed yet.</p>
            <Link
              href="/onboard"
              className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              + List Your Skill
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
