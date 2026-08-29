'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WalletConnectButton } from './WalletConnectButton'
import { NotifBadge } from './NotifBadge'

export function Navbar({ userId }: { userId?: string }) {
  const pathname = usePathname()

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    ...(userId ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/profile', label: 'Profile' },
    ] : []),
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="SkillMax" width={32} height={32} className="rounded" />
          <span className="text-base font-semibold text-gray-900">SkillMax</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {userId && (
            <Link href="/notifications" className="relative">
              <NotifBadge userId={userId} />
            </Link>
          )}
          <WalletConnectButton />
          {!userId ? (
            <Link
              href="/onboard"
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Sign In
            </Link>
          ) : (
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  )
}
