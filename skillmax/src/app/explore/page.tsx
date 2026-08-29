import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SkillCard from '@/components/SkillCard'
import { CATEGORIES } from '@/lib/contracts'

interface SearchParams { category?: string; q?: string }

export default async function ExplorePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const supabase = await createServerClient()
  const params = await searchParams
  const category = params.category
  const q = params.q

  let query = supabase
    .from('skills')
    .select('id, title, category, price_inr, price_mon, profiles(username, full_name, city)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: skills } = await query.limit(48)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Browse Skills</h1>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <form className="flex flex-1 gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search skills..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = (category ?? 'All') === cat
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/explore' : `/explore?category=${encodeURIComponent(cat)}`}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills?.map((skill) => (
          <SkillCard key={skill.id} skill={skill as any} />
        ))}
      </div>

      {skills?.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-gray-500">No skills found. Try a different search.</p>
        </div>
      )}
    </div>
  )
}
