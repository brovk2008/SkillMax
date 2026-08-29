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
  Sparkles,
  Lock,
  Layers,
  Coins,
  ClipboardList,
  HandHeart,
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
    .select('id, title, category, price_inr, price_mon, profiles(username, full_name, city, avatar_url)')
    .eq('is_active', true)
    .limit(6)

  return (
    <div className="space-y-12 py-6 bg-white">
      {/* MONAD LIVE STATS STRIP */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-600 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-fuchsia-600" />
            </span>
            <span className="font-bold text-slate-900">Monad Testnet Active</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-fuchsia-800 font-semibold bg-fuchsia-100/70 px-2 py-0.5 rounded">Chain 10143</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-600 tabular-nums">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-fuchsia-600" />
              100% Escrow Vault
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Coins className="size-3.5 text-fuchsia-600" />
              70.00 MON Monad Liquidity
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Zap className="size-3.5 text-fuchsia-600" />
              1-Sec Finality
            </span>
          </div>
        </div>
      </section>

      {/* URBAN COMPANY LIGHT HERO SECTION */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/90 to-slate-50/30 p-8 md:p-12 text-slate-900 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100/80 px-3 py-1 text-xs font-semibold text-emerald-900 border border-fuchsia-200">
                <Sparkles className="size-3.5 text-fuchsia-600" />
                Monad Blockchain Trust + Razorpay Local Payouts
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-slate-900 leading-tight text-balance">
              Expert local services & skills at your doorstep.
            </h1>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl text-pretty">
              Book top-rated local professionals backed by non-custodial Monad blockchain escrows and instant local Razorpay payments.
            </p>

            {/* Light Search Bar */}
            <form action="/explore" method="GET" className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 shadow-xs focus-within:border-fuchsia-600 focus-within:ring-2 focus-within:ring-fuchsia-500/20">
                <Search className="size-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search for services (e.g. Electrician, Tutoring, Design)..."
                  className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-fuchsia-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-fuchsia-700 transition-colors shadow-xs shrink-0 flex items-center justify-center gap-2"
              >
                <span>Find Professional</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/tasks/new"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <ClipboardList className="size-3.5 text-fuchsia-600" />
                <span>Post Task Request</span>
              </Link>
              <Link
                href="/skills/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <HandHeart className="size-3.5 text-fuchsia-400" />
                <span>Offer Help / Skill</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* URBAN COMPANY LIGHT CATEGORY GRID */}
      <section className="mx-auto max-w-6xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 text-balance">What service do you need?</h2>
          <Link href="/explore" className="text-xs font-semibold text-fuchsia-700 hover:underline">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {CATEGORY_NAMES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat] ?? Zap
            return (
              <Link
                key={cat}
                href={`/explore?category=${encodeURIComponent(cat)}`}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center hover:border-fuchsia-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group shadow-xs"
              >
                <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-2.5 group-hover:bg-fuchsia-50 transition-colors">
                  <IconComponent className="size-5 text-slate-700 group-hover:text-fuchsia-600 transition-colors" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-fuchsia-700">
                  {cat}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* URBAN COMPANY 3-POINT GUARANTEE BANNER */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-fuchsia-100/80 flex items-center justify-center text-fuchsia-800 shrink-0 shadow-xs">
                <CheckCircle2 className="size-5 text-fuchsia-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 text-balance">Verified Professionals</h4>
                <p className="text-xs text-slate-500 text-pretty">Every service provider undergoes identity and skill verification.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-fuchsia-100/80 flex items-center justify-center text-fuchsia-800 shrink-0 shadow-xs">
                <ShieldCheck className="size-5 text-fuchsia-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 text-balance">Monad Escrow Protection</h4>
                <p className="text-xs text-slate-500 text-pretty">Funds are locked in non-custodial smart contracts and released only when you confirm job completion.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-fuchsia-100/80 flex items-center justify-center text-fuchsia-800 shrink-0 shadow-xs">
                <Award className="size-5 text-fuchsia-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 text-balance">Soulbound On-Chain Credentials</h4>
                <p className="text-xs text-slate-500 text-pretty">Immutable ERC-1155 proof-of-work badges minted directly to provider wallets on Monad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES GRID */}
      <section className="mx-auto max-w-6xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 text-balance">Trending Services</h2>
            <p className="text-xs text-slate-500 text-pretty">Most booked skills by local clients</p>
          </div>
          <Link href="/explore" className="text-xs font-semibold text-fuchsia-700 hover:underline flex items-center gap-1">
            <span>See all services</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {featuredSkills && featuredSkills.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSkills.map((skill: any) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center bg-white space-y-3">
            <p className="text-sm text-slate-500">No active services listed yet.</p>
            <Link
              href="/onboard"
              className="inline-block rounded-lg bg-fuchsia-600 px-4 py-2 text-xs font-semibold text-white hover:bg-fuchsia-700 shadow-xs"
            >
              + List Your Skill
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
