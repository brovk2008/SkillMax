import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import { MapPin, ArrowRight, Star, ShieldCheck } from 'lucide-react'

interface SkillCardProps {
  skill: {
    id: string
    title: string
    category: string
    price_inr: number | null
    price_mon: number | null
    profiles: {
      username: string
      full_name: string
      city: string
      avatar_url?: string | null
    }
  }
}

export default function SkillCard({ skill }: SkillCardProps) {
  // Deterministic seed for cartoon avatar
  const seed = skill.profiles?.username || skill.id || 'SkillPro'
  const cartoonAvatar = skill.profiles?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`

  return (
    <Link href={`/skills/${skill.id}`} className="block group">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-emerald-500 hover:-translate-y-0.5 flex flex-col justify-between h-full relative overflow-hidden">
        
        {/* Top subtle highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="space-y-3">
          {/* Header Category & Verified Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {skill.category}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="size-3 text-emerald-600" />
              <span>Verified Pro</span>
            </span>
          </div>

          {/* Service Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {skill.title}
          </h3>

          {/* Provider Cartoon Avatar & Details */}
          <div className="flex items-center gap-3 pt-1">
            <div className="size-10 rounded-full bg-emerald-50 border border-slate-200 p-0.5 shrink-0 overflow-hidden shadow-xs">
              <img
                src={cartoonAvatar}
                alt={skill.profiles?.full_name || 'Provider'}
                className="size-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900 truncate">{skill.profiles?.full_name || 'Local Expert'}</p>
                <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold shrink-0">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                <MapPin className="size-3 text-slate-400 shrink-0" />
                <span className="truncate">{skill.profiles?.city || 'Neighborhood Local'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Tabular Price Numbers & Book CTA */}
        <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
          <div className="tabular-nums space-y-0.5">
            {skill.price_inr && (
              <p className="text-base font-extrabold text-slate-900 leading-none">
                {formatINR(skill.price_inr)}
              </p>
            )}
            {skill.price_mon && (
              <p className="text-xs font-mono font-bold text-emerald-600 leading-none">
                {skill.price_mon} MON
              </p>
            )}
          </div>

          <span className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white group-hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1 shrink-0">
            <span>Book Service</span>
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
