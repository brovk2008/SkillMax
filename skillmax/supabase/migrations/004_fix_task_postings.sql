-- Fix task_postings schema
alter table task_postings 
add column if not exists category text default 'Other',
add column if not exists budget_mon numeric(18, 8);

do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='task_postings' and column_name='client_id') then
    if exists (select 1 from information_schema.columns where table_name='task_postings' and column_name='poster_id') then
      alter table task_postings rename column poster_id to client_id;
    else
      alter table task_postings add column client_id uuid references profiles(id) on delete cascade;
    end if;
  end if;
end $$;
