import { createServerClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return user
  } catch {
    // Expected during static build
  }
  return null
}
