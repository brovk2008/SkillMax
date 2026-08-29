import { NextRequest, NextResponse } from 'next/server'
import { CATEGORY_NAMES } from '@/lib/contracts'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const categoryId = parseInt(id) || 0
  const categoryName = CATEGORY_NAMES[categoryId] ?? 'Specialist'

  const svg = `
<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="400" height="400" rx="32" fill="url(#bgGrad)" />
  <rect x="12" y="12" width="376" height="376" rx="24" stroke="#10b981" stroke-width="2" stroke-opacity="0.3" fill="none" />

  <!-- Monad Badge Center Medallion -->
  <circle cx="200" cy="170" r="85" fill="#022c22" stroke="url(#goldGrad)" stroke-width="4" filter="url(#glow)" />

  <!-- Shield Icon Graphic -->
  <path d="M200 115 L255 140 V185 C255 220 200 245 200 245 C200 245 145 220 145 185 V140 Z" fill="#059669" stroke="#34d399" stroke-width="3" />

  <!-- Verified Star in Shield -->
  <polygon points="200,145 206,163 225,163 210,174 216,192 200,181 184,192 190,174 175,163 194,163" fill="#ffffff" />

  <!-- Category Title & On-Chain Proof -->
  <text x="200" y="295" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="22" letter-spacing="0.5">
    ${categoryName.toUpperCase()}
  </text>
  
  <text x="200" y="325" text-anchor="middle" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" letter-spacing="1">
    VERIFIED SOULBOUND REPUTATION
  </text>

  <text x="200" y="355" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="11">
    Monad Testnet · SkillMax Escrow
  </text>
</svg>
  `.trim()

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
