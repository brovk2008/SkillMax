import { NextRequest, NextResponse } from 'next/server'
import { CATEGORY_NAMES } from '@/lib/contracts'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const categoryId = parseInt(id)
  const categoryName = CATEGORY_NAMES[categoryId] ?? 'Other'

  return NextResponse.json({
    name: `${categoryName} Expert`,
    description: `Awarded for completing a verified ${categoryName} job on SkillMax`,
    image: `${process.env.NEXT_PUBLIC_APP_URL}/api/badge/image/${categoryId}`,
    attributes: [{ trait_type: 'Category', value: categoryName }],
  })
}
