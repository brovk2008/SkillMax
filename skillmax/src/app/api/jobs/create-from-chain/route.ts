import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { skillId, providerUserId, txHash, priceMon } = await req.json()
  if (!skillId || !providerUserId || !txHash || !priceMon) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      client_id: user.id,
      provider_id: providerUserId,
      skill_id: skillId,
      payment_method: 'crypto',
      price_mon: priceMon,
      status: 'active',
      chain_tx_create: txHash,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify provider
  await supabase.from('notifications').insert({
    user_id: providerUserId,
    message: `New crypto job booked! Check your dashboard.`,
    job_id: job.id,
  })

  return NextResponse.json({ jobId: job.id })
}
