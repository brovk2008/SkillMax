import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/onboard')
  const supabase = await createServerClient()

  const { data: notifs } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Mark all as read
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
      <div className="mt-6 space-y-2">
        {notifs?.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">No notifications yet.</p>
        )}
        {notifs?.map((n) => (
          <div key={n.id} className={`rounded-lg border p-4 ${n.is_read ? 'border-gray-200 bg-white' : 'border-emerald-200 bg-emerald-50'}`}>
            <p className="text-sm text-gray-900">{n.message}</p>
            <p className="mt-1 text-xs text-gray-400">{new Date(n.created_at).toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
