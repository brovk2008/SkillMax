import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import { CheckCircle2, MapPin } from 'lucide-react'

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
      <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-gray-300 flex flex-col justify-between h-full">
        <div>
          {/* Header Badge & Category */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {skill.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Verified
            </span>
          </div>

          {/* Service Title */}
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {skill.title}
          </h3>

          {/* Provider Details */}
          <div className="mt-3 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{skill.profiles.full_name}</p>
              <p className="text-[11px] text-gray-500 flex items-center gap-0.5">
                <MapPin className="h-3 w-3 text-gray-400" />
                {skill.profiles.city}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-5 border-t border-gray-100 pt-3 flex items-center justify-between">
          <div>
            {skill.price_inr && (
              <p className="text-base font-bold text-gray-900">{formatINR(skill.price_inr)}</p>
            )}
            {skill.price_mon && (
              <p className="text-xs font-mono text-emerald-600">{skill.price_mon} MON</p>
            )}
          </div>

          <button className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm">
            Book Service
          </button>
        </div>
      </div>
    </Link>
  )
}
