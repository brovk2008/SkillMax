import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { CryptoBookingButton } from '@/components/CryptoBookingButton'
import { RazorpayBookingButton } from '@/components/RazorpayBookingButton'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import { Zap, ShieldCheck } from 'lucide-react'

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()

  const { data: skill } = await supabase
    .from('skills')
    .select('*, profiles(id, username, full_name, city, bio, wallet_address, avatar_url)')
    .eq('id', id)
    .single()

  if (!skill) notFound()

  interface ProviderProfile {
    id: string
    username: string
    full_name: string
    city: string
    bio: string | null
    wallet_address: string | null
    avatar_url: string | null
  }
  const provider = skill.profiles as ProviderProfile | null
  const isOwnSkill = user?.id === skill.provider_id

  const providerWallet = provider?.wallet_address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500">
        <Link href="/explore" className="hover:underline">Explore</Link>
        {' / '}
        <span className="text-gray-900">{skill.category}</span>
      </nav>

      {/* Grid layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {skill.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{skill.title}</h1>
          </div>

          {skill.description && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-2">
              <h2 className="text-sm font-semibold text-gray-900">About this skill</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{skill.description}</p>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Provider</p>
            <Link href={`/profile/${provider?.username}`} className="flex items-center gap-3 hover:opacity-80">
              <img
                src={provider?.avatar_url || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'}
                alt={provider?.full_name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{provider?.full_name}</p>
                <p className="text-xs text-gray-500">@{provider?.username} · {provider?.city}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Book this Skill</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ShieldCheck className="size-3 text-emerald-600" />
                <span>Monad Escrow</span>
              </span>
            </div>

            <div className="space-y-1">
              {skill.price_mon && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900">{skill.price_mon} MON</span>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Web3 Escrow</span>
                </div>
              )}
              {skill.price_inr && (
                <p className="text-xs font-medium text-gray-500">or {formatINR(skill.price_inr)} via UPI</p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              {isOwnSkill ? (
                <div className="rounded-md bg-gray-50 p-3 text-center text-xs text-gray-500 font-medium">
                  This is your listing
                </div>
              ) : (
                <>
                  {/* Web3 Wallet Pay with MON button — ALWAYS available */}
                  {skill.price_mon && (
                    <CryptoBookingButton
                      skillId={skill.id}
                      priceMon={skill.price_mon}
                      providerAddress={providerWallet}
                      providerUserId={provider?.id ?? skill.provider_id}
                    />
                  )}

                  {/* Fiat UPI / Razorpay option */}
                  {skill.price_inr && (
                    user ? (
                      <RazorpayBookingButton
                        skillId={skill.id}
                        priceInr={skill.price_inr}
                        providerUserId={provider?.id ?? skill.provider_id}
                      />
                    ) : (
                      <Link
                        href="/onboard"
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Sign in for UPI / Card Payment
                      </Link>
                    )
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            Funds held securely in non-custodial Monad smart contract escrow until work is delivered.
          </p>
        </div>
      </div>
    </div>
  )
}
