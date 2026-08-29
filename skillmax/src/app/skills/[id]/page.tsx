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

  const isOwn = user?.id === skill.provider_id
  const provider = skill.profiles as any

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Skill info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600">
              {skill.category}
            </span>
            <h1 className="mt-3 text-2xl font-semibold text-gray-900">{skill.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{provider.city}</p>
          </div>
          {skill.description && (
            <div className="rounded-lg border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-700 mb-2">About this skill</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{skill.description}</p>
            </div>
          )}
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="text-sm font-medium text-gray-700 mb-2">Provider</p>
            <Link href={`/profile/${provider.username}`} className="flex items-center gap-3 hover:opacity-80">
              <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-semibold">
                {provider.full_name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{provider.full_name}</p>
                <p className="text-xs text-gray-500">@{provider.username}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Book this skill</p>
            {skill.price_inr && <p className="text-2xl font-semibold text-gray-900">{formatINR(skill.price_inr)}</p>}
            {skill.price_mon && <p className="text-sm text-gray-500 mt-0.5">{skill.price_mon} MON</p>}

            {isOwn ? (
              <div className="mt-4 rounded-md bg-gray-50 p-3 text-center text-sm text-gray-500">
                This is your listing
              </div>
            ) : !user ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500">Sign in to book this skill</p>
                <Link href="/onboard" className="block w-full rounded-md bg-purple-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-700">
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {skill.price_mon && provider.wallet_address && (
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
          <p className="text-xs text-gray-400 text-center">
            Funds held in escrow until job is complete
          </p>
        </div>
      </div>
    </div>
  )
}
