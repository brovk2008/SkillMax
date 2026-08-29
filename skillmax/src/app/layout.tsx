import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Zap } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#059669',
}

export const metadata: Metadata = {
  title: 'SkillMax — Hyperlocal Skill Sharing Protocol on Monad',
  description:
    'SkillMax empowers local communities to exchange real-world skills, offer everyday services, build verifiable proof-of-reputation, and earn in INR & MON tokens.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  let profile = null

  try {
    const supabase = await createServerClient()
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle()
      profile = prof
    }
  } catch {
    // Static generation edge case — safe to ignore
  }

  const userPayload = user
    ? {
        id: user.id,
        email: user.email,
        avatar_url: profile?.avatar_url || null,
        full_name: profile?.full_name || null,
        username: profile?.username || null,
      }
    : null

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 antialiased overflow-x-hidden`}>
        <Providers>
          <Navbar user={userPayload} />
          
          {/* Main content with bottom padding on mobile so it clears the bottom nav bar */}
          <main className="min-h-screen pb-24 lg:pb-0 overflow-x-hidden">{children}</main>

          {/* Dedicated Mobile App Bottom Navigation */}
          <MobileBottomNav user={userPayload} />

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-slate-50/70 py-10 mb-16 lg:mb-0">
            <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">SkillMax Protocol</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[11px]">
                  <Zap className="size-3 text-emerald-600" />
                  Monad Chain ID 10143
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 font-medium">
                <Link href="/terms" className="hover:text-slate-900 hover:underline transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-slate-900 hover:underline transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/tasks" className="hover:text-slate-900 hover:underline transition-colors">
                  Browse Tasks
                </Link>
                <Link href="/leaderboard" className="hover:text-slate-900 hover:underline transition-colors">
                  Leaderboard
                </Link>
              </div>

              <div className="text-[11px] text-slate-400">
                © 2026 SkillMax · All Escrows Non-Custodial on Monad Testnet
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
