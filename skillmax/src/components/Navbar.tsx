'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { NotifBadge } from '@/components/NotifBadge'
import { LocationPicker } from '@/components/LocationPicker'
import { createBrowserClient } from '@/lib/supabase/client'
import {
  Search,
  UserCheck,
  Trophy,
  MessageSquare,
  ClipboardList,
  HandHeart,
  Menu,
  X,
  Compass,
  Settings,
  LogOut,
} from 'lucide-react'

interface NavbarProps {
  user?: {
    id: string
    email?: string
    avatar_url?: string | null
    full_name?: string | null
    username?: string | null
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null)
  const [displayName, setDisplayName] = useState<string>(user?.full_name || user?.username || 'My Profile')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  // React-recommended pattern to close menu on pathname change without effect cascade
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    if (!user?.id) return
    let active = true

    try {
      const supabase = createBrowserClient()
      supabase
        .from('profiles')
        .select('avatar_url, full_name, username')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }: { data: { avatar_url?: string | null; full_name?: string | null; username?: string | null } | null }) => {
          if (!active) return
          if (data?.avatar_url) setAvatarUrl(data.avatar_url)
          if (data?.full_name) setDisplayName(data.full_name)
          else if (data?.username) setDisplayName(data.username)
        })
    } catch {
      // client error ignore
    }

    return () => {
      active = false
    }
  }, [user?.id])

  // Deterministic fallback avatar only if no custom avatar is set
  const fallbackSeed = user?.username || user?.email || user?.id || 'User'
  const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fallbackSeed)}`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo & Location Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="SkillMax"
              width={30}
              height={30}
              className="rounded-md object-contain size-7 sm:size-8"
            />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Skill<span className="text-emerald-600">Max</span>
            </span>
          </Link>

          {/* Browser Geolocation Selector (Tablet & Desktop) */}
          <LocationPicker />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4">
          {[
            { label: 'Browse Tasks', href: '/tasks', icon: ClipboardList },
            { label: 'Explore Skills', href: '/explore', icon: Compass },
            { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
            { label: 'Messages', href: '/messages', icon: MessageSquare },
            { label: 'Dashboard', href: '/dashboard' },
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
                {Icon && <Icon className="h-3.5 w-3.5 text-emerald-600" />}
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <WalletConnectButton />
          <NotifBadge userId={user?.id} />

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 sm:border-l sm:border-slate-200 sm:pl-3">
              {/* Quick action buttons - hidden on mobile phone to avoid overflow */}
              <Link
                href="/tasks/new"
                className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                title="Need help? Post a task request for local providers"
              >
                <ClipboardList className="h-3.5 w-3.5 text-emerald-600" />
                <span>Post Task</span>
              </Link>
              <Link
                href="/skills/new"
                className="hidden sm:flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                title="Available to help? Offer a skill service"
              >
                <HandHeart className="h-3.5 w-3.5" />
                <span>Offer Help</span>
              </Link>
              <Link
                href="/profile"
                className="size-7 sm:size-8 rounded-full border-2 border-emerald-500 overflow-hidden bg-emerald-50 flex items-center justify-center hover:scale-105 transition-transform shadow-2xs shrink-0"
                title={displayName}
              >
                <img
                  src={finalAvatar}
                  alt={displayName}
                  className="size-full object-cover"
                />
              </Link>
            </div>
          ) : (
            <Link
              href="/onboard"
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs shrink-0"
            >
              <UserCheck className="size-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden size-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          
          {/* User Profile Header in Menu */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="size-10 rounded-full border border-emerald-500 overflow-hidden bg-white shrink-0">
                <img src={finalAvatar} alt={displayName} className="size-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
              <Link
                href="/profile"
                className="text-[11px] font-bold text-emerald-700 hover:underline shrink-0"
              >
                View
              </Link>
            </div>
          )}

          {/* Primary Mobile Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/tasks/new"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs"
            >
              <ClipboardList className="size-4 text-emerald-600" />
              <span>Post Task</span>
            </Link>
            <Link
              href="/skills/new"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs"
            >
              <HandHeart className="size-4 text-emerald-100" />
              <span>Offer Skill</span>
            </Link>
          </div>

          {/* Navigation Links List */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            {[
              { label: 'Browse Open Tasks', href: '/tasks', icon: ClipboardList },
              { label: 'Explore Verified Skills', href: '/explore', icon: Compass },
              { label: 'Community Leaderboard', href: '/leaderboard', icon: Trophy },
              { label: 'Direct Messages', href: '/messages', icon: MessageSquare },
              { label: 'Dashboard & Escrows', href: '/dashboard', icon: Search },
              { label: 'Account Settings', href: '/settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`size-4 ${active ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Sign Out / Sign In link */}
          {user ? (
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/onboard"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-2xs"
              >
                <UserCheck className="size-4" />
                <span>Sign In or Create Account</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
