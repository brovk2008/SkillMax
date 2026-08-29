import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { skillId, txHash, priceMon, chainJobId, clientAddress } = await req.json()
    if (!skillId || !txHash || priceMon === undefined) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    // Validate txHash format
    if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
      return NextResponse.json({ error: 'Invalid transaction hash format' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    // Determine client ID from session or wallet address
    let clientId = user?.id

    if (!clientId && clientAddress) {
      // Find or create profile for this wallet address
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .ilike('wallet_address', clientAddress)
        .maybeSingle()

      if (existingProfile) {
        clientId = existingProfile.id
      } else {
        // Create an ephemeral web3 profile
        const shortAddr = `${clientAddress.slice(0, 6)}...${clientAddress.slice(-4)}`
        const { data: newProfile } = await supabaseAdmin
          .from('profiles')
          .insert({
            username: `monad_${clientAddress.slice(2, 8).toLowerCase()}`,
            full_name: `Monad User (${shortAddr})`,
            wallet_address: clientAddress,
            city: 'Delhi NCR',
          })
          .select('id')
          .single()
        if (newProfile) {
          clientId = newProfile.id
        }
      }
    }

    if (!clientId) {
      // Fallback: pick any user or return unauthorized
      return NextResponse.json({ error: 'Please connect your Web3 wallet' }, { status: 401 })
    }

    // 1. Verify skill and provider directly against database
    const { data: skill, error: skillErr } = await supabaseAdmin
      .from('skills')
      .select('id, title, provider_id, price_mon')
      .eq('id', skillId)
      .single()

    if (skillErr || !skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    if (skill.provider_id === clientId) {
      return NextResponse.json({ error: 'Cannot book your own skill listing' }, { status: 400 })
    }

    const verifiedProviderId = skill.provider_id

    // 2. Insert verified on-chain job into database using admin client
    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .insert({
        client_id: clientId,
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

    // 3. Notify provider
    await supabaseAdmin.from('notifications').insert({
      user_id: verifiedProviderId,
      message: `New crypto job booked: "${skill.title}"! Funds locked in Monad smart contract escrow.`,
      job_id: job.id,
    })

    return NextResponse.json({ jobId: job.id })
  } catch (err: unknown) {
    console.error('Create from chain exception:', err)
    return NextResponse.json({ error: (err as Error)?.message || 'Internal server error' }, { status: 500 })
  }
}
