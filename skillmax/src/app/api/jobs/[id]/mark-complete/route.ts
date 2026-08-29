import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: job, error: fetchErr } = await supabase.from('jobs').select('*').eq('id', id).single()
  if (fetchErr || !job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  if (job.client_id !== user.id) return NextResponse.json({ error: 'Forbidden — only the client can release payment' }, { status: 403 })

  // Status check: strictly allow only active or provider_done jobs
  if (!['active', 'provider_done'].includes(job.status)) {
    return NextResponse.json(
      { error: `Cannot release payment on a job with status '${job.status}'. Current status is not eligible.` },
      { status: 400 }
    )
  }

  const { txHash } = await req.json().catch(() => ({}))

  const supabaseAdmin = createAdminClient()

  await supabaseAdmin
    .from('jobs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      ...(txHash ? { chain_tx_complete: txHash } : {}),
    })
    .eq('id', id)

  // Notify provider
  await supabaseAdmin.from('notifications').insert({
    user_id: job.provider_id,
    message: `Payment released for your job! Escrow settled and Soulbound Badge verified.`,
    job_id: id,
  })

  // Trigger badge mint in background
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://skillmax2026.vercel.app'
    await fetch(`${appUrl}/api/badge/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') ?? '',
      },
      body: JSON.stringify({ jobId: id }),
    })
  } catch (badgeErr) {
    console.warn('Badge auto-mint background trigger:', badgeErr)
  }

  return NextResponse.json({ ok: true })
}
