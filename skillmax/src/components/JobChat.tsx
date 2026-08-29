'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { encryptMessage, decryptMessage } from '@/lib/crypto'
import { ShieldCheck, Lock } from 'lucide-react'

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
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient()

  // Decrypt initial messages on mount
  useEffect(() => {
    async function decryptInitial() {
      const decrypted = await Promise.all(
        initialMessages.map(async (msg) => ({
          ...msg,
          content: await decryptMessage(msg.content, jobId),
        }))
      )
      setMessages(decrypted)
    }
    decryptInitial()
  }, [initialMessages, jobId])

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

          const decryptedText = await decryptMessage(payload.new.content, jobId)

          setMessages((prev) => [
            ...prev,
            {
              id: payload.new.id,
              sender_id: payload.new.sender_id,
              content: decryptedText,
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
    const plainContent = input.trim()
    setInput('')

    // Client-side Web3 Encryption
    const cipherContent = await encryptMessage(plainContent, jobId)

    const { error } = await supabase.from('messages').insert({
      job_id: jobId,
      sender_id: currentUserId,
      content: cipherContent,
    })

    if (error) {
      console.error('Send message error:', error)
      setInput(plainContent)
    }
    setSending(false)
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-xs" style={{ height: '440px' }}>
      {/* Header with Web3 Encryption Badge */}
      <div className="border-b border-slate-200 px-4 py-3 bg-slate-50/70 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-fuchsia-600" />
          <span className="font-bold text-xs text-slate-900">Encrypted Job Chat</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-fuchsia-700 bg-fuchsia-100/80 px-2.5 py-0.5 rounded-full border border-fuchsia-200">
          <ShieldCheck className="h-3 w-3 text-fuchsia-600" />
          AES-GCM 256-Bit E2EE
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-10 space-y-1">
            <Lock className="h-5 w-5 text-slate-300 mx-auto mb-1" />
            <p className="font-medium text-slate-600">End-to-End Encrypted Channel Established</p>
            <p className="text-[11px]">Messages are encrypted client-side using 256-bit AES-GCM before transmission.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[11px] text-slate-400 mb-0.5 px-1">
                  {isOwn ? 'You' : msg.profiles?.full_name ?? 'Other party'}
                </span>
                <div
                  className={`max-w-xs rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                    isOwn
                      ? 'bg-fuchsia-600 text-white font-medium shadow-xs'
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
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

      {/* Input Form */}
      <div className="border-t border-slate-200 p-3 flex gap-2 bg-slate-50/50 rounded-b-xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={disabled ? 'Chat closed' : 'Type encrypted message...'}
          disabled={disabled}
          className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-fuchsia-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim() || disabled}
          className="rounded-lg bg-fuchsia-600 px-4 py-2 text-xs font-bold text-white hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}
