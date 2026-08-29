'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  profiles: { full_name: string }
}

interface JobChatProps {
  jobId: string
  currentUserId: string
  initialMessages: Message[]
  disabled?: boolean
}

export default function JobChat({ jobId, currentUserId, initialMessages, disabled }: JobChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    const channel = supabase
      .channel(`job-chat-${jobId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `job_id=eq.${jobId}` },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', payload.new.sender_id)
            .single()
          setMessages((prev) => [
            ...prev,
            { ...(payload.new as Message), profiles: profile ?? { full_name: 'Unknown' } },
          ])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [jobId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const content = input.trim()
    if (!content || sending || disabled) return
    setSending(true)
    setInput('')
    const { error } = await supabase
      .from('messages')
      .insert({ job_id: jobId, sender_id: currentUserId, content })
    if (error) {
      setInput(content)
    }
    setSending(false)
  }

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white" style={{ height: '400px' }}>
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-sm font-medium text-gray-900">Job Chat</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400 text-center pt-4">No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
              <p className="text-xs text-gray-500 mb-1">{msg.profiles.full_name}</p>
              <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${isOwn ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-200 px-4 py-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={disabled ? 'Chat closed' : 'Type a message...'}
          disabled={disabled}
          maxLength={2000}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim() || !!disabled}
          className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
}
