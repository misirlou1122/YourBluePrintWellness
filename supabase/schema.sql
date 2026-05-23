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
  52428800,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/octet-stream']::text[]
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
