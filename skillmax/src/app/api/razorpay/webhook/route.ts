import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-key'
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''

  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex')
  if (expectedSig !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === 'payment_link.paid') {
    const notes = event.payload?.payment_link?.entity?.notes ?? {}
    const { providerUserId } = notes
    const linkId = event.payload?.payment_link?.entity?.id

    if (linkId) {
      const supabaseAdmin = getSupabaseAdmin()
      // Activate the job
      await supabaseAdmin
        .from('jobs')
        .update({ status: 'active' })
        .eq('razorpay_payment_link_id', linkId)

      // Notify provider
      if (providerUserId) {
        await supabaseAdmin.from('notifications').insert({
          user_id: providerUserId,
          message: `Payment received! A new job is ready for you.`,
        })
      }
    }
  }

  return NextResponse.json({ ok: true })
}

// Razorpay also sends GET callbacks from browser redirect
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const razorpayPaymentLinkId = url.searchParams.get('razorpay_payment_link_id')
  const status = url.searchParams.get('razorpay_payment_link_status')

  if (razorpayPaymentLinkId && status === 'paid') {
    const supabaseAdmin = getSupabaseAdmin()
    await supabaseAdmin
      .from('jobs')
      .update({ status: 'active' })
      .eq('razorpay_payment_link_id', razorpayPaymentLinkId)
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard`)
}
