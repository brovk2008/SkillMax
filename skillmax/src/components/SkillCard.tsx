import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import { CheckCircle2, MapPin, ArrowRight } from 'lucide-react'

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
  const initials = skill.profiles.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() ?? 'SK'

  return (
    <Link href={`/skills/${skill.id}`} className="block group">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-emerald-500 hover:-translate-y-0.5 flex flex-col justify-between h-full">
        <div className="space-y-3">
          {/* Header Badge & Category */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {skill.category}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="size-3 text-emerald-600" />
              Verified
            </span>
          </div>

          {/* Service Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {skill.title}
          </h3>

          {/* Provider Details */}
          <div className="flex items-center gap-2.5 pt-1">
            <img
              src={skill.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={skill.profiles?.full_name}
              className="size-7 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{skill.profiles.full_name}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-0.5 truncate">
                <MapPin className="size-3 text-slate-400" />
                {skill.profiles.city}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Tabular Price Numbers & Book CTA */}
        <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
          <div className="tabular-nums">
            {skill.price_inr && (
              <p className="text-base font-extrabold text-slate-900">{formatINR(skill.price_inr)}</p>
            )}
            {skill.price_mon && (
              <p className="text-xs font-mono font-bold text-emerald-600">{skill.price_mon} MON</p>
            )}
          </div>

          <button className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white group-hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1">
            <span>Book Service</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </Link>
  )
}
