-- SkillMax — Database Migration v1
-- Run this in Supabase SQL Editor

-- Extensions
create extension if not exists "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  username      text unique not null,
  full_name     text not null,
  city          text not null,
  bio           text,
  avatar_url    text,
  wallet_address text,
  is_verified   boolean default false,
  created_at    timestamptz default now()
);

-- ── Skills ────────────────────────────────────────────────────────────────────
create table if not exists skills (
  id          uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references profiles(id) on delete cascade,
  title       text not null,
  description text,
  category    text not null,
  price_inr   integer,          -- in INR
  price_mon   numeric(18, 8),   -- in MON
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ── Jobs ──────────────────────────────────────────────────────────────────────
create table if not exists jobs (
  id                        uuid primary key default uuid_generate_v4(),
  skill_id                  uuid references skills(id),
  client_id                 uuid not null references profiles(id),
  provider_id               uuid not null references profiles(id),
  status                    text not null default 'pending'
                              check (status in ('pending','active','client_done','provider_done','completed','disputed','resolved','cancelled')),
  payment_method            text not null check (payment_method in ('crypto','razorpay')),
  price_inr                 integer,
  price_mon                 numeric(18, 8),
  -- Blockchain tx hashes
  chain_tx_create           text,
  chain_tx_complete         text,
  chain_tx_dispute          text,
  -- Razorpay
  razorpay_payment_link_id  text,
  razorpay_payment_id       text,
  -- Dispute
  dispute_reason            text,
  -- Badge
  badge_minted              boolean default false,
  -- Timestamps
  completed_at              timestamptz,
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

-- ── Messages ──────────────────────────────────────────────────────────────────
create table if not exists messages (
  id          uuid primary key default uuid_generate_v4(),
  job_id      uuid not null references jobs(id) on delete cascade,
  sender_id   uuid not null references profiles(id),
  content     text not null check (char_length(content) <= 2000),
  created_at  timestamptz default now()
);

-- ── Notifications ─────────────────────────────────────────────────────────────
create table if not exists notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  job_id      uuid references jobs(id) on delete set null,
  message     text not null,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- ── Reviews ───────────────────────────────────────────────────────────────────
create table if not exists reviews (
  id          uuid primary key default uuid_generate_v4(),
  job_id      uuid not null unique references jobs(id),
  reviewer_id uuid not null references profiles(id),
  reviewee_id uuid not null references profiles(id),
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists idx_skills_provider on skills(provider_id);
create index if not exists idx_skills_category on skills(category);
create index if not exists idx_skills_active on skills(is_active);
create index if not exists idx_jobs_client on jobs(client_id);
create index if not exists idx_jobs_provider on jobs(provider_id);
create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_messages_job on messages(job_id);
create index if not exists idx_notifications_user_unread on notifications(user_id, is_read);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table skills enable row level security;
alter table jobs enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table reviews enable row level security;

-- Profiles: public read, own write
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- Skills: public read, provider write
create policy "skills_select" on skills for select using (true);
create policy "skills_insert" on skills for insert with check (auth.uid() = provider_id);
create policy "skills_update" on skills for update using (auth.uid() = provider_id);
create policy "skills_delete" on skills for delete using (auth.uid() = provider_id);

-- Jobs: only participants can see/update
create policy "jobs_select" on jobs for select
  using (auth.uid() = client_id or auth.uid() = provider_id);
create policy "jobs_insert" on jobs for insert
  with check (auth.uid() = client_id);
create policy "jobs_update" on jobs for update
  using (auth.uid() = client_id or auth.uid() = provider_id);

-- Messages: only job participants
create policy "messages_select" on messages for select
  using (
    exists (
      select 1 from jobs j
      where j.id = job_id
        and (j.client_id = auth.uid() or j.provider_id = auth.uid())
    )
  );
create policy "messages_insert" on messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from jobs j
      where j.id = job_id
        and (j.client_id = auth.uid() or j.provider_id = auth.uid())
    )
  );

-- Notifications: own only
create policy "notifications_select" on notifications for select using (auth.uid() = user_id);
create policy "notifications_update" on notifications for update using (auth.uid() = user_id);

-- Reviews: public read, reviewer write
create policy "reviews_select" on reviews for select using (true);
create policy "reviews_insert" on reviews for insert with check (auth.uid() = reviewer_id);

-- ── Realtime ──────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table jobs;
