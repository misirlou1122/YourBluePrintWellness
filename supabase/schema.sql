create table if not exists public.wellness_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  record_key text not null,
  record_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, record_key)
);

alter table public.wellness_records enable row level security;

drop policy if exists "Users can read their own wellness records" on public.wellness_records;
create policy "Users can read their own wellness records"
on public.wellness_records
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own wellness records" on public.wellness_records;
create policy "Users can insert their own wellness records"
on public.wellness_records
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own wellness records" on public.wellness_records;
create policy "Users can update their own wellness records"
on public.wellness_records
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own wellness records" on public.wellness_records;
create policy "Users can delete their own wellness records"
on public.wellness_records
for delete
to authenticated
using ((select auth.uid()) = user_id);
