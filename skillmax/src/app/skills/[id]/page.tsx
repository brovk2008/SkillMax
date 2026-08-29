import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { CryptoBookingButton } from '@/components/CryptoBookingButton'
import { RazorpayBookingButton } from '@/components/RazorpayBookingButton'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'

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

  const provider = skill.profiles as any
  const isOwnSkill = user?.id === skill.provider_id

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
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
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
                src={provider?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
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
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Book this Skill</h3>

            <div className="space-y-1">
              {skill.price_inr && (
                <p className="text-2xl font-bold text-gray-900">{formatINR(skill.price_inr)}</p>
              )}
              {skill.price_mon && (
                <p className="text-sm text-gray-500">{skill.price_mon} MON</p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              {isOwnSkill ? (
                <div className="rounded-md bg-gray-50 p-3 text-center text-xs text-gray-500">
                  This is your listing
                </div>
              ) : !user ? (
                <Link
                  href="/onboard"
                  className="block w-full rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
                >
                  Sign in to Book
                </Link>
              ) : (
                <div className="space-y-2">
                  {skill.price_mon && provider?.wallet_address && (
                    <CryptoBookingButton
                      skillId={skill.id}
                      priceMon={skill.price_mon}
                      providerAddress={provider.wallet_address}
                      providerUserId={provider.id}
                    />
                  )}
                  {skill.price_inr && (
                    <RazorpayBookingButton
                      skillId={skill.id}
                      priceInr={skill.price_inr}
                      providerUserId={provider.id}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Funds held in non-custodial Monad escrow until completion
          </p>
        </div>
      </div>
    </div>
  )
}
