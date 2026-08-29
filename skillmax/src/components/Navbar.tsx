'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { NotifBadge } from '@/components/NotifBadge'
import { LocationPicker } from '@/components/LocationPicker'
import { Search, Plus, UserCheck, Trophy } from 'lucide-react'

interface NavbarProps {
  user?: {
    id: string
    email?: string
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand Logo & Location Dropdown */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SkillMax"
              width={34}
              height={34}
              className="rounded-md object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Skill<span className="text-emerald-600">Max</span>
            </span>
          </Link>

          {/* Browser Geolocation Selector */}
          <LocationPicker />
        </div>

        {/* Center Search Shortcut */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-6">
          <Link
            href="/explore"
            className="w-full flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search for services (e.g. Electrician, Tutoring)...</span>
          </Link>
        </div>

        {/* Right Navigation Links & Actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-4">
            {[
              { label: 'Explore', href: '/explore' },
              { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Profile', href: '/profile' },
            ].map((link) => {
              const Icon = link.icon
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                    active
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5 text-amber-500" />}
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <WalletConnectButton />
            <NotifBadge userId={user?.id} />
            {user ? (
              <Link
                href="/skills/new"
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Offer Skill</span>
              </Link>
            ) : (
              <Link
                href="/onboard"
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
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
