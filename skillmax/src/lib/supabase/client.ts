'use client'

import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof _createBrowserClient> | null = null

export function createBrowserClient() {
  if (clientInstance) return clientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxklpfrdkarljimmjpbe.supabase.co'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a2xwZnJka2FybGppbW1qcGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODk2NzAsImV4cCI6MjEwMzU2NTY3MH0.zJNMtzVVHLL6rfXDWQ_E2nokTmIoFAwQrAbGczI0Tqw'

  clientInstance = _createBrowserClient(url, anonKey)
  return clientInstance
}
