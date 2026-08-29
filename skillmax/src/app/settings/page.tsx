import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/onboard')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/onboard')

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <p className="mt-2 text-sm text-gray-500">Update your profile information.</p>
      <div className="mt-6">
        <SettingsForm profile={profile} />
      </div>
    </div>
  )
}
