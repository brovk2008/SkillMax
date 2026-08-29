import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { OnChainReputation } from '@/components/OnChainReputation'
import { SkillBadges } from '@/components/SkillBadges'
import SkillCard from '@/components/SkillCard'
import Link from 'next/link'

export default async function MyProfilePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/onboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboard')

  const { data: skills } = await supabase
    .from('skills')
    .select('id, title, category, price_inr, price_mon, is_active, profiles(username, full_name, city)')
    .eq('provider_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <Link
          href="/settings"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit Profile
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left col */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="text-base font-medium text-gray-900">{profile.full_name}</p>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            <p className="mt-1 text-xs text-gray-400">{profile.city}</p>
            {profile.bio && <p className="mt-3 text-sm text-gray-600">{profile.bio}</p>}
          </div>
          {profile.wallet_address && (
            <>
              <OnChainReputation walletAddress={profile.wallet_address} />
              <SkillBadges walletAddress={profile.wallet_address} />
            </>
          )}
        </div>

        {/* Right col — Skills */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-900">My Skills</h2>
            <Link
              href="/skills/new"
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              + Add Skill
            </Link>
          </div>
          {!skills?.length && (
            <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <p className="text-sm text-gray-500">No skills listed yet.</p>
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {skills?.map((skill) => (
              <div key={skill.id} className="relative">
                <SkillCard skill={skill as any} />
                {!skill.is_active && (
                  <span className="absolute top-2 right-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                    Hidden
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
