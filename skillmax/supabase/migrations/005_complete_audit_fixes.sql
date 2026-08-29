-- Migration 005: Complete schema fixes from security and functionality audit

-- 1. Create task_postings if not exists
create table if not exists task_postings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'Other',
  city text not null default 'Delhi NCR',
  budget_inr integer,
  budget_mon numeric(18,8),
  status text not null default 'open' check (status in ('open', 'assigned', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- 2. Add columns to jobs table
alter table jobs
  add column if not exists chain_job_id bigint,
  add column if not exists custom_title text;

-- 3. Add columns to profiles table
alter table profiles
  add column if not exists headline text,
  add column if not exists gender text,
  add column if not exists phone text,
  add column if not exists skill_tags text[];

-- 4. Enable RLS on task_postings
alter table task_postings enable row level security;

-- Drop existing task_postings policies if needed to avoid duplicate conflicts
drop policy if exists "task_postings_select" on task_postings;
drop policy if exists "task_postings_insert" on task_postings;
drop policy if exists "task_postings_update" on task_postings;
drop policy if exists "task_postings_delete" on task_postings;

create policy "task_postings_select" on task_postings
  for select using (true);

create policy "task_postings_insert" on task_postings
  for insert with check (auth.uid() = client_id);

create policy "task_postings_update" on task_postings
  for update using (auth.uid() = client_id or auth.uid() is not null);

create policy "task_postings_delete" on task_postings
  for delete using (auth.uid() = client_id);

-- 5. Notifications policies
alter table notifications enable row level security;
drop policy if exists "notifications_insert" on notifications;

create policy "notifications_insert" on notifications
  for insert with check (auth.uid() is not null);
