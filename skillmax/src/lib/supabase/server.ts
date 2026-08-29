import { createServerClient as _createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yyrzlotxhrtpwlvuocda.supabase.co'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cnpsb3R4aHJ0cHdsdnVvY2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkyNzY2NTMsImV4cCI6MjAyNDg1MjY1M30.xxx'

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
