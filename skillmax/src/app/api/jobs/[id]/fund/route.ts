import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { id } = await params

    let user = null
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim()
      const { data: tokenData } = await supabase.auth.getUser(token)
      user = tokenData.user
    }
    if (!user) {
      const { data: cookieData } = await supabase.auth.getUser()
      user = cookieData.user
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { txHash, chainJobId } = await req.json()
    if (!txHash || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
      return NextResponse.json({ error: 'Invalid transaction hash' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    const { data: job, error: jobErr } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (jobErr || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update job with transaction hash
    await supabaseAdmin
      .from('jobs')
      .update({
        chain_tx_create: txHash,
        ...(chainJobId ? { chain_job_id: Number(chainJobId) } : {}),
      })
      .eq('id', id)

    // Notify provider that escrow has been locked
    await supabaseAdmin.from('notifications').insert({
      user_id: job.provider_id,
      job_id: id,
      message: `Funds have been locked in Monad smart contract escrow! You can now safely start work.`,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Job fund error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
