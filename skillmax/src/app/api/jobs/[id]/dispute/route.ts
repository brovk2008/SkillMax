import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single()
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (job.client_id !== user.id && job.provider_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { reason, txHash } = await req.json().catch(() => ({}))

  await supabase
    .from('jobs')
    .update({
      status: 'disputed',
      dispute_reason: reason,
      ...(txHash ? { chain_tx_dispute: txHash } : {}),
    })
    .eq('id', id)

  const otherUserId = user.id === job.client_id ? job.provider_id : job.client_id

  await supabase.from('notifications').insert({
    user_id: otherUserId,
    message: `A dispute was raised on your job. An arbiter will review it.`,
    job_id: id,
  })

  return NextResponse.json({ ok: true })
}
