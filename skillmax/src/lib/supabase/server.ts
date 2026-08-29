import { createServerClient as _createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxklpfrdkarljimmjpbe.supabase.co'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a2xwZnJka2FybGppbW1qcGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODk2NzAsImV4cCI6MjEwMzU2NTY3MH0.zJNMtzVVHLL6rfXDWQ_E2nokTmIoFAwQrAbGczI0Tqw'

  return _createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies are read-only, ignore
          }
        },
      },
    }
  )
}
