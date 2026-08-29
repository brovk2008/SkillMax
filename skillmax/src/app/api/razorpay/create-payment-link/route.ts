import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createServerClient } from '@/lib/supabase/server'

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'placeholder_secret',
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { skillId, providerUserId, priceInr } = await req.json()
  if (!skillId || !providerUserId || !priceInr) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const razorpay = getRazorpay()
    const { data: skill } = await supabase.from('skills').select('title').eq('id', skillId).single()

    const paymentLink = await razorpay.paymentLink.create({
      amount: priceInr * 100, // in paise
      currency: 'INR',
      description: skill?.title ?? 'SkillMax Booking',
      notify: { sms: false, email: true },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/razorpay/webhook`,
      callback_method: 'get',
      notes: {
        skillId,
        clientId: user.id,
        providerUserId,
      },
    } as any)

    // Pre-create job in pending state
    const { data: job } = await supabase
      .from('jobs')
      .insert({
        client_id: user.id,
        provider_id: providerUserId,
        skill_id: skillId,
        payment_method: 'razorpay',
        price_inr: priceInr,
        status: 'pending',
        razorpay_payment_link_id: paymentLink.id,
      })
      .select('id')
      .single()

    return NextResponse.json({ paymentLink: paymentLink.short_url, jobId: job?.id })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message ?? 'Razorpay error' }, { status: 500 })
  }
}
