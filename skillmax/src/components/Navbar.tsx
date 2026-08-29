'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { NotifBadge } from '@/components/NotifBadge'
import { MapPin, Search, Plus, UserCheck } from 'lucide-react'

interface NavbarProps {
  user?: {
    id: string
    email?: string
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand Logo & Location Dropdown */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SkillMax"
              width={34}
              height={34}
              className="rounded-md object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Skill<span className="text-emerald-600">Max</span>
            </span>
          </Link>

          {/* Urban Company Location Selector */}
          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>Delhi NCR</span>
            <span className="text-gray-400">▾</span>
          </div>
        </div>

        {/* Center Search Shortcut */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <Link
            href="/explore"
            className="w-full flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Search className="h-4 w-4 text-gray-400" />
            <span>Search for 'Electrician', 'Tutoring', 'Web Design'...</span>
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-5">
            {[
              { label: 'Explore', href: '/explore' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Profile', href: '/profile' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <WalletConnectButton />
            <NotifBadge userId={user?.id} />
            {user ? (
              <Link
                href="/skills/new"
                className="flex items-center gap-1 rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Offer Skill</span>
              </Link>
            ) : (
              <Link
                href="/onboard"
                className="flex items-center gap-1 rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
