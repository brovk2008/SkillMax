import Link from 'next/link'
import { formatINR } from '@/lib/utils'

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
  return (
    <Link href={`/skills/${skill.id}`}>
      <div className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600 shrink-0">
            {skill.category}
          </span>
          <div className="text-right">
            {skill.price_inr && (
              <p className="text-sm font-semibold text-gray-900">{formatINR(skill.price_inr)}</p>
            )}
            {skill.price_mon && (
              <p className="text-xs text-gray-500">{skill.price_mon} MON</p>
            )}
          </div>
        </div>
        <h3 className="mt-3 text-base font-medium text-gray-900 flex-1">{skill.title}</h3>
        <p className="mt-2 text-xs text-gray-500">
          {skill.profiles.full_name} · {skill.profiles.city}
        </p>
      </div>
    </Link>
  )
}
