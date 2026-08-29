import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single()
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (job.client_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { txHash } = await req.json().catch(() => ({}))

  await supabase
    .from('jobs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      ...(txHash ? { chain_tx_complete: txHash } : {}),
    })
    .eq('id', id)

  // Notify provider
  await supabase.from('notifications').insert({
    user_id: job.provider_id,
    message: `Payment released for your job!`,
    job_id: id,
  })

  // Trigger badge mint
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/badge/mint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: req.headers.get('cookie') ?? '' },
    body: JSON.stringify({ jobId: id }),
  })

  return NextResponse.json({ ok: true })
}
