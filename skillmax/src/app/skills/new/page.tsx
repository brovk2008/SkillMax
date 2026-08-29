import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import SkillForm from '@/components/SkillForm'

export default async function NewSkillPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/onboard')

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Add a Skill</h1>
      <p className="mt-2 text-sm text-gray-500">
        List a skill to start receiving bookings.
      </p>
      <div className="mt-6">
        <SkillForm userId={user.id} />
      </div>
    </div>
  )
}
