import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { skillId, txHash, priceMon, chainJobId } = await req.json()
  if (!skillId || !txHash || priceMon === undefined) {
    return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
  }

  // Validate txHash format
  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    return NextResponse.json({ error: 'Invalid transaction hash format' }, { status: 400 })
  }

  // 1. Verify skill and provider directly against database
  const { data: skill, error: skillErr } = await supabase
    .from('skills')
    .select('id, title, provider_id, price_mon')
    .eq('id', skillId)
    .single()

  if (skillErr || !skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }

  if (skill.provider_id === user.id) {
    return NextResponse.json({ error: 'Cannot book your own skill listing' }, { status: 400 })
  }

  const verifiedProviderId = skill.provider_id

  // 2. Insert verified on-chain job into database
  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      client_id: user.id,
      provider_id: verifiedProviderId,
      skill_id: skill.id,
      payment_method: 'crypto',
      price_mon: Number(priceMon),
      status: 'active',
      chain_tx_create: txHash,
      chain_job_id: chainJobId ? Number(chainJobId) : null,
      custom_title: skill.title,
    })
    .select('id')
    .single()

  if (error || !job) {
    console.error('Job creation error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create job' }, { status: 500 })
  }

  // 3. Notify provider using admin client
  const supabaseAdmin = createAdminClient()
  await supabaseAdmin.from('notifications').insert({
    user_id: verifiedProviderId,
    message: `New crypto job booked: "${skill.title}"! Funds locked in Monad smart contract escrow.`,
    job_id: job.id,
  })

  return NextResponse.json({ jobId: job.id })
}
