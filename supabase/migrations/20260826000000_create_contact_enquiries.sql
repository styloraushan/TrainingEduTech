create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 320),
  interest text,
  created_at timestamptz not null default now(),
  email_sent_at timestamptz,
  email_error text
);

alter table public.contact_enquiries enable row level security;

-- The Edge Function uses the service-role key, so no browser-facing policies are created.

