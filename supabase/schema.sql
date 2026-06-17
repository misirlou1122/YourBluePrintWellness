create table if not exists public.wellness_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  record_key text not null,
  record_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, record_key)
);

alter table public.wellness_records enable row level security;
alter table public.wellness_records force row level security;

grant usage on schema public to authenticated;
revoke all on public.wellness_records from anon;
grant select, insert, update, delete on public.wellness_records to authenticated;

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

create table if not exists public.medical_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  file_name text not null,
  file_path text not null,
  content_type text not null,
  file_size bigint not null,
  extraction_status text not null default 'not_started',
  extracted_summary jsonb not null default '{}'::jsonb,
  uploaded_at timestamptz not null default now()
);

alter table public.medical_documents enable row level security;
alter table public.medical_documents force row level security;

revoke all on public.medical_documents from anon;
grant select, insert, update, delete on public.medical_documents to authenticated;

create index if not exists medical_documents_file_path_idx
on public.medical_documents (file_path);

drop policy if exists "Users can read their own medical documents" on public.medical_documents;
create policy "Users can read their own medical documents"
on public.medical_documents
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own medical documents" on public.medical_documents;
create policy "Users can insert their own medical documents"
on public.medical_documents
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own medical documents" on public.medical_documents;
create policy "Users can update their own medical documents"
on public.medical_documents
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own medical documents" on public.medical_documents;
create policy "Users can delete their own medical documents"
on public.medical_documents
for delete
to authenticated
using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medical-documents',
  'medical-documents',
  false,
  20971520,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read their own private files" on storage.objects;
create policy "Users can read their own private files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'medical-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create table if not exists public.function_rate_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);

alter table public.function_rate_limits enable row level security;
alter table public.function_rate_limits force row level security;
revoke all on public.function_rate_limits from anon, authenticated;

drop policy if exists "No client access to function rate limits" on public.function_rate_limits;
create policy "No client access to function rate limits"
on public.function_rate_limits
for all
to anon, authenticated
using (false)
with check (false);

create index if not exists function_rate_limits_user_action_created_at_idx
on public.function_rate_limits (user_id, action, created_at desc);

drop policy if exists "Users can upload their own private files" on storage.objects;
create policy "Users can upload their own private files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'medical-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can update their own private files" on storage.objects;
create policy "Users can update their own private files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'medical-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'medical-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can delete their own private files" on storage.objects;
create policy "Users can delete their own private files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'medical-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
