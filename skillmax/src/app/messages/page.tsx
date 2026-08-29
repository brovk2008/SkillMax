import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageSquare, Clock, ArrowRight, User } from 'lucide-react'

export default async function MessagesInboxPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/onboard')

  // Query jobs where user is client or provider
  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      id, status, created_at, payment_method, price_mon, price_inr,
      skills(title, category),
      client_profile:profiles!client_id(full_name, username, avatar_url),
      provider_profile:profiles!provider_id(full_name, username, avatar_url),
      messages(id, content, created_at, sender_id)
    `)
    .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  const conversations = (jobs ?? []).map((j: any) => {
    const isClient = j.client_profile?.username === user.email
    const otherParty = isClient ? j.provider_profile : j.client_profile
    const lastMsg = j.messages?.[j.messages.length - 1]

    return {
      jobId: j.id,
      skillTitle: j.skills?.title ?? 'Service Request',
      category: j.skills?.category ?? 'General',
      status: j.status,
      otherPartyName: otherParty?.full_name ?? 'Community Member',
      otherPartyUsername: otherParty?.username ?? 'user',
      avatarUrl: otherParty?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastMessageText: lastMsg?.content ?? 'No chat messages yet. Click to start conversation.',
      lastMessageTime: lastMsg?.created_at ?? j.created_at,
    }
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6 bg-white">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-fuchsia-600" />
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Messages Inbox</h1>
        </div>
        <p className="text-xs text-slate-500">
          Real-time WebSocket conversations with clients and service providers on SkillMax.
        </p>
      </div>

      {/* Conversation List */}
      {conversations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
          <MessageSquare className="h-8 w-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No active conversations yet.</p>
          <p className="text-xs text-slate-400">Book a service or offer a skill to start messaging.</p>
          <Link
            href="/explore"
            className="inline-block rounded-lg bg-fuchsia-600 px-4 py-2 text-xs font-semibold text-white hover:bg-fuchsia-700 shadow-xs"
          >
            Explore Skills
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
          {conversations.map((conv) => (
            <Link
              key={conv.jobId}
              href={`/jobs/${conv.jobId}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <img
                  src={conv.avatarUrl}
                  alt={conv.otherPartyName}
                  className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-fuchsia-600 transition-colors truncate">
                      {conv.otherPartyName}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">@{conv.otherPartyUsername}</span>
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {conv.category}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                    {conv.skillTitle}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {conv.lastMessageText}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0 pl-4">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(conv.lastMessageTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Chat</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
