'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, Plus, User, Compass } from 'lucide-react'

interface MobileBottomNavProps {
  user?: {
    id: string
    avatar_url?: string | null
  } | null
}

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Tasks', href: '/tasks', icon: ClipboardList },
    { label: 'Post', href: '/tasks/new', icon: Plus, isAction: true },
    { label: 'Explore', href: '/explore', icon: Compass },
    {
      label: user ? 'Account' : 'Sign In',
      href: user ? '/dashboard' : '/onboard',
      icon: User,
      avatar: user?.avatar_url,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg safe-area-inset">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          if (item.isAction) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group"
              >
                <div className="size-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:bg-emerald-700 group-active:scale-95 transition-all border-2 border-white">
                  <Plus className="size-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-0.5">Post</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              {item.avatar ? (
                <div className={`size-5 rounded-full overflow-hidden border ${isActive ? 'border-emerald-600 ring-1 ring-emerald-500' : 'border-slate-300'}`}>
                  <img src={item.avatar} alt="Profile" className="size-full object-cover" />
                </div>
              ) : (
                <Icon className={`size-5 ${isActive ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-500 stroke-[1.8]'}`} />
              )}
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
