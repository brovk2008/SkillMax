import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { createServerClient } from '@/lib/supabase/server'

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
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Providers>
          <Navbar user={user ? { id: user.id, email: user.email } : null} />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-gray-200 py-8 text-center text-xs text-gray-400">
            SkillMax · Powered by Monad + Supabase + Razorpay
          </footer>
        </Providers>
      </body>
    </html>
  )
}
