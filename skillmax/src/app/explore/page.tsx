import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SkillCard from '@/components/SkillCard'
import { CATEGORY_NAMES } from '@/lib/contracts'
import { MapPin, Search, ArrowRight } from 'lucide-react'

interface Props {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function ExplorePage({ searchParams }: Props) {
  const supabase = await createServerClient()
  const { category, q } = await searchParams

  let query = supabase
    .from('skills')
    .select('*, profiles(username, full_name, city, avatar_url)')
    .eq('is_active', true)

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: skills } = await query

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header & Filter Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Explore Services</h1>
            <p className="text-xs text-gray-500 mt-0.5">Find verified local professionals in your city</p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700">
            <MapPin className="h-3.5 w-3.5 text-fuchsia-600" />
            <span>Delhi NCR</span>
            <span className="text-gray-400">▾</span>
          </div>
        </div>

        {/* Search Bar */}
        <form action="/explore" method="GET" className="flex gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search for skills (e.g., Electrician, Tutoring, Plumbing)..."
              className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-fuchsia-600 px-5 py-2 text-xs font-semibold text-white hover:bg-fuchsia-700 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {['All', ...CATEGORY_NAMES].map((cat) => {
            const active = (category ?? 'All') === cat
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/explore' : `/explore?category=${encodeURIComponent(cat)}`}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-fuchsia-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-gray-500">
          Showing {skills?.length ?? 0} {skills?.length === 1 ? 'service' : 'services'}
          {category && category !== 'All' ? ` in ${category}` : ''}
        </p>
      </div>

      {/* Skills Grid */}
      {skills && skills.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill: any) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">No services found matching your search.</p>
          <Link
            href="/explore"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-700 hover:underline"
          >
            <span>Clear filters</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
