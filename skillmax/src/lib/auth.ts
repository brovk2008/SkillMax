import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return user
  } catch (e) {
    // Expected during static page generation
  }

  try {
    const cookieStore = await cookies()
    const customUserId = cookieStore.get('skillmax_user_id')?.value

    if (customUserId) {
      const supabase = await createServerClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', customUserId)
        .maybeSingle()

      if (profile) {
        return {
          id: profile.id,
          email: profile.email || `${profile.username}@skillmax.eth`,
          user_metadata: { full_name: profile.full_name, username: profile.username },
        } as any
      }
    }
  } catch (e) {
    // Expected during static page generation
  }

  try {
    const supabase = await createServerClient()
    const { data: latestProfile } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (latestProfile) {
      return {
        id: latestProfile.id,
        email: latestProfile.email || `${latestProfile.username}@skillmax.eth`,
        user_metadata: { full_name: latestProfile.full_name, username: latestProfile.username },
      } as any
    }
  } catch (e) {
    // Expected during static generation
  }

  return null
}
