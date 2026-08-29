import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({ status: 'error', error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      status: 'alive',
      message: 'Supabase keep-alive ping successful. Project is active!',
      profiles_count: count ?? 0,
      timestamp: new Date().toISOString(),
    })
  } catch (err: unknown) {
    return NextResponse.json({ status: 'error', error: (err as Error)?.message || 'Unknown error' }, { status: 500 })
  }
}
