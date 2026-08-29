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
  ClipboardList,
  HandHeart,
  type LucideIcon,
} from 'lucide-react'

const CATEGORY_META: Record<string, { icon: LucideIcon; count: string; desc: string }> = {
  Programming: { icon: Code2, count: '48 pros', desc: 'Next.js, Solidity, Python' },
  Repair: { icon: Wrench, count: '86 pros', desc: 'Electrical, AC, Plumbing' },
  Design: { icon: Palette, count: '52 pros', desc: 'UI/UX, Branding, 3D' },
  Tutoring: { icon: BookOpen, count: '64 pros', desc: 'Maths, Science, Code' },
  Music: { icon: Music, count: '31 pros', desc: 'Guitar, Piano, Vocals' },
  Fitness: { icon: Dumbbell, count: '39 pros', desc: 'Personal Training, Yoga' },
  Photography: { icon: Camera, count: '27 pros', desc: 'Events, Portraits, Video' },
  Cooking: { icon: UtensilsCrossed, count: '22 pros', desc: 'Meal Prep, Baking' },
  Languages: { icon: Languages, count: '19 pros', desc: 'English, French, Hindi' },
  Other: { icon: Zap, count: '35 pros', desc: 'Custom Local Tasks' },
}

export default async function HomePage() {
  const supabase = await createServerClient()
  const { data: dbSkills } = await supabase
    .from('skills')
    .select('id, title, category, price_inr, price_mon, profiles(username, full_name, city, avatar_url)')
    .eq('is_active', true)
    .limit(6)

  // Fallback curated skills if database returns empty
  const fallbackSkills = [
    {
      id: 'demo-1',
      title: 'Emergency Electrical Wiring & Circuit Breaker Repair',
      category: 'Repair',
      price_inr: 850,
      price_mon: 0.45,
      profiles: {
        username: 'arjun_tech',
        full_name: 'Arjun Sharma',
        city: 'Delhi NCR',
        avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Arjun',
      },
    },
    {
      id: 'demo-2',
      title: 'Full Stack Next.js & Solidity Smart Contract Audit',
      category: 'Programming',
      price_inr: 4500,
      price_mon: 2.5,
      profiles: {
        username: 'priya_web3',
        full_name: 'Priya Mehta',
        city: 'Bengaluru',
        avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
      },
    },
    {
      id: 'demo-3',
      title: '1-on-1 Acoustic & Electric Guitar Masterclass',
      category: 'Music',
      price_inr: 600,
      price_mon: 0.3,
      profiles: {
        username: 'rohan_strings',
        full_name: 'Rohan Sen',
        city: 'Mumbai',
        avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan',
      },
    },
    {
      id: 'demo-4',
      title: 'High-Converting Brand Identity & UI/UX Figma Design',
      category: 'Design',
      price_inr: 3200,
      price_mon: 1.8,
      profiles: {
        username: 'ananya_ux',
        full_name: 'Ananya Roy',
        city: 'Delhi NCR',
        avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ananya',
      },
    },
    {
      id: 'demo-5',
      title: 'Home AC Deep Jet Pump Service & Gas Charging',
      category: 'Repair',
      price_inr: 999,
      price_mon: 0.55,
      profiles: {
        username: 'vikram_services',
        full_name: 'Vikram Patel',
        city: 'Ahmedabad',
        avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram',
      },
    },
    {
      id: 'demo-6',
      title: 'Personal Fitness Training & Custom Nutrition Plan',
      category: 'Fitness',
      price_inr: 1200,
      price_mon: 0.7,
      profiles: {
        username: 'kabir_fit',
        full_name: 'Kabir Verma',
        city: 'Pune',
        avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kabir',
      },
    },
  ]

  const displaySkills = dbSkills && dbSkills.length > 0 ? dbSkills : fallbackSkills

  return (
    <div className="space-y-16 py-6 bg-white">

      {/* TOP PROTOCOL TICKER */}
      <section className="mx-auto max-w-6xl px-3 sm:px-4">
        <div className="rounded-xl bg-slate-900 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 sm:gap-3 shadow-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white">Monad Testnet</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-mono">Chain 10143</span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-emerald-400 font-medium hidden sm:inline">10,000 TPS Non-Custodial Escrows</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-slate-400">
            <Link
              href="/leaderboard"
              className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] sm:text-xs"
            >
              <span>On-Chain Leaderboard</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* HERO SECTION */}
      <section className="mx-auto max-w-6xl px-3 sm:px-4">
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 p-4 sm:p-8 lg:p-12 shadow-xs relative overflow-hidden">
          
          {/* Subtle decorative grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Copy & Search */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-emerald-100/90 px-3 py-1 text-[11px] sm:text-xs font-semibold text-emerald-950 border border-emerald-200 shadow-2xs">
                <Sparkles className="size-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Hyperlocal Skills · Non-Custodial Monad Escrow</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2] sm:leading-[1.15] text-balance">
                Book verified local experts. Sealed by <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">smart escrow</span>.
              </h1>

              <p className="text-xs sm:text-base text-slate-600 leading-relaxed text-pretty max-w-xl">
                Get real-world services in your neighborhood with zero advance payment fraud. Pay via <strong>Razorpay UPI</strong> or <strong>MON tokens</strong>. Funds are locked in smart contracts and released only when you approve completion.
              </p>

              {/* Integrated Search Bar */}
              <form action="/explore" method="GET" className="space-y-2.5 pt-1">
                <div className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white border-2 border-slate-200 p-1.5 shadow-xs focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/15 transition-all">
                  <div className="flex-1 flex items-center px-3 py-2 text-slate-900 min-h-[44px]">
                    <Search className="size-4 text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      name="q"
                      placeholder="What service do you need? (e.g. Electrician)..."
                      className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Find Pros</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
                  <span className="font-semibold text-slate-400 text-[11px] sm:text-xs">Trending:</span>
                  {['Electrician', 'AC Service', 'Solidity Dev', 'Guitar', 'UI Design'].map((tag) => (
                    <Link
                      key={tag}
                      href={`/explore?q=${encodeURIComponent(tag)}`}
                      className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] sm:text-xs font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </form>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                <Link
                  href="/tasks/new"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs min-h-[42px]"
                >
                  <ClipboardList className="size-4 text-emerald-600 shrink-0" />
                  <span>Post a Task Request</span>
                </Link>
                <Link
                  href="/skills/new"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-xs min-h-[42px]"
                >
                  <HandHeart className="size-4 text-emerald-400 shrink-0" />
                  <span>Offer Help & Earn</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Live Smart Escrow Interactive Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-5 relative">
                
                {/* Live Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900">Live Escrow Engine</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    SkillMaxEscrow.sol
                  </span>
                </div>

                {/* Sample Escrow Visualization */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Escrow Job #1042</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                      <Lock className="size-3 text-amber-600" />
                      Locked in Smart Contract
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900">Emergency Residential MCB Installation</p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <div className="tabular-nums">
                      <span className="text-slate-500">Escrow Value: </span>
                      <span className="font-extrabold text-slate-900">₹850</span>
                      <span className="text-slate-400 font-mono ml-1">(0.45 MON)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Delhi NCR</span>
                  </div>
                </div>

                {/* Dual Guarantees */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-200 p-3 bg-white space-y-1">
                    <p className="text-[11px] text-slate-500 font-medium">For Client</p>
                    <p className="font-bold text-slate-900">100% Refundable</p>
                    <p className="text-[10px] text-slate-500 leading-tight">If service is not fulfilled or disputed.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 bg-white space-y-1">
                    <p className="text-[11px] text-slate-500 font-medium">For Provider</p>
                    <p className="font-bold text-emerald-700">Guaranteed Pay</p>
                    <p className="text-[10px] text-slate-500 leading-tight">Funds confirmed locked before you start work.</p>
                  </div>
                </div>

                {/* Soulbound NFT preview */}
                <div className="rounded-xl bg-emerald-900 text-white p-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
                      <Award className="size-4 text-emerald-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Proof of Work Minting</p>
                      <p className="text-[10px] text-emerald-300">ERC-1155 Soulbound Badge on job sign-off</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-emerald-950/60 px-2 py-1 rounded text-emerald-200">
                    Monad #10143
                  </span>
                </div>
              </div>

              {/* Protocol Metrics Ribbon */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">10,000</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Monad TPS</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <p className="text-base font-extrabold text-emerald-600 tabular-nums">0%</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Crypto Escrow Cut</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">&lt; 1 sec</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Finality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY DIRECTORY */}
      <section className="mx-auto max-w-6xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 text-balance">Explore by Category</h2>
            <p className="text-xs text-slate-500 text-pretty">Browse verified services across popular local trades</p>
          </div>
          <Link href="/explore" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
            <span>All Categories</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CATEGORY_NAMES.map((cat) => {
            const meta = CATEGORY_META[cat] ?? { icon: Zap, count: '30+ pros', desc: 'Local Services' }
            const IconComponent = meta.icon

            return (
              <Link
                key={cat}
                href={`/explore?category=${encodeURIComponent(cat)}`}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group shadow-xs h-full"
              >
                <div className="space-y-3">
                  <div className="size-11 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <IconComponent className="size-5 text-slate-700 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {cat}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">{meta.desc}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-emerald-600">
                  <span>{meta.count}</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 3-POINT ASSURANCE RIBBON */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                <CheckCircle2 className="size-5 text-emerald-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 text-balance">Verified Neighborhood Experts</h4>
                <p className="text-xs text-slate-500 text-pretty">Every provider is phone-verified with public community track records and verified portfolio proof.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                <ShieldCheck className="size-5 text-emerald-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 text-balance">Non-Custodial Smart Escrow</h4>
                <p className="text-xs text-slate-500 text-pretty">Payment is held securely on Monad. The provider knows funds are safe, and you only release them after inspection.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                <Award className="size-5 text-emerald-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 text-balance">Soulbound On-Chain Reputation</h4>
                <p className="text-xs text-slate-500 text-pretty">Reviews cannot be bought or faked. Each completed gig mints an immutable ERC-1155 badge permanently attached to your wallet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED & TRENDING SERVICES GRID */}
      <section className="mx-auto max-w-6xl px-4 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 text-balance">Trending Neighborhood Services</h2>
            <p className="text-xs text-slate-500 text-pretty">Most-requested local trades backed by active escrows</p>
          </div>
          <Link href="/explore" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
            <span>Browse all services</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displaySkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill as React.ComponentProps<typeof SkillCard>['skill']} />
          ))}
        </div>
      </section>

      {/* HOW SKILLMAX WORKS: 3-STEP FLOW */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-8 sm:p-12 space-y-8 shadow-md">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              <Sparkles className="size-3.5 text-emerald-400" />
              <span>Simple, Trustless, Hyperlocal</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-balance">
              How SkillMax Escrow Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 text-pretty">
              Eliminating advance scams and delayed client payments through Monad smart contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 space-y-4 relative">
              <div className="size-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-white">Find or Request</h3>
              <p className="text-xs text-slate-300 leading-relaxed text-pretty">
                Browse verified local provider listings or post a custom task with your desired budget in INR or MON tokens.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="size-3.5" />
                <span>Hyperlocal neighborhood radius</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 space-y-4 relative">
              <div className="size-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-white">Lock Funds in Escrow</h3>
              <p className="text-xs text-slate-300 leading-relaxed text-pretty">
                Lock your payment in the non-custodial Monad contract or Razorpay escrow. The provider starts work knowing payout is 100% guaranteed.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Lock className="size-3.5" />
                <span>Non-custodial smart contract</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 space-y-4 relative">
              <div className="size-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-white">Verify & Mint Badge</h3>
              <p className="text-xs text-slate-300 leading-relaxed text-pretty">
                Inspect the completed service and click "Mark Complete". Funds instantly release to provider, and an ERC-1155 Soulbound Badge is minted!
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Award className="size-3.5" />
                <span>Tamper-proof on-chain reputation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WEB2 TRADITIONAL APPS VS SKILLMAX MONAD COMPARISON */}
      <section className="mx-auto max-w-6xl px-4 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 text-balance">
            Why Monad Blockchain for Local Services?
          </h2>
          <p className="text-xs text-slate-500 text-pretty">
            See how SkillMax compares against centralized platforms like Urban Company, Fiverr, and TaskRabbit.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 font-bold text-slate-900">Feature</th>
                  <th className="p-4 font-bold text-slate-500">Traditional Web2 Platforms</th>
                  <th className="p-4 font-extrabold text-emerald-700 bg-emerald-50/50">SkillMax on Monad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-bold text-slate-900">Platform Commission</td>
                  <td className="p-4 text-slate-600">15% – 25% deducted from provider</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/30">0% on Crypto · 2% on Fiat Escrow</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Payout Settlement Speed</td>
                  <td className="p-4 text-slate-600">7 to 14 business days hold</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/30">Instant (&lt;1 second finality on Monad)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Escrow Security</td>
                  <td className="p-4 text-slate-600">Centralized corporate custody</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/30">100% Non-Custodial Smart Contract</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Reputation & Reviews</td>
                  <td className="p-4 text-slate-600">Can be bought, deleted, or deplatformed</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/30">Soulbound ERC-1155 NFTs owned by provider</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Supported Currencies</td>
                  <td className="p-4 text-slate-600">Fiat only (Bank transfer / Cards)</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/30">Razorpay UPI + MON Native Cryptocurrency</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION FOOTER BANNER */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-12 text-white text-center space-y-6 shadow-md relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-balance leading-tight">
              Ready to exchange skills in your neighborhood?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 text-pretty">
              Join hundreds of verified electricians, tutors, designers, and developers building verifiable reputation on Monad today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/tasks/new"
                className="rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <ClipboardList className="size-4 text-emerald-600" />
                <span>Post a Task Request</span>
              </Link>
              <Link
                href="/skills/new"
                className="rounded-xl bg-slate-950 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-900 transition-colors shadow-xs flex items-center gap-1.5 border border-emerald-400/20"
              >
                <HandHeart className="size-4 text-emerald-400" />
                <span>Offer Your Skill</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
