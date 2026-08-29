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

  const { skillId } = await req.json()
  if (!skillId) {
    return NextResponse.json({ error: 'Missing skillId' }, { status: 400 })
  }

  try {
    // 1. Fetch and verify skill directly from database to prevent price/provider tampering
    const { data: skill, error: skillErr } = await supabase
      .from('skills')
      .select('id, title, price_inr, provider_id')
      .eq('id', skillId)
      .single()

    if (skillErr || !skill) {
      return NextResponse.json({ error: 'Skill listing not found' }, { status: 404 })
    }

    if (!skill.price_inr || skill.price_inr <= 0) {
      return NextResponse.json({ error: 'This skill does not have a valid INR price' }, { status: 400 })
    }

    if (skill.provider_id === user.id) {
      return NextResponse.json({ error: 'You cannot book your own skill listing' }, { status: 400 })
    }

    const verifiedPriceInr = skill.price_inr
    const verifiedProviderUserId = skill.provider_id

    const razorpay = getRazorpay()

    const createPaymentLink = razorpay.paymentLink.create as (
      options: unknown
    ) => Promise<{ id: string; short_url: string }>

    const paymentLink = await createPaymentLink({
      amount: verifiedPriceInr * 100, // in paise
      currency: 'INR',
      description: `SkillMax: ${skill.title}`,
      notify: { sms: false, email: true },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://skillmax2026.vercel.app'}/api/razorpay/webhook`,
      callback_method: 'get',
      notes: {
        skillId: skill.id,
        clientId: user.id,
        providerUserId: verifiedProviderUserId,
      },
    })

    // Pre-create job in pending state
    const { data: job, error: jobErr } = await supabase
      .from('jobs')
      .insert({
        client_id: user.id,
        provider_id: verifiedProviderUserId,
        skill_id: skill.id,
        payment_method: 'razorpay',
        price_inr: verifiedPriceInr,
        status: 'pending',
        razorpay_payment_link_id: paymentLink.id,
      })
      .select('id')
      .single()

    if (jobErr) {
      console.error('Job insertion error:', jobErr)
    }

    return NextResponse.json({ paymentLink: paymentLink.short_url, jobId: job?.id })
  } catch (e: unknown) {
    console.error('Razorpay payment link creation exception:', e)
    return NextResponse.json({ error: (e as Error)?.message ?? 'Razorpay error' }, { status: 500 })
  }
}
