import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { OnChainReputation } from '@/components/OnChainReputation'
import { SkillBadges } from '@/components/SkillBadges'
import SkillCard from '@/components/SkillCard'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const supabase = await createServerClient()
  const { username } = await params

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: skills } = await supabase
    .from('skills')
    .select('id, title, category, price_inr, price_mon, profiles(username, full_name, city)')
    .eq('provider_id', profile.id)
    .eq('is_active', true)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatar_url || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'}
                alt={profile.full_name}
                className="size-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="text-base font-bold text-gray-900">{profile.full_name}</p>
                <p className="text-xs text-gray-500">@{profile.username} · {profile.city}</p>
              </div>
            </div>
            {profile.headline && <p className="text-xs font-semibold text-emerald-600">{profile.headline}</p>}
            {profile.bio && <p className="text-xs text-gray-600">{profile.bio}</p>}
          </div>
          {profile.wallet_address && (
            <>
              <OnChainReputation walletAddress={profile.wallet_address} />
              <SkillBadges walletAddress={profile.wallet_address} />
            </>
          )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-base font-medium text-gray-900">Skills ({skills?.length ?? 0})</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {skills?.map((skill) => (
              <SkillCard key={skill.id} skill={skill as unknown as React.ComponentProps<typeof SkillCard>['skill']} />
            ))}
          </div>
          {!skills?.length && (
            <p className="mt-4 text-sm text-gray-400">No skills listed.</p>
          )}
        </div>
      </div>
    </div>
  )
}
