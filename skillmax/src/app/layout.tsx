import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ShieldCheck, Zap } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillMax — Local Skill Marketplace on Monad',
  description: 'Hire local talent verified on-chain. Escrow powered by Monad Testnet. Payments via Razorpay.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <Providers>
          <Navbar user={user ? { id: user.id, email: user.email } : null} />
          <main className="min-h-screen">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-slate-50/70 py-10">
            <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">SkillMax Protocol</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[11px]">
                  <Zap className="h-3 w-3 text-emerald-600" />
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
