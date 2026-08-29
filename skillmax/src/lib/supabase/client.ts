'use client'

import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof _createBrowserClient> | null = null

export function createBrowserClient() {
  if (clientInstance) return clientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yyrzlotxhrtpwlvuocda.supabase.co'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cnpsb3R4aHJ0cHdsdnVvY2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MzExMjgsImV4cCI6MjA5ODQwNzEyOH0.eCd7C3I1LdG3p3DWpVhHL5-U8Wf1vz0a16qaBFsdPXw'

  clientInstance = _createBrowserClient(url, anonKey)
  return clientInstance
}
