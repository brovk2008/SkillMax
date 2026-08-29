'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { NotifBadge } from '@/components/NotifBadge'
import { LocationPicker } from '@/components/LocationPicker'
import { createBrowserClient } from '@/lib/supabase/client'
import { Search, Plus, UserCheck, Trophy, MessageSquare, ClipboardList, HandHeart } from 'lucide-react'

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

  useEffect(() => {
    if (!user?.id) return
    if (user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }

    try {
      const supabase = createBrowserClient()
      supabase
        .from('profiles')
        .select('avatar_url, full_name, username')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }: { data: any }) => {
          if (data?.avatar_url) setAvatarUrl(data.avatar_url)
          if (data?.full_name) setDisplayName(data.full_name)
          else if (data?.username) setDisplayName(data.username)
        })
    } catch (e) {
      // client error ignore
    }
  }, [user?.id, user?.avatar_url])

  // Deterministic fallback avatar only if no custom avatar is set
  const fallbackSeed = user?.username || user?.email || user?.id || 'User'
  const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fallbackSeed)}`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand Logo & Location Dropdown */}
        <div className="flex items-center gap-4">
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

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4">
          {[
            { label: 'Browse Tasks', href: '/tasks', icon: ClipboardList },
            { label: 'Explore Skills', href: '/explore' },
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
        <div className="flex items-center gap-2.5">
          <WalletConnectButton />
          <NotifBadge userId={user?.id} />

          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <Link
                href="/tasks/new"
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Need help? Post a task request for local providers"
              >
                <ClipboardList className="h-3.5 w-3.5 text-emerald-600" />
                <span>Post Task</span>
              </Link>
              <Link
                href="/skills/new"
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                title="Available to help? Offer a skill service"
              >
                <HandHeart className="h-3.5 w-3.5" />
                <span>Offer Help</span>
              </Link>
              <Link
                href="/profile"
                className="size-8 rounded-full border-2 border-emerald-500 overflow-hidden bg-emerald-50 flex items-center justify-center hover:scale-105 transition-transform shadow-xs shrink-0"
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
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
