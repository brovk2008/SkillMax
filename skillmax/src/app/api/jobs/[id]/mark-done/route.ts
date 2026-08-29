import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single()
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (job.provider_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (job.status !== 'active') return NextResponse.json({ error: 'Job not active' }, { status: 400 })

  await supabase
    .from('jobs')
    .update({ status: 'provider_done' })
    .eq('id', id)

  await supabase.from('notifications').insert({
    user_id: job.client_id,
    message: `The provider has marked the job as complete. Please review and release payment.`,
    job_id: id,
  })

  return NextResponse.json({ ok: true })
}
