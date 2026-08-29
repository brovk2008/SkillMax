'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  profiles?: { full_name: string }
}

interface Props {
  jobId: string
  currentUserId: string
  initialMessages: Message[]
  disabled?: boolean
}

export default function JobChat({ jobId, currentUserId, initialMessages, disabled = false }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient()

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel(`job-chat-${jobId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_id=eq.${jobId}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', payload.new.sender_id)
            .single()

          setMessages((prev) => [
            ...prev,
            {
              id: payload.new.id,
              sender_id: payload.new.sender_id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              profiles: profile ?? { full_name: 'Unknown' },
            },
          ])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [jobId, supabase])

  async function handleSend() {
    if (!input.trim() || sending || disabled) return
    setSending(true)
    const content = input.trim()
    setInput('')

    const { error } = await supabase.from('messages').insert({
      job_id: jobId,
      sender_id: currentUserId,
      content,
    })

    if (error) {
      console.error('Send message error:', error)
      setInput(content)
    }
    setSending(false)
  }

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white" style={{ height: '420px' }}>
      <div className="border-b border-gray-200 px-4 py-3 font-medium text-sm text-gray-900 flex items-center justify-between">
        <span>Job Chat</span>
        <span className="flex items-center gap-1 text-xs font-normal text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Realtime
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">
            No messages yet. Send a message to get started.
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs text-gray-400 mb-0.5 px-1">
                  {isOwn ? 'You' : msg.profiles?.full_name ?? 'Other party'}
                </span>
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    isOwn
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-900 border border-gray-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-200 p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={disabled ? 'Chat closed' : 'Type a message...'}
          disabled={disabled}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim() || disabled}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
}
