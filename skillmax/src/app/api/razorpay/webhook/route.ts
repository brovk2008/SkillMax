import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!secret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

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
      const supabaseAdmin = createAdminClient()
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

// Razorpay browser redirect GET callback — safe redirect only; activation happens via signed POST webhook
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const razorpayPaymentLinkId = url.searchParams.get('razorpay_payment_link_id')
  const status = url.searchParams.get('razorpay_payment_link_status')
  const razorpaySignature = url.searchParams.get('razorpay_signature')
  const razorpayPaymentId = url.searchParams.get('razorpay_payment_id')
  const secret = process.env.RAZORPAY_KEY_SECRET

  // If valid callback parameters are present and secret is configured, verify HMAC before touching DB
  if (secret && razorpayPaymentLinkId && razorpayPaymentId && razorpaySignature && status === 'paid') {
    const payload = `${razorpayPaymentLinkId}|${razorpayPaymentId}`
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    if (expectedSig === razorpaySignature) {
      const supabaseAdmin = createAdminClient()
      await supabaseAdmin
        .from('jobs')
        .update({ status: 'active', razorpay_payment_id: razorpayPaymentId })
        .eq('razorpay_payment_link_id', razorpayPaymentLinkId)
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://skillmax2026.vercel.app'}/dashboard`)
}
