'use client'

import { useState } from 'react'
import { formatINR } from '@/lib/utils'

interface Props {
  skillId: string
  priceInr: number
  providerUserId: string
}

export function RazorpayBookingButton({ skillId, priceInr, providerUserId }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleBook() {
    setLoading(true)
    try {
      const res = await fetch('/api/razorpay/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, providerUserId, priceInr }),
      })
      const { paymentLink, error } = await res.json()
      if (error) {
        alert(error)
        return
      }
      window.open(paymentLink, '_blank')
    } catch {
      alert('Failed to create payment link. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBook}
      disabled={loading}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Creating link...' : `Pay · ${formatINR(priceInr)} · Razorpay`}
    </button>
  )
}
