import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { id: taskId } = await params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to accept tasks' }, { status: 401 })
    }

    // 1. Fetch task posting
    const { data: task, error: taskErr } = await supabase
      .from('task_postings')
      .select('*')
      .eq('id', taskId)
      .single()

    if (taskErr || !task) {
      return NextResponse.json({ error: 'Task posting not found' }, { status: 404 })
    }

    if (task.client_id === user.id) {
      return NextResponse.json({ error: 'You cannot accept your own task request' }, { status: 400 })
    }

    if (task.status !== 'open') {
      return NextResponse.json({ error: 'This task is already assigned or completed' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    // 2. Create active Job linking client and provider using admin client
    const { data: job, error: jobErr } = await supabaseAdmin
      .from('jobs')
      .insert({
        client_id: task.client_id,
        provider_id: user.id,
        status: 'active',
        payment_method: task.budget_mon ? 'crypto' : 'razorpay',
        price_inr: task.budget_inr,
        price_mon: task.budget_mon,
        custom_title: task.title,
      })
      .select()
      .single()

    if (jobErr || !job) {
      console.error('Job creation error:', jobErr)
      return NextResponse.json({ error: jobErr?.message || 'Failed to create job' }, { status: 500 })
    }

    // 3. Mark task as assigned
    await supabaseAdmin
      .from('task_postings')
      .update({ status: 'assigned' })
      .eq('id', taskId)

    // 4. Create initial chat message
    await supabaseAdmin.from('messages').insert({
      job_id: job.id,
      sender_id: user.id,
      content: `👋 Hi! I have accepted your task request: "${task.title}". Looking forward to coordinating with you!`,
    })

    // 5. Notify client
    await supabaseAdmin.from('notifications').insert({
      user_id: task.client_id,
      job_id: job.id,
      message: `A local specialist has accepted your task request: "${task.title}"!`,
    })

    return NextResponse.json({ ok: true, jobId: job.id })
  } catch (err: any) {
    console.error('Accept task exception:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
